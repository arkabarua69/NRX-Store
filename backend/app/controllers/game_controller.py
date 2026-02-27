from flask import Blueprint, request
from app.utils.supabase_client import get_supabase
from app.utils.response import success_response, error_response, paginated_response

game_bp = Blueprint('games', __name__)

@game_bp.route('', methods=['GET'])
def get_games():
    """Get all games"""
    try:
        supabase = get_supabase()
        
        # Query parameters
        is_active = request.args.get('is_active', 'true').lower() == 'true'
        category = request.args.get('category')
        search = request.args.get('search')
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 20))
        
        # Build query
        query = supabase.table('games').select('*', count='exact')
        
        if is_active:
            query = query.eq('is_active', True)
        
        if category:
            query = query.eq('category', category)
        
        if search:
            query = query.ilike('name', f'%{search}%')
        
        # Execute with pagination
        offset = (page - 1) * page_size
        response = query.order('created_at', desc=True).range(offset, offset + page_size - 1).execute()
        
        return paginated_response(
            response.data,
            page,
            page_size,
            response.count
        )
        
    except Exception as e:
        return error_response(f'Error fetching games: {str(e)}', status_code=500)

@game_bp.route('/<game_id>', methods=['GET'])
def get_game(game_id):
    """Get single game by ID"""
    try:
        supabase = get_supabase()
        response = supabase.table('games').select('*').eq('id', game_id).single().execute()
        
        if response.data:
            return success_response(response.data)
        else:
            return error_response('Game not found', status_code=404)
            
    except Exception as e:
        return error_response(f'Error fetching game: {str(e)}', status_code=500)

@game_bp.route('/slug/<slug>', methods=['GET'])
def get_game_by_slug(slug):
    """Get game by slug"""
    try:
        supabase = get_supabase()
        response = supabase.table('games').select('*').eq('slug', slug).single().execute()
        
        if response.data:
            return success_response(response.data)
        else:
            return error_response('Game not found', status_code=404)
            
    except Exception as e:
        return error_response(f'Error fetching game: {str(e)}', status_code=500)

@game_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all unique categories"""
    try:
        supabase = get_supabase()
        response = supabase.table('games').select('category').eq('is_active', True).execute()
        
        # Get unique categories
        categories = list(set([game['category'] for game in response.data if game.get('category')]))
        
        return success_response({
            'categories': categories,
            'count': len(categories)
        })
        
    except Exception as e:
        return error_response(f'Error fetching categories: {str(e)}', status_code=500)
