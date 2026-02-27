"""
Notification Helper Functions
Centralized notification management for the application
"""

from app.utils.supabase_client import get_supabase_admin
from datetime import datetime
from typing import Optional, Dict, Any, List

def send_notification(
    user_id: str,
    title: str,
    message: str,
    notification_type: str = 'info',
    order_id: Optional[str] = None,
    support_id: Optional[str] = None,
    link: Optional[str] = None,
    priority: str = 'normal',
    is_important: bool = False,
    metadata: Optional[Dict[str, Any]] = None,
    recipient_type: str = 'user'  # 'user' or 'admin'
) -> bool:
    """
    Send a notification to a user or admin
    
    Args:
        user_id: User ID to send notification to
        title: Notification title
        message: Notification message
        notification_type: Type of notification (info, success, warning, error, order, system, promotion)
        order_id: Related order ID (optional)
        support_id: Related support ticket ID (optional)
        link: Link to navigate to (optional)
        priority: Priority level (low, normal, high, urgent)
        is_important: Mark as important
        metadata: Additional metadata (optional)
        recipient_type: 'user' or 'admin' - determines who receives the notification
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        supabase = get_supabase_admin()
        
        notification_data = {
            'user_id': user_id,
            'title': title,
            'message': message,
            'type': notification_type,
            'priority': priority,
            'is_important': is_important,
            'is_read': False,
            'recipient_type': recipient_type,  # Add recipient type
            'created_at': datetime.utcnow().isoformat()
        }
        
        if order_id:
            notification_data['related_order_id'] = order_id
        
        if support_id:
            notification_data['related_support_id'] = support_id
        
        if link:
            notification_data['metadata'] = {'link': link}
        elif metadata:
            notification_data['metadata'] = metadata
        
        result = supabase.table('notifications').insert(notification_data).execute()
        
        if result.data:
            print(f"✅ Notification sent to {recipient_type} {user_id}: {title}")
            return True
        else:
            print(f"❌ Failed to send notification to {recipient_type} {user_id}")
            return False
            
    except Exception as e:
        print(f"❌ Error sending notification: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def send_order_notification(
    user_id: str,
    order_id: str,
    order_number: str,
    status: str,
    product_name: str = '',
    diamonds: int = 0,
    amount: float = 0,
    player_id: str = '',
    notes: str = ''
) -> bool:
    """
    Send order-related notification to user only
    
    Args:
        user_id: User ID
        order_id: Order ID
        order_number: Order number (short ID)
        status: Order status
        product_name: Product name
        diamonds: Diamond amount
        amount: Order amount
        player_id: Player ID
        notes: Additional notes
    
    Returns:
        bool: True if successful
    """
    
    # User notifications (in Bengali)
    user_notification_map = {
        'created': {
            'title': 'অর্ডার সফল! 🎉',
            'message': f"আপনার অর্ডার #{order_number} সফলভাবে তৈরি হয়েছে। {product_name} - ৳{amount}। পেমেন্ট প্রুফ আপলোড করুন দ্রুত ডেলিভারির জন্য।",
            'type': 'success',
            'priority': 'high'
        },
        'payment_uploaded': {
            'title': 'পেমেন্ট প্রুফ আপলোড সফল! ✅',
            'message': f"অর্ডার #{order_number} এর পেমেন্ট প্রুফ সফলভাবে আপলোড হয়েছে। অ্যাডমিন ভেরিফাই করছে। ৫-১৫ মিনিট অপেক্ষা করুন।",
            'type': 'info',
            'priority': 'normal'
        },
        'payment_verified': {
            'title': 'পেমেন্ট ভেরিফাই সফল! ✅',
            'message': f"অর্ডার #{order_number} এর পেমেন্ট ভেরিফাই হয়েছে! {diamonds} ডায়মন্ড শীঘ্রই পৌঁছাবে।",
            'type': 'success',
            'priority': 'high',
            'is_important': True
        },
        'payment_rejected': {
            'title': 'পেমেন্ট রিজেক্ট হয়েছে ❌',
            'message': f"অর্ডার #{order_number} এর পেমেন্ট রিজেক্ট হয়েছে। {notes or 'সাপোর্টে যোগাযোগ করুন: +8801883800356'}",
            'type': 'error',
            'priority': 'urgent',
            'is_important': True
        },
        'processing': {
            'title': 'অর্ডার প্রসেস হচ্ছে ⏳',
            'message': f"অর্ডার #{order_number} প্রসেস হচ্ছে। {diamonds} ডায়মন্ড ৫-১৫ মিনিটের মধ্যে পৌঁছাবে।",
            'type': 'info',
            'priority': 'high'
        },
        'completed': {
            'title': 'অর্ডার সম্পন্ন! 🎉🎉',
            'message': f"অর্ডার #{order_number} সম্পন্ন হয়েছে! {diamonds} ডায়মন্ড আপনার একাউন্ট ({player_id}) এ যোগ হয়েছে। ধন্যবাদ!",
            'type': 'success',
            'priority': 'urgent',
            'is_important': True
        },
        'failed': {
            'title': 'অর্ডার ব্যর্থ হয়েছে ❌',
            'message': f"অর্ডার #{order_number} ব্যর্থ হয়েছে। সাপোর্টে যোগাযোগ করুন: +8801883800356",
            'type': 'error',
            'priority': 'urgent',
            'is_important': True
        },
        'cancelled': {
            'title': 'অর্ডার বাতিল হয়েছে 🚫',
            'message': f"অর্ডার #{order_number} বাতিল করা হয়েছে। {notes}",
            'type': 'warning',
            'priority': 'normal'
        }
    }
    
    
    user_config = user_notification_map.get(status)
    
    if not user_config:
        print(f"⚠️ Unknown order status for notification: {status}")
        return False
    
    # Send notification to user only
    return send_notification(
        user_id=user_id,
        title=user_config['title'],
        message=user_config['message'],
        notification_type=user_config['type'],
        order_id=order_id,
        link='/dashboard',
        priority=user_config.get('priority', 'normal'),
        is_important=user_config.get('is_important', False),
        recipient_type='user'
    )


def send_system_notification(
    user_id: str,
    title: str,
    message: str,
    priority: str = 'normal',
    is_important: bool = False
) -> bool:
    """Send system notification"""
    return send_notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type='system',
        priority=priority,
        is_important=is_important
    )


def send_promotion_notification(
    user_id: str,
    title: str,
    message: str,
    link: Optional[str] = None
) -> bool:
    """Send promotional notification"""
    return send_notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type='promotion',
        link=link,
        priority='low'
    )


def send_support_notification(
    user_id: str,
    support_id: str,
    title: str,
    message: str,
    priority: str = 'normal'
) -> bool:
    """Send support ticket notification"""
    return send_notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type='support',
        support_id=support_id,
        link='/support',
        priority=priority
    )


def send_bulk_notification(
    user_ids: list,
    title: str,
    message: str,
    notification_type: str = 'system',
    priority: str = 'normal'
) -> int:
    """
    Send notification to multiple users
    
    Returns:
        int: Number of successful sends
    """
    success_count = 0
    
    for user_id in user_ids:
        if send_notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority
        ):
            success_count += 1
    
    print(f"✅ Sent {success_count}/{len(user_ids)} bulk notifications")
    return success_count
