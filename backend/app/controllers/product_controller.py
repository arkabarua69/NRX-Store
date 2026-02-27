from flask import Blueprint, request
from app.utils.supabase_client import get_supabase
from app.utils.response import success_response, error_response, paginated_response
from app.utils.auth import require_admin

product_bp = Blueprint('products', __name__)

def get_or_create_game(game_identifier):
    """
    Get game by ID or name, create if doesn't exist
    Returns game UUID
    """
    supabase = get_supabase()
    
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

@product_bp.route('', methods=['GET'])
def get_products():
    """Get all products with filtering"""
    try:
        supabase = get_supabase()
        
        # Query parameters
        game_id = request.args.get('game_id')
        is_featured = request.args.get('is_featured')
        is_active = request.args.get('is_active')
        only_active = request.args.get('onlyActive', 'false').lower() == 'true'
        only_inactive = request.args.get('onlyInactive', 'false').lower() == 'true'
        include_inactive = request.args.get('includeInactive', 'false').lower() == 'true'
        search = request.args.get('search')
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 20))
        
        # Build query
        query = supabase.table('topup_packages').select('*, games(*)', count='exact')
        
        # Handle active/inactive filtering
        if only_active:
            query = query.eq('is_active', True)
        elif only_inactive:
            query = query.eq('is_active', False)
        elif not include_inactive:
            query = query.eq('is_active', True)
        
        if game_id:
            query = query.eq('game_id', game_id)
        
        if is_featured is not None:
            query = query.eq('is_featured', is_featured.lower() == 'true')
        
        if is_active is not None:
            query = query.eq('is_active', is_active.lower() == 'true')
        
        if search:
            query = query.ilike('name', f'%{search}%')
        
        # Execute with pagination
        offset = (page - 1) * page_size
        response = query.order('created_at', desc=True).range(offset, offset + page_size - 1).execute()
        
        # Transform data for frontend
        products = []
        for item in response.data:
            # Use product's image_url if available, otherwise fallback to game's icon
            game_image = None
            if item.get('games'):
                game_image = item['games'].get('icon_url') or item['games'].get('banner_url')
            product_image = item.get('image_url') or game_image or '/placeholder.svg'
            
            product = {
                'id': item['id'],
                'name': item['name'],
                'nameBn': item.get('name_bn', item['name']),
                'description': item.get('description', ''),
                'price': float(item['price']),
                'originalPrice': float(item['original_price']) if item.get('original_price') else None,
                'currency': item.get('currency', 'BDT'),
                'image': product_image,
                'imageUrl': product_image,
                'image_url': product_image,
                'category': item.get('category', 'standard'),  # Use product's own category
                'badge': item.get('badge') or ('Featured' if item.get('is_featured') else None),
                'isFeatured': item.get('is_featured', False),
                'is_featured': item.get('is_featured', False),
                'isActive': item.get('is_active', True),
                'is_active': item.get('is_active', True),
                'stock': item.get('stock', 0),
                'soldCount': item.get('sold_count', 0),
                'sold_count': item.get('sold_count', 0),
                'viewCount': item.get('view_count', 0),
                'view_count': item.get('view_count', 0),
                'rating': float(item.get('rating', 4.5)),
                'reviewCount': item.get('review_count', 0),
                'deliveryTime': '5-15 মিনিট',
                'gameId': item['game_id'],
                'gameName': item['games']['name'] if item.get('games') else '',
                'createdAt': item.get('created_at'),
                'created_at': item.get('created_at'),
                'updatedAt': item.get('updated_at'),
                'updated_at': item.get('updated_at'),
                'diamonds': item.get('diamonds', 0),
            }
            products.append(product)
        
        # Calculate summary
        total_count = response.count or 0
        active_count = len([p for p in products if p['is_active']])
        inactive_count = total_count - active_count
        
        return success_response({
            'products': products,
            'summary': {
                'total': total_count,
                'active': active_count,
                'inactive': inactive_count,
                'showing': len(products)
            },
            'pagination': {
                'page': page,
                'page_size': page_size,
                'total': total_count,
                'pages': (total_count + page_size - 1) // page_size
            }
        })
        
    except Exception as e:
        return error_response(f'Error fetching products: {str(e)}', status_code=500)

@product_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        supabase = get_supabase()
        response = supabase.table('topup_packages').select('*, games(*)').eq('id', product_id).single().execute()
        
        if not response.data:
            return error_response('Product not found', status_code=404)
        
        item = response.data
        
        # Transform data for frontend (same format as list)
        game_image = None
        if item.get('games'):
            game_image = item['games'].get('icon_url') or item['games'].get('banner_url')
        product_image = item.get('image_url') or game_image or '/placeholder.svg'
        
        product = {
            'id': item['id'],
            'name': item['name'],
            'nameBn': item.get('name_bn', item['name']),
            'description': item.get('description', ''),
            'descriptionBn': item.get('description_bn', ''),
            'price': float(item['price']),
            'originalPrice': float(item['original_price']) if item.get('original_price') else None,
            'currency': item.get('currency', 'BDT'),
            'image': product_image,
            'imageUrl': product_image,
            'image_url': product_image,
            'category': item['games']['category'] if item.get('games') else 'standard',
            'badge': item.get('badge') or ('Featured' if item.get('is_featured') else None),
            'isFeatured': item.get('is_featured', False),
            'is_featured': item.get('is_featured', False),
            'isActive': item.get('is_active', True),
            'is_active': item.get('is_active', True),
            'stock': item.get('stock', 0),
            'stockStatus': 'in_stock' if item.get('stock', 0) > 0 else 'out_of_stock',
            'soldCount': item.get('sold_count', 0),
            'sold_count': item.get('sold_count', 0),
            'viewCount': item.get('view_count', 0),
            'view_count': item.get('view_count', 0),
            'rating': float(item.get('rating', 4.5)),
            'reviewCount': item.get('review_count', 0),
            'deliveryTime': '5-15 মিনিট',
            'gameId': item['game_id'],
            'gameName': item['games']['name'] if item.get('games') else '',
            'createdAt': item.get('created_at'),
            'created_at': item.get('created_at'),
            'updatedAt': item.get('updated_at'),
            'updated_at': item.get('updated_at'),
            'diamonds': item.get('diamonds', 0),
        }
        
        return success_response(product)
            
    except Exception as e:
        print(f"Error fetching product: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error fetching product: {str(e)}', status_code=500)

@product_bp.route('/featured', methods=['GET'])
def get_featured_products():
    """Get featured products"""
    try:
        supabase = get_supabase()
        limit = int(request.args.get('limit', 10))
        
        response = supabase.table('topup_packages')\
            .select('*, games(*)')\
            .eq('is_featured', True)\
            .eq('is_active', True)\
            .limit(limit)\
            .execute()
        
        return success_response(response.data)
        
    except Exception as e:
        return error_response(f'Error fetching featured products: {str(e)}', status_code=500)
