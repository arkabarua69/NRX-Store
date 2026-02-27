from flask import Blueprint, request
from app.utils.supabase_client import get_supabase
from app.utils.response import success_response, error_response
from app.utils.auth import require_admin
import json
import bcrypt

settings_bp = Blueprint('settings', __name__)

def get_default_settings():
    """Return default settings structure"""
    # Hash default password
    default_password = 'Admin@123456'
    password_hash = bcrypt.hashpw(default_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    return {
        'adminEmails': ['gunjonarka@gmail.com'],
        'adminCredentials': {
            'email': 'gunjonarka@gmail.com',
            'password': password_hash
        },
        'paymentMethods': {
            'bkash': {
                'number': '+8801883800356',
                'type': 'Send Money',
                'logo': 'https://freelogopng.com/images/all_img/1656234745bkash-app-logo-png.png',
                'enabled': True
            },
            'nagad': {
                'number': '+8801883800356',
                'type': 'Send Money',
                'logo': 'https://freelogopng.com/images/all_img/1679248787Nagad-Logo.png',
                'enabled': True
            },
            'rocket': {
                'number': '+8801580831611',
                'type': 'Send Money',
                'logo': 'https://static.vecteezy.com/system/resources/thumbnails/068/706/013/small/rocket-color-logo-mobile-banking-icon-free-png.png',
                'enabled': True
            }
        },
        'siteName': 'NRX Store',
        'siteNameBn': 'এনআরএক্স স্টোর',
        'supportWhatsapp': '+8801883800356',
        'supportEmail': 'support@nrxstore.com',
        'maintenanceMode': False,
        'announcementBanner': {
            'enabled': False,
            'message': '',
            'messageBn': '',
            'type': 'info'
        }
    }

@settings_bp.route('', methods=['GET'])
def get_settings():
    """Get application settings from database"""
    try:
        supabase = get_supabase()
        
        # Try to get settings from database
        result = supabase.table('settings').select('*').eq('id', 1).execute()
        
        if result.data and len(result.data) > 0:
            settings_data = result.data[0].get('data', {})
            print(f"✅ Settings loaded from database: {json.dumps(settings_data, indent=2)}")
            return success_response(settings_data)
        else:
            # If no settings exist, create default settings
            default_settings = get_default_settings()
            
            # Insert default settings into database
            insert_result = supabase.table('settings').insert({
                'id': 1,
                'data': default_settings
            }).execute()
            
            print(f"✅ Default settings created in database")
            return success_response(default_settings)
        
    except Exception as e:
        print(f"❌ Error fetching settings: {str(e)}")
        # Return default settings if database fails
        return success_response(get_default_settings())

@settings_bp.route('', methods=['PUT'])
@require_admin
def update_settings():
    """Update application settings in database (Admin only)"""
    try:
        data = request.get_json()
        supabase = get_supabase()
        
        print(f"=== UPDATING SETTINGS ===")
        print(f"Received data: {json.dumps(data, indent=2)}")
        
        # Update settings in database
        result = supabase.table('settings').update({
            'data': data,
            'updated_at': 'now()'
        }).eq('id', 1).execute()
        
        if result.data:
            print(f"✅ Settings updated successfully in database")
            return success_response({
                'message': 'Settings updated successfully',
                'settings': data
            })
        else:
            # If update fails, try insert
            insert_result = supabase.table('settings').insert({
                'id': 1,
                'data': data
            }).execute()
            
            print(f"✅ Settings inserted successfully in database")
            return success_response({
                'message': 'Settings created successfully',
                'settings': data
            })
        
    except Exception as e:
        print(f"❌ Error updating settings: {str(e)}")
        return error_response(f'Error updating settings: {str(e)}', status_code=500)


@settings_bp.route('/admin-credentials', methods=['PUT'])
@require_admin
def update_admin_credentials():
    """Update admin login credentials (Admin only)"""
    try:
        data = request.get_json()
        new_email = data.get('email')
        new_password = data.get('password')
        
        if not new_email or not new_password:
            return error_response('Email and password required', status_code=400)
        
        # Validate email format
        import re
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, new_email):
            return error_response('Invalid email format', status_code=400)
        
        # Validate password strength
        if len(new_password) < 8:
            return error_response('Password must be at least 8 characters', status_code=400)
        
        print(f"=== UPDATING ADMIN CREDENTIALS ===")
        print(f"New email: {new_email}")
        
        # Hash the new password
        password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        supabase = get_supabase()
        
        # Get current settings
        result = supabase.table('settings').select('data').eq('id', 1).execute()
        
        if result.data and len(result.data) > 0:
            current_data = result.data[0].get('data', {})
        else:
            current_data = get_default_settings()
        
        # Update admin credentials
        current_data['adminCredentials'] = {
            'email': new_email,
            'password': password_hash
        }
        
        # Also update adminEmails array if email changed
        if new_email not in current_data.get('adminEmails', []):
            current_data['adminEmails'] = [new_email]
        
        # Update in database
        update_result = supabase.table('settings').update({
            'data': current_data,
            'updated_at': 'now()'
        }).eq('id', 1).execute()
        
        if update_result.data:
            print(f"✅ Admin credentials updated successfully")
            return success_response({
                'message': 'Admin credentials updated successfully',
                'email': new_email
            })
        else:
            # If update fails, try insert
            insert_result = supabase.table('settings').insert({
                'id': 1,
                'data': current_data
            }).execute()
            
            print(f"✅ Admin credentials created successfully")
            return success_response({
                'message': 'Admin credentials created successfully',
                'email': new_email
            })
        
    except Exception as e:
        print(f"❌ Error updating admin credentials: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error updating admin credentials: {str(e)}', status_code=500)

@settings_bp.route('/admin-credentials', methods=['GET'])
def get_admin_email():
    """Get admin email (password is hidden)"""
    try:
        supabase = get_supabase()
        result = supabase.table('settings').select('data').eq('id', 1).execute()
        
        if result.data and len(result.data) > 0:
            settings_data = result.data[0].get('data', {})
            admin_creds = settings_data.get('adminCredentials', {})
            
            return success_response({
                'email': admin_creds.get('email', 'gunjonarka@gmail.com'),
                'hasPassword': bool(admin_creds.get('password'))
            })
        else:
            return success_response({
                'email': 'gunjonarka@gmail.com',
                'hasPassword': False
            })
        
    except Exception as e:
        print(f"❌ Error fetching admin email: {str(e)}")
        return error_response(f'Error fetching admin email: {str(e)}', status_code=500)
