from flask import Blueprint, request
from app.utils.supabase_client import get_supabase, get_supabase_admin
from app.utils.response import success_response, error_response, paginated_response
from app.utils.auth import require_auth, require_admin
from app.utils.notifications import send_order_notification
from app.utils.admin_notifications import (
    notify_admins_new_order,
    notify_admins_payment_uploaded,
    notify_admins_order_cancelled
)
from datetime import datetime
import uuid

order_bp = Blueprint('orders', __name__)

@order_bp.route('', methods=['POST'])
@require_auth
def create_order():
    """Create a new order"""
    try:
        data = request.get_json()
        user = request.current_user
        
        print(f"=== ORDER CREATION START ===")
        print(f"User: {user.id}, Email: {user.email}")
        print(f"Request Data: {data}")
        
        # Validate required fields
        if not data.get('product_id'):
            return error_response('Product ID is required', status_code=400)
        
        if not data.get('player_id'):
            return error_response('Player ID is required', status_code=400)
        
        # Get product details using admin client
        supabase_admin = get_supabase_admin()
        product_response = supabase_admin.table('topup_packages').select('*').eq('id', data['product_id']).execute()
        
        if not product_response.data or len(product_response.data) == 0:
            return error_response('Product not found', status_code=404)
        
        product = product_response.data[0]
        print(f"Product found: {product['name']}, Price: {product['price']}")
        
        if not product.get('is_active'):
            return error_response('Product is not available', status_code=400)
        
        # Calculate total
        quantity = data.get('quantity', 1)
        unit_price = float(product['price'])
        total_amount = unit_price * quantity
        
        # Prepare order data matching database schema
        order_data = {
            'user_id': user.id,
            'product_id': data['product_id'],
            'quantity': quantity,
            'unit_price': unit_price,
            'total_amount': total_amount,
            'currency': 'BDT',
            'status': 'pending',
            'payment_status': 'pending',
            'player_id': data['player_id'],
            'player_name': data.get('player_name', ''),
            'server_id': data.get('server_id'),
            'contact_email': user.email,
            'contact_phone': data.get('contact_phone'),
            'payment_method': data.get('payment_method'),
            'transaction_id': data.get('transaction_id'),
            'notes': data.get('notes'),
            'verification_status': 'pending',
            'delivery_status': 'pending'
        }
        
        print(f"Inserting order with data: {order_data}")
        
        # Insert using admin client to bypass RLS
        insert_response = supabase_admin.table('orders').insert(order_data).execute()
        
        print(f"Insert response: {insert_response}")
        
        if insert_response.data and len(insert_response.data) > 0:
            created_order = insert_response.data[0]
            order_number = created_order['id'][:8].upper()
            print(f"✅ Order created successfully: {created_order['id']}")
            
            # Send notification to user
            send_order_notification(
                user_id=user.id,
                order_id=created_order['id'],
                order_number=order_number,
                status='created',
                product_name=product['name'],
                diamonds=product.get('diamonds', 0),
                amount=total_amount
            )
            
            # Send notification to all admins
            notify_admins_new_order(
                order_id=created_order['id'],
                order_number=order_number,
                product_name=product['name'],
                amount=total_amount,
                user_name=user.email or 'Unknown User'
            )
            
            return success_response(created_order, 'Order created successfully', 201)
        else:
            print(f"❌ Insert failed - no data returned")
            return error_response('Failed to create order', status_code=500)
        
    except Exception as e:
        print(f"=== ORDER CREATION ERROR ===")
        print(f"Error: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return error_response(f'Error creating order: {str(e)}', status_code=500)


@order_bp.route('', methods=['GET'])
@require_auth
def get_user_orders():
    """Get current user's orders with product details"""
    try:
        user = request.current_user
        supabase_admin = get_supabase_admin()
        
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 50))
        status = request.args.get('status')
        
        # Build query with joins
        query = supabase_admin.table('orders').select(
            '*, topup_packages(id, name, name_bn, diamonds, price, image_url, game_id, games(id, name, name_bn))',
            count='exact'
        ).eq('user_id', user.id)
        
        if status:
            query = query.eq('status', status)
        
        offset = (page - 1) * page_size
        response = query.order('created_at', desc=True).range(offset, offset + page_size - 1).execute()
        
        print(f"Orders fetched for user {user.id}: {len(response.data)} orders")
        
        return paginated_response(response.data, page, page_size, response.count)
        
    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        return error_response(f'Error fetching orders: {str(e)}', status_code=500)


