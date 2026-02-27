from flask import Blueprint, request
from app.utils.supabase_client import get_supabase, get_supabase_admin
from app.utils.response import success_response, error_response
from app.utils.auth import require_auth, get_current_user

user_bp = Blueprint('users', __name__)

@user_bp.route('/profile', methods=['GET'])
@require_auth
def get_profile():
    """Get current user profile"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Try to get user data from users table
        avatar_url = None
        display_name = None
        
        try:
            user_data = supabase.table('users').select('*').eq('id', user.id).single().execute()
            if user_data.data:
                avatar_url = user_data.data.get('avatar_url')
                display_name = user_data.data.get('display_name')
        except Exception as db_error:
            # User might not exist in users table yet, that's okay
            print(f"ℹ️ User not found in users table (will be created on first update): {str(db_error)}")
        
        profile = {
            'id': user.id,
            'email': user.email,
            'user_metadata': user.user_metadata,
            'created_at': user.created_at,
            'avatar_url': avatar_url,
            'display_name': display_name,
        }
        
        return success_response(profile)
    except Exception as e:
        print(f"❌ Error fetching profile: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error fetching profile: {str(e)}', status_code=500)

@user_bp.route('/profile', methods=['PUT'])
@require_auth
def update_profile():
    """Update user profile (name, avatar, etc.)"""
    try:
        user = request.current_user
        data = request.get_json()
        supabase = get_supabase_admin()
        
        # Update users table
        update_data = {}
        
        if 'avatar_url' in data:
            update_data['avatar_url'] = data['avatar_url']
        
        if 'display_name' in data:
            update_data['display_name'] = data['display_name']
        
        if update_data:
            # Update or insert user data
            response = supabase.table('users').upsert({
                'id': user.id,
                'email': user.email,
                **update_data
            }).execute()
            
            print(f"✅ Profile updated for user: {user.email}")
            print(f"📝 Updated data: {update_data}")
            
            return success_response(response.data[0] if response.data else update_data, 'প্রোফাইল আপডেট হয়েছে!')
        else:
            return error_response('No data to update', status_code=400)
            
    except Exception as e:
        print(f"❌ Error updating profile: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error updating profile: {str(e)}', status_code=500)

@user_bp.route('/avatar', methods=['POST'])
@require_auth
def upload_avatar():
    """Upload user avatar"""
    try:
        user = request.current_user
        
        if 'file' not in request.files:
            return error_response('No file provided', status_code=400)
        
        file = request.files['file']
        
        if file.filename == '':
            return error_response('No file selected', status_code=400)
        
        # Use existing upload service
        from app.controllers.upload_controller import allowed_file
        import os
        import uuid
        from datetime import datetime
        from app.utils.supabase_client import get_supabase_admin
        
        if not allowed_file(file.filename):
            return error_response('Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP', status_code=400)
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
        if file_size > MAX_FILE_SIZE:
            return error_response('File too large. Maximum size: 5MB', status_code=400)
        
        # Read file content
        file_content = file.read()
        
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Create folder path
        folder_path = f"avatars/{datetime.now().strftime('%Y/%m')}"
        file_path = f"{folder_path}/{unique_filename}"
        
        print(f"📤 Uploading avatar for user: {user.email}")
        print(f"   File size: {file_size} bytes")
        
        # Upload to Supabase Storage
        supabase = get_supabase_admin()
        
        response = supabase.storage.from_('images').upload(
            file_path,
            file_content,
            {
                'content-type': file.content_type or f'image/{file_extension}',
                'cache-control': '3600',
                'upsert': 'false'
            }
        )
        
        # Get public URL
        public_url = supabase.storage.from_('images').get_public_url(file_path)
        
        # Update user profile with new avatar
        supabase.table('users').upsert({
            'id': user.id,
            'email': user.email,
            'avatar_url': public_url
        }).execute()
        
        print(f"✅ Avatar uploaded successfully!")
        print(f"   URL: {public_url}")
        
        return success_response({
            'avatar_url': public_url,
            'path': file_path,
            'filename': unique_filename,
            'size': file_size
        }, 'অ্যাভাটার আপলোড সফল হয়েছে!')
        
    except Exception as e:
        print(f"❌ Avatar upload error: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Upload failed: {str(e)}', status_code=500)

@user_bp.route('/stats', methods=['GET'])
@require_auth
def get_user_stats():
    """Get user statistics (orders, wishlist, reviews)"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Get orders count and stats
        orders_response = supabase.table('orders').select('*').eq('user_id', user.id).execute()
        orders = orders_response.data or []
        
        total_orders = len(orders)
        pending_orders = len([o for o in orders if o.get('status') == 'pending'])
        completed_orders = len([o for o in orders if o.get('status') == 'completed'])
        
        # Calculate total spent (only completed and processing orders)
        total_spent = sum(float(o.get('total_amount', 0)) for o in orders if o.get('status') in ['completed', 'processing'])
        
        # Calculate total diamonds received (only completed orders)
        total_diamonds = 0
        for order in orders:
            if order.get('status') == 'completed':
                # Get product details to find diamonds
                product_id = order.get('product_id')
                if product_id:
                    try:
                        product_response = supabase.table('topup_packages').select('diamonds').eq('id', product_id).single().execute()
                        if product_response.data:
                            diamonds = product_response.data.get('diamonds', 0)
                            quantity = order.get('quantity', 1)
                            total_diamonds += int(diamonds) * int(quantity)
                    except Exception as e:
                        print(f"⚠️ Could not fetch diamonds for product {product_id}: {e}")
        
        # Get wishlist count
        try:
            wishlist_response = supabase.table('wishlist').select('id', count='exact').eq('user_id', user.id).execute()
            wishlist_count = wishlist_response.count or 0
        except Exception:
            wishlist_count = 0
        
        # Get reviews count
        try:
            reviews_response = supabase.table('reviews').select('id', count='exact').eq('user_id', user.id).execute()
            review_count = reviews_response.count or 0
        except Exception:
            review_count = 0
        
        stats = {
            'totalOrders': total_orders,
            'pendingOrders': pending_orders,
            'completedOrders': completed_orders,
            'wishlistCount': wishlist_count,
            'reviewCount': review_count,
            'totalSpent': round(total_spent, 2),
            'totalDiamonds': total_diamonds,
        }
        
        print(f"✅ User stats for {user.email}:")
        print(f"   Orders: {total_orders} (Pending: {pending_orders}, Completed: {completed_orders})")
        print(f"   Wishlist: {wishlist_count}, Reviews: {review_count}")
        print(f"   Total Spent: ৳{total_spent}, Total Diamonds: {total_diamonds}")
        
        return success_response(stats)
        
    except Exception as e:
        print(f"❌ Error fetching user stats: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error fetching stats: {str(e)}', status_code=500)
