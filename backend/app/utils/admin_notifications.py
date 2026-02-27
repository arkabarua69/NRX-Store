"""
Admin Notification Helper Functions
Handles sending notifications to admin users
"""

from app.utils.supabase_client import get_supabase_admin
from datetime import datetime
from typing import Optional, Dict, Any, List

def get_all_admin_users() -> List[Dict[str, Any]]:
    """
    Get all admin users from the database
    
    Returns:
        List of admin user dictionaries with id and email
    """
    try:
        supabase = get_supabase_admin()
        response = supabase.table('users').select('id, email, display_name').eq('role', 'admin').execute()
        
        if response.data:
            admins = response.data
            print(f"✅ Found {len(admins)} admin users")
            return admins
        
        print("⚠️ No admin users found in database")
        return []
        
    except Exception as e:
        print(f"❌ Error fetching admin users: {str(e)}")
        import traceback
        traceback.print_exc()
        return []


def send_notification_to_admin(
    admin_id: str,
    title: str,
    message: str,
    notification_type: str = 'order',
    order_id: Optional[str] = None,
    priority: str = 'high',
    is_important: bool = True,
    metadata: Optional[Dict[str, Any]] = None
) -> bool:
    """
    Send notification to a specific admin user
    
    Args:
        admin_id: Admin user ID
        title: Notification title
        message: Notification message
        notification_type: Type (order, system, support, etc.)
        order_id: Related order ID (optional)
        priority: Priority level (low, normal, high, urgent)
        is_important: Mark as important
        metadata: Additional metadata
    
    Returns:
        bool: True if successful
    """
    try:
        supabase = get_supabase_admin()
        
        notification_data = {
            'user_id': str(admin_id),
            'title': title,
            'message': message,
            'type': notification_type,
            'priority': priority,
            'is_important': is_important,
            'is_read': False,
            'recipient_type': 'admin',  # Mark as admin notification
            'created_at': datetime.utcnow().isoformat()
        }
        
        if order_id:
            notification_data['related_order_id'] = str(order_id)
        
        if metadata:
            notification_data['metadata'] = metadata
        
        result = supabase.table('notifications').insert(notification_data).execute()
        
        if result.data:
            print(f"✅ Admin notification sent to {admin_id}: {title}")
            return True
        else:
            print(f"❌ Failed to send admin notification to {admin_id}")
            return False
            
    except Exception as e:
        print(f"❌ Error sending admin notification: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def send_notification_to_all_admins(
    title: str,
    message: str,
    notification_type: str = 'order',
    order_id: Optional[str] = None,
    priority: str = 'high',
    is_important: bool = True,
    metadata: Optional[Dict[str, Any]] = None
) -> int:
    """
    Send notification to all admin users
    
    Args:
        title: Notification title
        message: Notification message
        notification_type: Type (order, system, support, etc.)
        order_id: Related order ID (optional)
        priority: Priority level
        is_important: Mark as important
        metadata: Additional metadata
    
    Returns:
        int: Number of successful sends
    """
    admins = get_all_admin_users()
    
    if not admins:
        print("⚠️ No admin users to notify")
        return 0
    
    success_count = 0
    
    for admin in admins:
        if send_notification_to_admin(
            admin_id=admin['id'],
            title=title,
            message=message,
            notification_type=notification_type,
            order_id=order_id,
            priority=priority,
            is_important=is_important,
            metadata=metadata
        ):
            success_count += 1
    
    print(f"✅ Sent admin notification to {success_count}/{len(admins)} admins")
    return success_count


def notify_admins_new_order(
    order_id: str,
    order_number: str,
    product_name: str,
    amount: float,
    user_name: str = 'Unknown User'
) -> int:
    """
    Notify admins about a new order
    
    Returns:
        int: Number of admins notified
    """
    return send_notification_to_all_admins(
        title=f'New Order #{order_number} 🆕',
        message=f"New order from {user_name}: {product_name} - ৳{amount}. Waiting for payment proof.",
        notification_type='order',
        order_id=order_id,
        priority='high',
        is_important=True,
        metadata={
            'action': 'new_order',
            'order_number': order_number,
            'link': f'/admin-dashboard'
        }
    )


def notify_admins_payment_uploaded(
    order_id: str,
    order_number: str,
    product_name: str,
    amount: float,
    user_name: str = 'Unknown User'
) -> int:
    """
    Notify admins that payment proof has been uploaded
    
    Returns:
        int: Number of admins notified
    """
    return send_notification_to_all_admins(
        title=f'Payment Proof Uploaded #{order_number} 📸',
        message=f"Payment proof uploaded by {user_name} for {product_name} - ৳{amount}. Please verify payment.",
        notification_type='order',
        order_id=order_id,
        priority='urgent',
        is_important=True,
        metadata={
            'action': 'payment_uploaded',
            'order_number': order_number,
            'link': f'/admin-dashboard'
        }
    )


def notify_admins_order_cancelled(
    order_id: str,
    order_number: str,
    product_name: str,
    user_name: str = 'Unknown User',
    reason: str = ''
) -> int:
    """
    Notify admins that an order has been cancelled
    
    Returns:
        int: Number of admins notified
    """
    message = f"Order #{order_number} cancelled by {user_name}: {product_name}"
    if reason:
        message += f". Reason: {reason}"
    
    return send_notification_to_all_admins(
        title=f'Order Cancelled #{order_number} 🚫',
        message=message,
        notification_type='order',
        order_id=order_id,
        priority='normal',
        is_important=False,
        metadata={
            'action': 'order_cancelled',
            'order_number': order_number,
            'link': f'/admin-dashboard'
        }
    )


def notify_admins_system_alert(
    title: str,
    message: str,
    priority: str = 'high',
    is_important: bool = True
) -> int:
    """
    Send system alert to all admins
    
    Returns:
        int: Number of admins notified
    """
    return send_notification_to_all_admins(
        title=title,
        message=message,
        notification_type='system',
        priority=priority,
        is_important=is_important
    )
