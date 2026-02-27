import { useState, useEffect } from 'react';
import { notificationsAPI, adminNotificationsAPI } from '@/lib/api';

/**
 * Custom hook for real-time notification count
 * Polls the API every 30 seconds for unread count
 */
export function useNotificationCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getAll({ unread_only: true, limit: 100 });
      setUnreadCount(response.data?.length || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notification count:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshCount = () => {
    fetchUnreadCount();
  };

  const decrementCount = () => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const resetCount = () => {
    setUnreadCount(0);
  };

  return {
    unreadCount,
    loading,
    refreshCount,
    decrementCount,
    resetCount
  };
}

/**
 * Custom hook for admin notification count
 * Uses admin-specific endpoint
 */
export function useAdminNotificationCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    try {
      const response = await adminNotificationsAPI.getAll({ unread_only: true, limit: 100 });
      setUnreadCount(response.data?.length || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin notification count:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshCount = () => {
    fetchUnreadCount();
  };

  const decrementCount = () => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const resetCount = () => {
    setUnreadCount(0);
  };

  return {
    unreadCount,
    loading,
    refreshCount,
    decrementCount,
    resetCount
  };
}