@order_bp.route('/<order_id>', methods=['GET'])
@require_auth
def get_order(order_id):
    """Get single order details"""
    try:
        user = request.current_user
        supabase_admin = get_supabase_admin()
        
        response = supabase_admin.table('orders').select(
            '*, topup_packages(*, games(*))'
        ).eq('id', order_id).execute()
        
        if not response.data or len(response.data) == 0:
            return error_response('Order not found', status_code=404)
        
        order = response.data[0]
        
        # Check ownership (allow admin to view all)
        if order['user_id'] != user.id:
            user_metadata = user.user_metadata or {}
            if user_metadata.get('role') != 'admin':
                return error_response('Access denied', status_code=403)
        
        return success_response(order)
        
    except Exception as e:
        return error_response(f'Error fetching order: {str(e)}', status_code=500)


@order_bp.route('/<order_id>/payment-proof', methods=['POST'])
@require_auth
def upload_payment_proof(order_id):
    """Upload payment proof for order"""
    try:
        user = request.current_user
        data = request.get_json()
        supabase_admin = get_supabase_admin()
        
        # Verify order ownership
        order_response = supabase_admin.table('orders').select('*').eq('id', order_id).execute()
        
        if not order_response.data or len(order_response.data) == 0:
            return error_response('Order not found', status_code=404)
        
        order = order_response.data[0]
        
        if order['user_id'] != user.id:
            return error_response('Access denied', status_code=403)
        
        # Update order with payment proof
        update_data = {
            'payment_proof_url': data.get('proof_url'),
            'payment_method': data.get('payment_method'),
            'transaction_id': data.get('transaction_id'),
            'payment_status': 'paid',
            'status': 'processing',
            'updated_at': datetime.utcnow().isoformat()
        }
        
        print(f"Updating order {order_id} with payment proof")
        
        response = supabase_admin.table('orders').update(update_data).eq('id', order_id).execute()
        
        if response.data and len(response.data) > 0:
            order_number = order_id[:8].upper()
            print(f"✅ Payment proof uploaded for order {order_id}")
            
            # Send notification to user
            send_order_notification(
                user_id=user.id,
                order_id=order_id,
                order_number=order_number,
                status='payment_uploaded'
            )
            
            # Get order details for admin notification
            order = response.data[0]
            product_name = order.get('product_name', 'Unknown Product')
            amount = order.get('total_amount', 0)
            
            # Send notification to all admins
            notify_admins_payment_uploaded(
                order_id=order_id,
                order_number=order_number,
                product_name=product_name,
                amount=amount,
                user_name=user.email or 'Unknown User'
            )
            
            return success_response(response.data[0], 'Payment proof uploaded successfully')
        else:
            return error_response('Failed to upload payment proof', status_code=500)
        
    except Exception as e:
        print(f"Error uploading payment proof: {str(e)}")
        return error_response(f'Error uploading payment proof: {str(e)}', status_code=500)


