import { API_URL } from './config';
import { getAuthToken } from './supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_read: boolean;
  is_important: boolean;
  related_order_id?: string;
  related_support_id?: string;
  metadata?: any;
  created_at: string;
  read_at?: string;
}

export const notificationService = {
  async getNotifications(params?: {
    is_admin?: boolean;
    important_only?: boolean;
    unread_only?: boolean;
    limit?: number;
  }): Promise<Notification[]> {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.warn('⚠️ No auth token for notifications');
        return [];
      }

      const queryParams = new URLSearchParams();
      
      if (params?.is_admin) queryParams.append('is_admin', 'true');
      if (params?.important_only) queryParams.append('important_only', 'true');
      if (params?.unread_only) queryParams.append('unread_only', 'true');
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await fetch(`${API_URL}/notifications?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // If 401, token might be expired - try one more time with fresh token
      if (response.status === 401) {
        console.log('🔄 Got 401, retrying with fresh token...');
        const freshToken = await getAuthToken();
        
        if (!freshToken) {
          console.error('❌ No fresh token available');
          return [];
        }
        
        const retryResponse = await fetch(`${API_URL}/notifications?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${freshToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!retryResponse.ok) {
          console.error('❌ Retry failed with status:', retryResponse.status);
          return [];
        }
        
        const result = await retryResponse.json();
        return result.data || [];
      }

      if (!response.ok) {
        console.error('❌ Notifications API error:', response.status);
        return [];
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      return [];
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.warn('⚠️ No auth token for notification count');
        return 0;
      }
      
      const response = await fetch(`${API_URL}/notifications?unread_only=true&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // If 401, token might be expired - try one more time with fresh token
      if (response.status === 401) {
        console.log('🔄 Got 401, retrying with fresh token...');
        const freshToken = await getAuthToken();
        
        if (!freshToken) {
          console.error('❌ No fresh token available');
          return 0;
        }
        
        const retryResponse = await fetch(`${API_URL}/notifications?unread_only=true&limit=100`, {
          headers: {
            'Authorization': `Bearer ${freshToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!retryResponse.ok) {
          console.error('❌ Retry failed with status:', retryResponse.status);
          return 0;
        }
        
        const result = await retryResponse.json();
        const count = (result.data || []).length;
        console.log('✅ Unread notifications (after retry):', count);
        return count;
      }

      if (!response.ok) {
        console.error('❌ Notification count API error:', response.status);
        return 0;
      }

      const result = await response.json();
      const count = (result.data || []).length;
      console.log('✅ Unread notifications:', count);
      return count;
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
      return 0;
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  },

  async markAllAsRead(): Promise<void> {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark all as read');
    }
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  },

  async clearAll(): Promise<void> {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/notifications/clear-all`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to clear notifications');
    }
  },
};
