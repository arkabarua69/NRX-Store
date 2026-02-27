from functools import wraps
from flask import request, jsonify
import jwt
from app.config import Config
from app.utils.supabase_client import get_supabase, get_supabase_admin

# Store active admin sessions (in production, use Redis or database)
active_admin_sessions = {}

def verify_token(token: str):
    """Verify Supabase JWT token or admin session token"""
    try:
        # First check if it's an admin session token
        if token in active_admin_sessions:
            return active_admin_sessions[token]
        
        # Otherwise verify with Supabase
        supabase = get_supabase()
        user = supabase.auth.get_user(token)
        return user.user if user else None
    except Exception as e:
        print(f"Token verification error: {e}")
        return None

def create_admin_session(email: str):
    """Create admin session and return token"""
    import secrets
    token = secrets.token_urlsafe(32)
    
    # Create a user-like object for admin
    admin_user = type('obj', (object,), {
        'id': 'admin-db',
        'email': email,
        'user_metadata': {'role': 'admin', 'name': 'Admin'}
    })()
    
    active_admin_sessions[token] = admin_user
    return token

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401
        
        token = auth_header.split(' ')[1]
        user = verify_token(token)
        
        if not user:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Attach user to request
        request.current_user = user
        return f(*args, **kwargs)
    
    return decorated_function

def get_current_user():
    """Get current user from request"""
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    user = verify_token(token)
    
    return user

def require_admin(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401
        
        token = auth_header.split(' ')[1]
        user = verify_token(token)
        
        if not user:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Check if user is admin
        user_metadata = user.user_metadata or {}
        if user_metadata.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        request.current_user = user
        return f(*args, **kwargs)
    
    return decorated_function
