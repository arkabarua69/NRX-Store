from flask import Blueprint, request
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success_response, error_response, paginated_response
from app.utils.auth import require_admin
from app.utils.validators import validate_request, UpdateOrderStatusSchema, CreateGameSchema, CreateProductSchema
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

def get_or_create_game(game_identifier):
    """
    Get game by ID or name, create if doesn't exist
    Returns game UUID
    """
    supabase = get_supabase_admin()
    
    # Check if it's already a UUID
    try:
        import uuid
        uuid.UUID(game_identifier)
        # It's a valid UUID, return as is
        return game_identifier
    except (ValueError, AttributeError):
        # It's a game name, search for it
        pass
    
    # Search for game by name
    response = supabase.table('games').select('id').eq('name', game_identifier).execute()
    
    if response.data and len(response.data) > 0:
        # Game exists, return its ID
        print(f"✅ Found existing game: {game_identifier} -> {response.data[0]['id']}")
        return response.data[0]['id']
    
    # Game doesn't exist, create it
    # Generate slug from name
    import re
    slug = re.sub(r'[^a-z0-9]+', '-', game_identifier.lower()).strip('-')
    
    new_game = {
        'name': game_identifier,
        'slug': slug,
        'category': 'standard',
        'is_active': True,
        'image_url': '/placeholder.svg',
        'banner_url': '/placeholder.svg'
    }
    
    create_response = supabase.table('games').insert(new_game).execute()
    
    if create_response.data and len(create_response.data) > 0:
        game_id = create_response.data[0]['id']
        print(f"✅ Created new game: {game_identifier} -> {game_id}")
        return game_id
    
    raise Exception(f"Failed to create game: {game_identifier}")

@admin_bp.route('/stats', methods=['GET'])
@require_admin
def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        supabase = get_supabase_admin()
        
        # Total orders
        total_orders = supabase.table('orders').select('*', count='exact').execute()
        
        # Orders by status
        pending = supabase.table('orders').select('*', count='exact').eq('status', 'pending').execute()
        processing = supabase.table('orders').select('*', count='exact').eq('status', 'processing').execute()
        completed = supabase.table('orders').select('*', count='exact').eq('status', 'completed').execute()
        
        # Total revenue (completed orders)
        revenue_data = supabase.table('orders').select('total_amount').eq('status', 'completed').execute()
        total_revenue = sum([order.get('total_amount', 0) for order in revenue_data.data])
        
        # Total users
        users = supabase.table('users').select('*', count='exact').execute()
        
        # Total products
        products = supabase.table('topup_packages').select('*', count='exact').execute()
        active_products = supabase.table('topup_packages').select('*', count='exact').eq('is_active', True).execute()
        
        # Total games
        games = supabase.table('games').select('*', count='exact').execute()
        
        stats = {
            'total_orders': total_orders.count or 0,
            'pending_orders': pending.count or 0,
            'processing_orders': processing.count or 0,
            'completed_orders': completed.count or 0,
            'total_revenue': total_revenue,
            'total_users': users.count or 0,
            'total_products': products.count or 0,
            'active_products': active_products.count or 0,
            'total_games': games.count or 0
        }
        
        return success_response(stats)
        
    except Exception as e:
        return error_response(f'Error fetching stats: {str(e)}', status_code=500)

