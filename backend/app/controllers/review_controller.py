from flask import Blueprint, request
from app.utils.supabase_client import get_supabase, get_supabase_admin
from app.utils.response import success_response, error_response
from app.utils.auth import get_current_user

review_bp = Blueprint('reviews', __name__)

@review_bp.route('', methods=['GET'])
def get_reviews():
    """Get all approved reviews"""
    try:
        supabase = get_supabase()
        
        # Query parameters
        product_id = request.args.get('product_id')
        limit = int(request.args.get('limit', 50))
        
        # Build query - only get approved reviews
        query = supabase.table('reviews').select('*').eq('is_approved', True)
        
        if product_id:
            query = query.eq('product_id', product_id)
        
        # Execute query
        response = query.order('created_at', desc=True).limit(limit).execute()
        
        print(f"✅ Fetched {len(response.data)} reviews")
        
        return success_response(response.data)
        
    except Exception as e:
        print(f"❌ Error fetching reviews: {str(e)}")
        import traceback
        traceback.print_exc()
        # Return empty array instead of error
        return success_response([])

@review_bp.route('', methods=['POST'])
def create_review():
    """Create a new review"""
    try:
        user = get_current_user()
        if not user:
            return error_response('লগইন করুন রিভিউ দিতে', status_code=401)
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('rating'):
            return error_response('রেটিং প্রয়োজন', status_code=400)
        
        if not data.get('comment') or len(data.get('comment', '').strip()) < 3:
            return error_response('কমেন্ট কমপক্ষে ৩ অক্ষরের হতে হবে', status_code=400)
        
        # Validate rating range
        rating = int(data.get('rating'))
        if rating < 1 or rating > 5:
            return error_response('রেটিং ১ থেকে ৫ এর মধ্যে হতে হবে', status_code=400)
        
        # Use service client to bypass RLS
        supabase = get_supabase_admin()
        
        # Get user info
        user_id = user.id
        user_email = user.email or ''
        user_metadata = user.user_metadata or {}
        
        # Get user data from users table (for custom avatar)
        try:
            user_data_response = supabase.table('users').select('avatar_url, display_name').eq('id', user_id).single().execute()
            user_data = user_data_response.data if user_data_response.data else {}
        except:
            user_data = {}
        
        # Check if user already has a general review (without product_id)
        product_id = data.get('productId') or data.get('product_id')
        
        if not product_id:
            # For general reviews, check if user already has one
            existing_review = supabase.table('reviews')\
                .select('id')\
                .eq('user_id', user_id)\
                .is_('product_id', 'null')\
                .execute()
            
            if existing_review.data and len(existing_review.data) > 0:
                return error_response('আপনি ইতিমধ্যে একটি রিভিউ দিয়েছেন। প্রতি ইউজার শুধুমাত্র একটি রিভিউ দিতে পারবেন।', status_code=400)
        
        # Extract user name (priority: custom display_name > metadata > email)
        user_name = (
            user_data.get('display_name') or
            user_metadata.get('name') or 
            user_metadata.get('full_name') or 
            user_metadata.get('display_name') or
            user_email.split('@')[0] if user_email else 'Anonymous'
        )
        
        # Extract user avatar (priority: custom uploaded > OAuth > generated)
        user_avatar = (
            user_data.get('avatar_url') or  # Custom uploaded avatar (HIGHEST PRIORITY)
            user_metadata.get('avatar_url') or 
            user_metadata.get('picture') or  # Google OAuth
            user_metadata.get('avatar') or
            user_metadata.get('photo_url') or
            user_metadata.get('image_url') or
            f"https://ui-avatars.com/api/?name={user_name.replace(' ', '+')}&background=FF3B30&color=fff&bold=true&size=128"
        )
        
        # Insert review
        review_data = {
            'user_id': user_id,
            'rating': rating,
            'comment': data.get('comment', '').strip(),
            'user_name': user_name,
            'user_avatar': user_avatar,
            'is_verified': True,
            'is_approved': True  # Auto-approve all reviews
        }
        
        # Add product_id if provided (optional)
        if product_id:
            review_data['product_id'] = product_id
        
        print(f"📝 Creating review: {review_data}")
        
        response = supabase.table('reviews').insert(review_data).execute()
        
        print(f"✅ Review created successfully: {response.data[0]['id']}")
        
        return success_response(response.data[0], 'রিভিউ সফলভাবে জমা হয়েছে!')
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Review creation error: {error_msg}")
        import traceback
        traceback.print_exc()
        
        # Check for unique constraint violation
        if 'duplicate key' in error_msg.lower() or 'unique' in error_msg.lower():
            return error_response('আপনি ইতিমধ্যে একটি রিভিউ দিয়েছেন। প্রতি ইউজার শুধুমাত্র একটি রিভিউ দিতে পারবেন।', status_code=400)
        
        return error_response(f'রিভিউ জমা দিতে ব্যর্থ: {error_msg}', status_code=500)

@review_bp.route('/<review_id>', methods=['DELETE'])
def delete_review(review_id):
    """Delete a review"""
    try:
        user = get_current_user()
        if not user:
            return error_response('Authentication required', status_code=401)
        
        supabase = get_supabase()
        
        # Check if review belongs to user
        review = supabase.table('reviews').select('*').eq('id', review_id).single().execute()
        
        if not review.data or review.data['user_id'] != user['id']:
            return error_response('Unauthorized', status_code=403)
        
        # Delete review
        supabase.table('reviews').delete().eq('id', review_id).execute()
        
        return success_response({'message': 'Review deleted successfully'})
        
    except Exception as e:
        return error_response(f'Error deleting review: {str(e)}', status_code=500)