@order_bp.route('/<order_id>/cancel', methods=['PUT'])
@require_auth
def cancel_order(order_id):
    """Cancel order (User can only cancel their own pending orders)"""
    try:
        user = request.current_user
        supabase_admin = get_supabase_admin()
        
        # Get order details first using admin client
        order_response = supabase_admin.table('orders').select('*').eq('id', order_id).eq('user_id', user.id).execute()
        
        if not order_response.data or len(order_response.data) == 0:
            return error_response('Order not found or you do not have permission', status_code=404)
        
        order = order_response.data[0]
        
        # Only allow cancellation of pending or processing orders
        if order['status'] not in ['pending', 'processing']:
            return error_response(f'Cannot cancel order with status: {order["status"]}', status_code=400)
        
        # Update order status to cancelled using admin client
        update_data = {
            'status': 'cancelled',
            'updated_at': datetime.utcnow().isoformat()
        }
        
        response = supabase_admin.table('orders').update(update_data).eq('id', order_id).execute()
        
        if response.data and len(response.data) > 0:
            order_number = order_id[:8].upper()
            
            # Send notification to user
            send_order_notification(
                user_id=user.id,
                order_id=order_id,
                order_number=order_number,
                status='cancelled'
            )
            
            # Send notification to all admins
            notify_admins_order_cancelled(
                order_id=order_id,
                order_number=order_number,
                product_name=order.get('product_name', 'Unknown Product'),
                user_name=user.email or 'Unknown User'
            )
            
            print(f"✅ Order cancelled by user: {order_id}")
            return success_response(response.data[0], 'Order cancelled successfully')
        else:
            return error_response('Failed to cancel order', status_code=500)
        
    except Exception as e:
        print(f"Error cancelling order: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return error_response(f'Error cancelling order: {str(e)}', status_code=500)


@order_bp.route('/<order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status (Admin or user can cancel their own pending orders)"""
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        # Get current user
        try:
            user = request.current_user
            is_user_request = True
        except:
            user = None
            is_user_request = False
        
        supabase_admin = get_supabase_admin()
        
        # Get order details first
        order_response = supabase_admin.table('orders').select('*, topup_packages(name, diamonds)').eq('id', order_id).execute()
        
        if not order_response.data or len(order_response.data) == 0:
            return error_response('Order not found', status_code=404)
        
        order = order_response.data[0]
        order_number = order_id[:8].upper()
        
        # Check permissions
        if is_user_request and user:
            # User can only cancel their own pending/processing orders
            if order['user_id'] != user.id:
                return error_response('Access denied', status_code=403)
            
            if new_status == 'cancelled':
                if order['status'] not in ['pending', 'processing']:
                    return error_response(f'Cannot cancel order with status: {order["status"]}', status_code=400)
            else:
                # Only admin can set other statuses
                user_metadata = user.user_metadata or {}
                if user_metadata.get('role') != 'admin':
                    return error_response('Only admin can update order status', status_code=403)
        
        update_data = {
            'status': new_status,
            'admin_notes': data.get('admin_notes'),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        # If status is completed, set completed_at and delivery_status
        if new_status == 'completed':
            update_data['completed_at'] = datetime.utcnow().isoformat()
            update_data['delivery_status'] = 'delivered'
            update_data['delivered_at'] = datetime.utcnow().isoformat()
        
        response = supabase_admin.table('orders').update(update_data).eq('id', order_id).execute()
        
        if response.data and len(response.data) > 0:
            # Send notification to user based on status
            product = order.get('topup_packages', {})
            diamonds = product.get('diamonds', 0)
            player_id = order.get('player_id', '')
            
            send_order_notification(
                user_id=order['user_id'],
                order_id=order_id,
                order_number=order_number,
                status=new_status,
                product_name=product.get('name', ''),
                diamonds=diamonds,
                player_id=player_id
            )
            
            return success_response(response.data[0], 'Order status updated')
        else:
            return error_response('Failed to update order status', status_code=500)
        
    except Exception as e:
        print(f"Error updating order status: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return error_response(f'Error updating order status: {str(e)}', status_code=500)


@order_bp.route('/<order_id>/verify', methods=['POST'])
@require_admin
def verify_order(order_id):
    """Verify order payment (Admin only)"""
    try:
        data = request.get_json()
        user = request.current_user
        supabase_admin = get_supabase_admin()
        
        verify = data.get('verify', False)
        notes = data.get('notes', '')
        
        # Get order details first
        order_response = supabase_admin.table('orders').select('*, topup_packages(name, diamonds)').eq('id', order_id).execute()
        
        if not order_response.data or len(order_response.data) == 0:
            return error_response('Order not found', status_code=404)
        
        order = order_response.data[0]
        order_number = order_id[:8].upper()
        
        update_data = {
            'verification_status': 'verified' if verify else 'rejected',
            'verification_notes': notes,
            'verified_at': datetime.utcnow().isoformat(),
            'verified_by': user.id,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if verify:
            update_data['status'] = 'processing'
            update_data['payment_status'] = 'paid'
        else:
            update_data['status'] = 'cancelled'
            update_data['payment_status'] = 'failed'
        
        response = supabase_admin.table('orders').update(update_data).eq('id', order_id).execute()
        
        if response.data and len(response.data) > 0:
            # Send notification to user
            product = order.get('topup_packages', {})
            diamonds = product.get('diamonds', 0)
            
            send_order_notification(
                user_id=order['user_id'],
                order_id=order_id,
                order_number=order_number,
                status='payment_verified' if verify else 'payment_rejected',
                diamonds=diamonds,
                notes=notes
            )
            
            return success_response(response.data[0], 'Order verification updated')
        else:
            return error_response('Failed to verify order', status_code=500)
        
    except Exception as e:
        print(f"Error verifying order: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return error_response(f'Error verifying order: {str(e)}', status_code=500)


@order_bp.route('/admin/all', methods=['GET'])
@require_admin
def get_all_orders():
    """Get all orders with product and user details (Admin only)"""
    try:
        supabase_admin = get_supabase_admin()
        
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 50))
        status = request.args.get('status')
        verification_status = request.args.get('verification_status')
        search = request.args.get('search', '')
        
        print(f"=== FETCHING ALL ORDERS (ADMIN) ===")
        print(f"Page: {page}, Size: {page_size}")
        print(f"Filters - Status: {status}, Verification: {verification_status}, Search: {search}")
        
        # Build base query - select all order fields
        query = supabase_admin.table('orders').select(
            '*',
            count='exact'
        )
        
        # Apply filters
        if status:
            query = query.eq('status', status)
        
        if verification_status:
            query = query.eq('verification_status', verification_status)
        
        # Search by player_id or transaction_id
        if search:
            query = query.or_(f'player_id.ilike.%{search}%,transaction_id.ilike.%{search}%')
        
        # Pagination
        offset = (page - 1) * page_size
        response = query.order('created_at', desc=True).range(offset, offset + page_size - 1).execute()
        
        print(f"✅ Fetched {len(response.data)} orders")
        
        # Get all unique product IDs, game IDs, and user IDs
        product_ids = list(set([order['product_id'] for order in response.data if order.get('product_id')]))
        user_ids = list(set([order['user_id'] for order in response.data if order.get('user_id')]))
        
        # Fetch all products in one query
        products_map = {}
        if product_ids:
            products_response = supabase_admin.table('topup_packages').select(
                'id, name, name_bn, diamonds, price, image_url, game_id'
            ).in_('id', product_ids).execute()
            
            for product in products_response.data:
                products_map[product['id']] = product
        
        # Get all unique game IDs
        game_ids = list(set([p.get('game_id') for p in products_map.values() if p.get('game_id')]))
        
        # Fetch all games in one query
        games_map = {}
        if game_ids:
            games_response = supabase_admin.table('games').select(
                'id, name, name_bn'
            ).in_('id', game_ids).execute()
            
            for game in games_response.data:
                games_map[game['id']] = game
        
        # Fetch user emails directly from auth.users using contact_email from orders
        # Since users table is empty, we'll use the contact_email from orders
        users_map = {}
        for order in response.data:
            user_id = str(order.get('user_id'))
            contact_email = order.get('contact_email')
            
            if user_id and contact_email:
                # Extract username from email
                username = contact_email.split('@')[0] if '@' in contact_email else contact_email
                users_map[user_id] = {
                    'id': user_id,
                    'email': contact_email,
                    'display_name': None,
                    'username': username
                }
        
        print(f"📊 Created user map from {len(users_map)} order emails")
        
        # Enrich orders with product, game, and user data
        enriched_orders = []
        for order in response.data:
            product = products_map.get(order.get('product_id'))
            game = games_map.get(product.get('game_id')) if product else None
            user_data = users_map.get(str(order.get('user_id')))
            
            # Determine user name with fallback logic
            user_name = None
            if user_data:
                print(f"🔍 Processing user {order.get('user_id')}: email={user_data.get('email')}")
                
                # First try display_name
                user_name = user_data.get('display_name')
                print(f"  - display_name: {user_name}")
                
                # Use the extracted username from email
                if not user_name:
                    user_name = user_data.get('username')
                    print(f"  - Username from email: {user_name}")
                
                print(f"  ✅ Final user_name: {user_name}")
            else:
                print(f"❌ No user data found for user_id: {order.get('user_id')}")
                # Fallback: try to extract from contact_email in order
                if order.get('contact_email'):
                    user_name = order.get('contact_email').split('@')[0]
                    print(f"  🔄 Fallback username from order email: {user_name}")
            
            # Build enriched order
            enriched_order = {
                **order,
                'product_name': product['name'] if product else 'Unknown Product',
                'product_name_bn': product.get('name_bn') if product else None,
                'diamonds': product.get('diamonds') if product else 0,
                'product_image': product.get('image_url') if product else None,
                'game_name': game['name'] if game else 'Unknown Game',
                'game_name_bn': game.get('name_bn') if game else None,
                'user_name': user_name,
                'user_email': order.get('contact_email') or (user_data.get('email') if user_data else 'Unknown'),
                'user_avatar': user_data.get('avatar_url') if user_data else None,
                'topup_packages': product,
                'games': game
            }
            
            enriched_orders.append(enriched_order)
        
        print(f"✅ Enriched {len(enriched_orders)} orders with product/game data")
        
        return paginated_response(enriched_orders, page, page_size, response.count)
        
    except Exception as e:
        print(f"❌ Error fetching orders: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return error_response(f'Error fetching orders: {str(e)}', status_code=500)