@admin_bp.route('/check', methods=['POST'])
def check_admin_status():
    """Check if user is admin by checking settings.adminEmails"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return error_response('Email is required', status_code=400)
        
        supabase = get_supabase_admin()
        
        # Get admin emails from settings table
        settings_response = supabase.table('settings').select('data').eq('id', 1).execute()
        
        if not settings_response.data or len(settings_response.data) == 0:
            # If no settings exist, check default admin email
            default_admin_emails = ['gunjonarka@gmail.com']
            is_admin = email in default_admin_emails
            print(f"⚠️ No settings found, using default admin emails. Is {email} admin? {is_admin}")
            return success_response({'isAdmin': is_admin})
        
        # Extract adminEmails from settings data
        settings_data = settings_response.data[0].get('data', {})
        admin_emails = settings_data.get('adminEmails', ['gunjonarka@gmail.com'])
        
        # Check if email is in admin list
        is_admin = email in admin_emails
        
        print(f"✅ Admin check for {email}: {is_admin}")
        print(f"   Admin emails list: {admin_emails}")
        
        return success_response({'isAdmin': is_admin})
        
    except Exception as e:
        print(f"❌ Error checking admin status: {str(e)}")
        return error_response(f'Error checking admin status: {str(e)}', status_code=500)

@admin_bp.route('/orders', methods=['GET'])
@require_admin
def get_all_orders():
    """Get all orders (admin only)"""
    try:
        supabase = get_supabase_admin()
        
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 20))
        status = request.args.get('status')
        
        query = supabase.table('orders').select('*, topup_packages(*, games(*)), users:user_id(email)', count='exact')
        
        if status:
            query = query.eq('status', status)
        
        offset = (page - 1) * page_size
        response = query.order('created_at', desc=True).range(offset, offset + page_size - 1).execute()
        
        return paginated_response(response.data, page, page_size, response.count)
        
    except Exception as e:
        return error_response(f'Error fetching orders: {str(e)}', status_code=500)

@admin_bp.route('/orders/<order_id>/status', methods=['PATCH'])
@require_admin
@validate_request(UpdateOrderStatusSchema)
def update_order_status(order_id):
    """Update order status (admin only)"""
    try:
        data = request.validated_data
        user = request.current_user
        supabase = get_supabase_admin()
        
        update_data = {
            'status': data.status,
            'admin_notes': data.admin_notes,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        response = supabase.table('orders').update(update_data).eq('id', order_id).execute()
        
        if not response.data:
            return error_response('Order not found', status_code=404)
        
        # Log admin action (using correct column names from FINAL_SCHEMA)
        try:
            log_data = {
                'admin_id': user.id,
                'action': 'update_order_status',
                'target_type': 'order',
                'target_id': order_id,
                'details': {'status': data.status, 'notes': data.admin_notes}
            }
            supabase.table('admin_logs').insert(log_data).execute()
        except Exception as log_error:
            print(f"⚠️ Failed to log admin action: {str(log_error)}")
        
        return success_response(response.data[0], 'Order status updated successfully')
        
    except Exception as e:
        return error_response(f'Error updating order: {str(e)}', status_code=500)

@admin_bp.route('/games', methods=['POST'])
@require_admin
@validate_request(CreateGameSchema)
def create_game():
    """Create new game (admin only)"""
    try:
        data = request.validated_data
        user = request.current_user
        supabase = get_supabase_admin()
        
        game_data = {
            'name': data.name,
            'slug': data.slug,
            'description': data.description,
            'image_url': data.image_url,
            'category': data.category,
            'is_active': data.is_active,
            'created_at': datetime.utcnow().isoformat()
        }
        
        response = supabase.table('games').insert(game_data).execute()
        
        # Log admin action (using correct column names from FINAL_SCHEMA)
        try:
            log_data = {
                'admin_id': user.id,
                'action': 'create_game',
                'target_type': 'game',
                'target_id': response.data[0]['id'],
                'details': {'name': data.name}
            }
            supabase.table('admin_logs').insert(log_data).execute()
        except Exception as log_error:
            print(f"⚠️ Failed to log admin action: {str(log_error)}")
        
        return success_response(response.data[0], 'Game created successfully', 201)
        
    except Exception as e:
        return error_response(f'Error creating game: {str(e)}', status_code=500)

@admin_bp.route('/games/<game_id>', methods=['PUT'])
@require_admin
def update_game(game_id):
    """Update game (admin only)"""
    try:
        data = request.get_json()
        user = request.current_user
        supabase = get_supabase_admin()
        
        data['updated_at'] = datetime.utcnow().isoformat()
        response = supabase.table('games').update(data).eq('id', game_id).execute()
        
        if not response.data:
            return error_response('Game not found', status_code=404)
        
        # Log admin action (using correct column names from FINAL_SCHEMA)
        try:
            log_data = {
                'admin_id': user.id,
                'action': 'update_game',
                'target_type': 'game',
                'target_id': game_id,
                'new_values': data
            }
            supabase.table('admin_logs').insert(log_data).execute()
        except Exception as log_error:
            print(f"⚠️ Failed to log admin action: {str(log_error)}")
        
        return success_response(response.data[0], 'Game updated successfully')
        
    except Exception as e:
        return error_response(f'Error updating game: {str(e)}', status_code=500)

@admin_bp.route('/games/<game_id>', methods=['DELETE'])
@require_admin
def delete_game(game_id):
    """Delete game (admin only)"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        response = supabase.table('games').delete().eq('id', game_id).execute()
        
        if not response.data:
            return error_response('Game not found', status_code=404)
        
        # Log admin action (using correct column names from FINAL_SCHEMA)
        try:
            log_data = {
                'admin_id': user.id,
                'action': 'delete_game',
                'target_type': 'game',
                'target_id': game_id
            }
            supabase.table('admin_logs').insert(log_data).execute()
        except Exception as log_error:
            print(f"⚠️ Failed to log admin action: {str(log_error)}")
        
        return success_response(message='Game deleted successfully')
        
    except Exception as e:
        return error_response(f'Error deleting game: {str(e)}', status_code=500)

