from flask import Blueprint, request
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success_response, error_response
from app.utils.auth import require_auth, get_current_user
from datetime import datetime

notification_bp = Blueprint('notifications', __name__)

@notification_bp.route('', methods=['GET'])
@require_auth
def get_notifications():
    """Get notifications for current user"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Convert user.id to string to ensure compatibility
        user_id_str = str(user.id)
        
        # Check if user is admin
        user_data = supabase.table('users').select('role').eq('id', user_id_str).single().execute()
        is_admin = user_data.data and user_data.data.get('role') == 'admin'
        
        # Query parameters
        important_only = request.args.get('important_only', 'false').lower() == 'true'
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        limit = int(request.args.get('limit', 50))
        
        # Build query
        query = supabase.table('notifications').select('*')
        
        # Filter by recipient type
        if is_admin:
            # Admin sees admin notifications
            query = query.eq('recipient_type', 'admin')
            
            # Filter by importance if requested
            if important_only:
                query = query.eq('is_important', True)
        else:
            # Regular users see their own user notifications
            query = query.eq('user_id', user_id_str).eq('recipient_type', 'user')
        
        # Filter unread only
        if unread_only:
            query = query.eq('is_read', False)
        
        # Execute query
        response = query.order('created_at', desc=True).limit(limit).execute()
        
        notifications = response.data or []
        
        print(f"✅ Fetched {len(notifications)} notifications for {'admin' if is_admin else 'user'}: {user.email}")
        print(f"   Important only: {important_only}, Unread only: {unread_only}")
        
        return success_response(notifications)
        
    except Exception as e:
        print(f"❌ Error fetching notifications: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error fetching notifications: {str(e)}', status_code=500)

@notification_bp.route('/<notification_id>/read', methods=['PUT'])
@require_auth
def mark_as_read(notification_id):
    """Mark notification as read"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Update notification
        response = supabase.table('notifications').update({
            'is_read': True,
            'read_at': datetime.utcnow().isoformat()
        }).eq('id', notification_id).eq('user_id', user.id).execute()
        
        if not response.data:
            return error_response('Notification not found', status_code=404)
        
        print(f"✅ Notification marked as read: {notification_id}")
        
        return success_response(response.data[0], 'Notification marked as read')
        
    except Exception as e:
        print(f"❌ Error marking notification as read: {str(e)}")
        return error_response(f'Error: {str(e)}', status_code=500)

@notification_bp.route('/mark-all-read', methods=['PUT'])
@require_auth
def mark_all_as_read():
    """Mark all notifications as read for current user"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Update all unread notifications
        response = supabase.table('notifications').update({
            'is_read': True,
            'read_at': datetime.utcnow().isoformat()
        }).eq('user_id', user.id).eq('is_read', False).execute()
        
        count = len(response.data) if response.data else 0
        
        print(f"✅ Marked {count} notifications as read for user: {user.email}")
        
        return success_response({'count': count}, f'{count} notifications marked as read')
        
    except Exception as e:
        print(f"❌ Error marking all as read: {str(e)}")
        return error_response(f'Error: {str(e)}', status_code=500)

@notification_bp.route('/<notification_id>', methods=['DELETE'])
@require_auth
def delete_notification(notification_id):
    """Delete a notification"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Delete notification
        response = supabase.table('notifications').delete().eq('id', notification_id).eq('user_id', user.id).execute()
        
        if not response.data:
            return error_response('Notification not found', status_code=404)
        
        print(f"✅ Notification deleted: {notification_id}")
        
        return success_response({'message': 'Notification deleted'})
        
    except Exception as e:
        print(f"❌ Error deleting notification: {str(e)}")
        return error_response(f'Error: {str(e)}', status_code=500)

@notification_bp.route('/clear-all', methods=['DELETE'])
@require_auth
def clear_all_notifications():
    """Clear all notifications for current user"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Delete all notifications
        response = supabase.table('notifications').delete().eq('user_id', user.id).execute()
        
        count = len(response.data) if response.data else 0
        
        print(f"✅ Cleared {count} notifications for user: {user.email}")
        
        return success_response({'count': count}, f'{count} notifications cleared')
        
    except Exception as e:
        print(f"❌ Error clearing notifications: {str(e)}")
        return error_response(f'Error: {str(e)}', status_code=500)

# Helper function to create notification
def create_notification(user_id, notification_type, title, message, priority='normal', is_important=False, related_order_id=None, related_support_id=None, metadata=None):
    """Create a new notification"""
    try:
        supabase = get_supabase_admin()
        
        notification_data = {
            'user_id': user_id,
            'type': notification_type,
            'title': title,
            'message': message,
            'priority': priority,
            'is_important': is_important,
            'is_read': False,
        }
        
        if related_order_id:
            notification_data['related_order_id'] = related_order_id
        
        if related_support_id:
            notification_data['related_support_id'] = related_support_id
        
        if metadata:
            notification_data['metadata'] = metadata
        
        response = supabase.table('notifications').insert(notification_data).execute()
        
        print(f"✅ Notification created: {notification_type} for user: {user_id}")
        
        return response.data[0] if response.data else None
        
    except Exception as e:
        print(f"❌ Error creating notification: {str(e)}")
        import traceback
        traceback.print_exc()
        return None
