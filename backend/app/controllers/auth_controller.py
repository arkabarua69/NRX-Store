from flask import Blueprint, request
from app.utils.supabase_client import get_supabase
from app.utils.response import success_response, error_response
from app.utils.validators import validate_request, RegisterSchema, LoginSchema
import os
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@validate_request(RegisterSchema)
def register():
    """Register a new user"""
    try:
        data = request.validated_data
        supabase = get_supabase()
        
        # Create user with Supabase Auth
        response = supabase.auth.sign_up({
            'email': data.email,
            'password': data.password,
            'options': {
                'data': {
                    'full_name': data.full_name,
                    'role': 'user'
                }
            }
        })
        
        if response.user:
            return success_response({
                'user': {
                    'id': response.user.id,
                    'email': response.user.email,
                    'full_name': data.full_name
                },
                'session': {
                    'access_token': response.session.access_token if response.session else None
                }
            }, 'Registration successful', 201)
        else:
            return error_response('Registration failed', status_code=400)
            
    except Exception as e:
        return error_response(f'Registration error: {str(e)}', status_code=500)

@auth_bp.route('/login', methods=['POST'])
@validate_request(LoginSchema)
def login():
    """Login user"""
    try:
        data = request.validated_data
        supabase = get_supabase()
        
        response = supabase.auth.sign_in_with_password({
            'email': data.email,
            'password': data.password
        })
        
        if response.user and response.session:
            return success_response({
                'user': {
                    'id': response.user.id,
                    'email': response.user.email,
                    'user_metadata': response.user.user_metadata
                },
                'session': {
                    'access_token': response.session.access_token,
                    'refresh_token': response.session.refresh_token
                }
            }, 'Login successful')
        else:
            return error_response('Invalid credentials', status_code=401)
            
    except Exception as e:
        return error_response(f'Login error: {str(e)}', status_code=500)

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    try:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            supabase = get_supabase()
            supabase.auth.sign_out()
        
        return success_response(message='Logout successful')
    except Exception as e:
        return error_response(f'Logout error: {str(e)}', status_code=500)

@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """Refresh access token"""
    try:
        data = request.get_json()
        refresh_token = data.get('refresh_token')
        
        if not refresh_token:
            return error_response('Refresh token required', status_code=400)
        
        supabase = get_supabase()
        response = supabase.auth.refresh_session(refresh_token)
        
        if response.session:
            return success_response({
                'session': {
                    'access_token': response.session.access_token,
                    'refresh_token': response.session.refresh_token
                }
            })
        else:
            return error_response('Token refresh failed', status_code=401)
            
    except Exception as e:
        return error_response(f'Token refresh error: {str(e)}', status_code=500)

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current user info"""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return error_response('Authorization required', status_code=401)
        
        token = auth_header.split(' ')[1]
        supabase = get_supabase()
        user = supabase.auth.get_user(token)
        
        if user.user:
            return success_response({
                'id': user.user.id,
                'email': user.user.email,
                'user_metadata': user.user.user_metadata,
                'created_at': user.user.created_at
            })
        else:
            return error_response('User not found', status_code=404)
            
    except Exception as e:
        return error_response(f'Error fetching user: {str(e)}', status_code=500)

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    """Admin login with database credentials"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return error_response('Email and password required', status_code=400)
        
        print(f"🔐 Admin login attempt for: {email}")
        
        # Get admin credentials from settings table
        supabase = get_supabase()
        settings_response = supabase.table('settings').select('data').eq('id', 1).execute()
        
        if not settings_response.data or len(settings_response.data) == 0:
            print(f"❌ Settings table not found")
            return error_response('Admin credentials not configured', status_code=500)
        
        settings_data = settings_response.data[0].get('data', {})
        admin_creds = settings_data.get('adminCredentials', {})
        
        if not admin_creds:
            print(f"❌ Admin credentials not found in settings")
            return error_response('Admin credentials not configured', status_code=500)
        
        stored_email = admin_creds.get('email')
        stored_password_hash = admin_creds.get('password')
        
        print(f"   Stored admin email: {stored_email}")
        
        # Check if email matches
        if email != stored_email:
            print(f"❌ Email does not match")
            return error_response('Invalid admin credentials', status_code=401)
        
        # Check if password matches (support both plain text and hashed)
        password_match = False
        
        # Check if stored password is hashed (bcrypt format starts with $2b$)
        if stored_password_hash and stored_password_hash.startswith('$2b$'):
            # Verify hashed password
            try:
                password_match = bcrypt.checkpw(
                    password.encode('utf-8'), 
                    stored_password_hash.encode('utf-8')
                )
            except Exception as e:
                print(f"⚠️ Bcrypt verification error: {str(e)}")
                password_match = False
        else:
            # Plain text comparison (for backward compatibility)
            password_match = (password == stored_password_hash)
        
        if not password_match:
            print(f"❌ Password does not match")
            return error_response('Invalid admin credentials', status_code=401)
        
        print(f"✅ Admin credentials matched!")
        
        # Create admin session using the auth utility
        from app.utils.auth import create_admin_session
        session_token = create_admin_session(email)
        
        # Return success response
        return success_response({
            'user': {
                'id': 'admin-db',
                'email': email,
                'name': 'Admin',
                'role': 'admin',
                'avatar': f'https://ui-avatars.com/api/?name=Admin&background=FF3B30&color=fff&bold=true'
            },
            'session': {
                'access_token': session_token,
                'refresh_token': None
            },
            'isAdmin': True,
            'source': 'database'
        }, 'Admin login successful')
            
    except Exception as e:
        print(f"❌ Admin login error: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Admin login error: {str(e)}', status_code=500)