@admin_bp.route('/products', methods=['POST'])
@require_admin
@validate_request(CreateProductSchema)
def create_product():
    """Create new product (admin only)"""
    try:
        data = request.validated_data
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Convert game name to UUID if needed
        game_id = get_or_create_game(data.game_id)
        
        product_data = {
            'game_id': game_id,
            'name': data.name,
            'description': data.description,
            'price': data.price,
            'original_price': data.original_price,
            'currency': data.currency,
            'stock': data.stock,
            'is_featured': data.is_featured,
            'is_active': data.is_active,
            'diamonds': data.diamonds,
            'image_url': data.image_url,
            'category': data.category if hasattr(data, 'category') else 'standard',
            'created_at': datetime.utcnow().isoformat()
        }
        
        response = supabase.table('topup_packages').insert(product_data).execute()
        
        # Log admin action (using correct column names from FINAL_SCHEMA)
        try:
            log_data = {
                'admin_id': user.id,
                'action': 'create_product',
                'target_type': 'product',
                'target_id': response.data[0]['id'],
                'details': {'name': data.name, 'price': data.price}
            }
            supabase.table('admin_logs').insert(log_data).execute()
        except Exception as log_error:
            # Don't fail product creation if logging fails
            print(f"⚠️ Failed to log admin action: {str(log_error)}")
        
        print(f"✅ Product created successfully: {data.name}")
        return success_response(response.data[0], 'Product created successfully', 201)
        
    except Exception as e:
        print(f"❌ Error creating product: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error creating product: {str(e)}', status_code=500)

@admin_bp.route('/products/<product_id>', methods=['PUT'])
@require_admin
def update_product(product_id):
    """Update product (admin only)"""
    try:
        data = request.get_json()
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Convert game name to UUID if needed (same as create_product)
        if 'gameId' in data or 'game_id' in data:
            game_identifier = data.get('gameId') or data.get('game_id')
            if game_identifier:
                game_id = get_or_create_game(game_identifier)
                data['game_id'] = game_id
                # Remove gameId if it exists (use game_id for database)
                data.pop('gameId', None)
        
        data['updated_at'] = datetime.utcnow().isoformat()
        response = supabase.table('topup_packages').update(data).eq('id', product_id).execute()
        
        if not response.data:
            return error_response('Product not found', status_code=404)
        
        # Log admin action (using correct column names from FINAL_SCHEMA)
        try:
            log_data = {
                'admin_id': user.id,
                'action': 'update_product',
                'target_type': 'product',
                'target_id': product_id,
                'new_values': data
            }
            supabase.table('admin_logs').insert(log_data).execute()
        except Exception as log_error:
            # Don't fail product update if logging fails
            print(f"⚠️ Failed to log admin action: {str(log_error)}")
        
        print(f"✅ Product updated successfully: {product_id}")
        return success_response(response.data[0], 'Product updated successfully')
        
    except Exception as e:
        print(f"❌ Error updating product: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error updating product: {str(e)}', status_code=500)

@admin_bp.route('/products/<product_id>', methods=['DELETE'])
@require_admin
def delete_product(product_id):
    """Delete product (admin only)"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Check if product is referenced in any orders
        orders_check = supabase.table('orders').select('id').eq('product_id', product_id).limit(1).execute()
        
        if orders_check.data and len(orders_check.data) > 0:
            return error_response(
                'এই প্রোডাক্টটি মুছে ফেলা যাবে না কারণ এটি অর্ডারে ব্যবহৃত হয়েছে। পরিবর্তে প্রোডাক্টটি নিষ্ক্রিয় করুন।',
                status_code=400
            )
        
        # If no orders reference this product, safe to delete
        response = supabase.table('topup_packages').delete().eq('id', product_id).execute()
        
        if not response.data:
            return error_response('Product not found', status_code=404)
        
        # Log admin action (using correct column names from FINAL_SCHEMA)
        try:
            log_data = {
                'admin_id': user.id,
                'action': 'delete_product',
                'target_type': 'product',
                'target_id': product_id
            }
            supabase.table('admin_logs').insert(log_data).execute()
        except Exception as log_error:
            # Don't fail product deletion if logging fails
            print(f"⚠️ Failed to log admin action: {str(log_error)}")
        
        print(f"✅ Product deleted successfully: {product_id}")
        return success_response(message='Product deleted successfully')
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Error deleting product: {error_msg}")
        import traceback
        traceback.print_exc()
        
        # Check if it's a foreign key constraint error
        if '23503' in error_msg or 'foreign key constraint' in error_msg.lower():
            return error_response(
                'এই প্রোডাক্টটি মুছে ফেলা যাবে না কারণ এটি অর্ডারে ব্যবহৃত হয়েছে। পরিবর্তে প্রোডাক্টটি নিষ্ক্রিয় করুন।',
                status_code=400
            )
        
        return error_response(f'Error deleting product: {error_msg}', status_code=500)

@admin_bp.route('/products/bulk', methods=['POST'])
@require_admin
def bulk_product_action():
    """Perform bulk action on products (admin only)"""
    try:
        data = request.get_json()
        action = data.get('action')
        product_ids = data.get('productIds', [])
        user = request.current_user
        
        if not action or not product_ids:
            return error_response('Action and productIds are required', status_code=400)
        
        if not isinstance(product_ids, list) or len(product_ids) == 0:
            return error_response('productIds must be a non-empty array', status_code=400)
        
        supabase = get_supabase_admin()
        
        # Determine update data based on action
        update_data = {'updated_at': datetime.utcnow().isoformat()}
        
        if action == 'activate':
            update_data['is_active'] = True
        elif action == 'deactivate':
            update_data['is_active'] = False
        elif action == 'feature':
            update_data['is_featured'] = True
        elif action == 'unfeature':
            update_data['is_featured'] = False
        else:
            return error_response(f'Invalid action: {action}', status_code=400)
        
        # Update all products
        updated_count = 0
        for product_id in product_ids:
            try:
                response = supabase.table('topup_packages').update(update_data).eq('id', product_id).execute()
                if response.data:
                    updated_count += 1
            except Exception as e:
                print(f"Error updating product {product_id}: {str(e)}")
        
        # Log admin action (using correct column names from FINAL_SCHEMA)
        try:
            log_data = {
                'admin_id': user.id,
                'action': f'bulk_{action}',
                'target_type': 'product',
                'target_id': None,
                'details': {'product_ids': product_ids, 'count': updated_count}
            }
            supabase.table('admin_logs').insert(log_data).execute()
        except Exception as log_error:
            print(f"⚠️ Failed to log admin action: {str(log_error)}")
        
        return success_response(
            {'updated_count': updated_count, 'total': len(product_ids)},
            f'Successfully {action}d {updated_count} product(s)'
        )
        
    except Exception as e:
        return error_response(f'Error performing bulk action: {str(e)}', status_code=500)

@admin_bp.route('/products/duplicate', methods=['POST'])
@require_admin
def duplicate_product():
    """Duplicate a product (admin only)"""
    try:
        data = request.get_json()
        product_id = data.get('productId')
        modifications = data.get('modifications', {})
        user = request.current_user
        
        if not product_id:
            return error_response('productId is required', status_code=400)
        
        supabase = get_supabase_admin()
        
        # Get original product
        original = supabase.table('topup_packages').select('*').eq('id', product_id).execute()
        
        if not original.data:
            return error_response('Product not found', status_code=404)
        
        # Create duplicate
        product_data = original.data[0].copy()
        product_data.pop('id', None)
        product_data.pop('created_at', None)
        product_data.pop('updated_at', None)
        
        # Apply modifications
        product_data.update(modifications)
        
        # Add suffix to name
        product_data['name'] = f"{product_data['name']} (Copy)"
        product_data['created_at'] = datetime.utcnow().isoformat()
        
        response = supabase.table('topup_packages').insert(product_data).execute()
        
        # Log admin action (using correct column names from FINAL_SCHEMA)
        try:
            log_data = {
                'admin_id': user.id,
                'action': 'duplicate_product',
                'target_type': 'product',
                'target_id': response.data[0]['id'],
                'details': {'original_id': product_id}
            }
            supabase.table('admin_logs').insert(log_data).execute()
        except Exception as log_error:
            print(f"⚠️ Failed to log admin action: {str(log_error)}")
        
        return success_response(response.data[0], 'Product duplicated successfully', 201)
        
    except Exception as e:
        return error_response(f'Error duplicating product: {str(e)}', status_code=500)

@admin_bp.route('/analytics', methods=['GET'])
@require_admin
def get_analytics():
    """Get analytics overview (admin only)"""
    try:
        supabase = get_supabase_admin()
        
        # Total orders
        total_orders = supabase.table('orders').select('*', count='exact').execute()
        
        # Orders by status
        pending = supabase.table('orders').select('*', count='exact').eq('status', 'pending').execute()
        processing = supabase.table('orders').select('*', count='exact').eq('status', 'processing').execute()
        completed = supabase.table('orders').select('*', count='exact').eq('status', 'completed').execute()
        
        # Total revenue (completed orders)
        revenue_data = supabase.table('orders').select('total_amount').eq('status', 'completed').execute()
        total_revenue = sum([order['total_amount'] for order in revenue_data.data])
        
        # Total users
        users = supabase.table('users').select('*', count='exact').execute()
        
        analytics = {
            'total_orders': total_orders.count,
            'pending_orders': pending.count,
            'processing_orders': processing.count,
            'completed_orders': completed.count,
            'total_revenue': total_revenue,
            'total_users': users.count
        }
        
        return success_response(analytics)
        
    except Exception as e:
        return error_response(f'Error fetching analytics: {str(e)}', status_code=500)
