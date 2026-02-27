"""
Admin Notification Controller
Handles admin-specific notifications separately from user notifications
"""

from flask import Blueprint, request
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success_response, error_response
from app.utils.auth import require_auth, require_admin
from datetime import datetime

admin_notification_bp = Blueprint('admin_notifications', __name__)

@admin_notification_bp.route('/admin/notifications', methods=['GET'])
@require_admin
def get_admin_notifications():
    """Get notifications for admin users only"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Query parameters
        important_only = request.args.get('important_only', 'false').lower() == 'true'
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        limit = int(request.args.get('limit', 50))
        
        # Build query - get admin notifications for this admin user
        query = supabase.table('notifications').select('*')
        
        # Admin sees notifications where recipient_type='admin' AND user_id matches
        query = query.eq('user_id', str(user.id)).eq('recipient_type', 'admin')
        
        # Filter by importance if requested
        if important_only:
            query = query.eq('is_important', True)
        
        # Filter unread only
        if unread_only:
            query = query.eq('is_read', False)
        
        # Execute query
        response = query.order('created_at', desc=True).limit(limit).execute()
        
        notifications = response.data or []
        
        print(f"✅ Fetched {len(notifications)} admin notifications for: {user.email}")
        print(f"   Important only: {important_only}, Unread only: {unread_only}")
        
        return success_response(notifications)
        
    except Exception as e:
        print(f"❌ Error fetching admin notifications: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error fetching admin notifications: {str(e)}', status_code=500)


@admin_notification_bp.route('/admin/notifications/<notification_id>/read', methods=['PUT'])
@require_admin
def mark_admin_notification_as_read(notification_id):
    """Mark admin notification as read"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Update notification - ensure it's an admin notification for this user
        response = supabase.table('notifications').update({
            'is_read': True,
            'read_at': datetime.utcnow().isoformat()
        }).eq('id', notification_id).eq('user_id', str(user.id)).eq('recipient_type', 'admin').execute()
        
        if not response.data:
            return error_response('Admin notification not found', status_code=404)
        
        print(f"✅ Admin notification marked as read: {notification_id}")
        
        return success_response(response.data[0], 'Admin notification marked as read')
        
    except Exception as e:
        print(f"❌ Error marking admin notification as read: {str(e)}")
        return error_response(f'Error: {str(e)}', status_code=500)


@admin_notification_bp.route('/admin/notifications/mark-all-read', methods=['PUT'])
@require_admin
def mark_all_admin_notifications_as_read():
    """Mark all admin notifications as read for current admin"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Update all unread admin notifications for this admin
        response = supabase.table('notifications').update({
            'is_read': True,
            'read_at': datetime.utcnow().isoformat()
        }).eq('user_id', str(user.id)).eq('recipient_type', 'admin').eq('is_read', False).execute()
        
        count = len(response.data) if response.data else 0
        
        print(f"✅ Marked {count} admin notifications as read for: {user.email}")
        
        return success_response({'count': count}, f'{count} admin notifications marked as read')
        
    except Exception as e:
        print(f"❌ Error marking all admin notifications as read: {str(e)}")
        return error_response(f'Error: {str(e)}', status_code=500)


@admin_notification_bp.route('/admin/notifications/<notification_id>', methods=['DELETE'])
@require_admin
def delete_admin_notification(notification_id):
    """Delete an admin notification"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Delete notification - ensure it's an admin notification for this user
        response = supabase.table('notifications').delete().eq('id', notification_id).eq('user_id', str(user.id)).eq('recipient_type', 'admin').execute()
        
        if not response.data:
            return error_response('Admin notification not found', status_code=404)
        
        print(f"✅ Admin notification deleted: {notification_id}")
        
        return success_response({'message': 'Admin notification deleted'})
        
    except Exception as e:
        print(f"❌ Error deleting admin notification: {str(e)}")
        return error_response(f'Error: {str(e)}', status_code=500)


@admin_notification_bp.route('/admin/notifications/clear-all', methods=['DELETE'])
@require_admin
def clear_all_admin_notifications():
    """Clear all admin notifications for current admin"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Delete all admin notifications for this admin
        response = supabase.table('notifications').delete().eq('user_id', str(user.id)).eq('recipient_type', 'admin').execute()
        
        count = len(response.data) if response.data else 0
        
        print(f"✅ Cleared {count} admin notifications for: {user.email}")
        
        return success_response({'count': count}, f'{count} admin notifications cleared')
        
    except Exception as e:
        print(f"❌ Error clearing admin notifications: {str(e)}")
        return error_response(f'Error: {str(e)}', status_code=500)


@admin_notification_bp.route('/admin/notifications/stats', methods=['GET'])
@require_admin
def get_admin_notification_stats():
    """Get notification statistics for admin"""
    try:
        user = request.current_user
        supabase = get_supabase_admin()
        
        # Get all admin notifications for this admin
        all_response = supabase.table('notifications').select('id, is_read, is_important').eq('user_id', str(user.id)).eq('recipient_type', 'admin').execute()
        
        all_notifications = all_response.data or []
        
        stats = {
            'total': len(all_notifications),
            'unread': len([n for n in all_notifications if not n.get('is_read', False)]),
            'important': len([n for n in all_notifications if n.get('is_important', False)]),
            'important_unread': len([n for n in all_notifications if n.get('is_important', False) and not n.get('is_read', False)])
        }
        
        print(f"✅ Admin notification stats for {user.email}: {stats}")
        
        return success_response(stats)
        
    except Exception as e:
        print(f"❌ Error getting admin notification stats: {str(e)}")
        return error_response(f'Error: {str(e)}', status_code=500)
