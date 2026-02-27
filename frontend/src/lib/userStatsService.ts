import { API_URL } from './config';
import { getAuthToken } from './supabase';

export interface UserStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  wishlistCount: number;
  reviewCount: number;
  totalSpent: number;
  totalDiamonds: number;
}

export const userStatsService = {
  async getUserStats(): Promise<UserStats> {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.warn('⚠️ No auth token for user stats');
        return {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          wishlistCount: 0,
          reviewCount: 0,
          totalSpent: 0,
          totalDiamonds: 0,
        };
      }

      const response = await fetch(`${API_URL}/users/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // If 401, try with fresh token
      if (response.status === 401) {
        console.log('🔄 Got 401, retrying with fresh token...');
        const freshToken = await getAuthToken();
        
        if (!freshToken) {
          console.error('❌ No fresh token available');
          return {
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            wishlistCount: 0,
            reviewCount: 0,
            totalSpent: 0,
            totalDiamonds: 0,
          };
        }
        
        const retryResponse = await fetch(`${API_URL}/users/stats`, {
          headers: {
            'Authorization': `Bearer ${freshToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!retryResponse.ok) {
          console.error('❌ Retry failed with status:', retryResponse.status);
          return {
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            wishlistCount: 0,
            reviewCount: 0,
            totalSpent: 0,
            totalDiamonds: 0,
          };
        }
        
        const result = await retryResponse.json();
        console.log('✅ User stats (after retry):', result.data);
        return result.data || {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          wishlistCount: 0,
          reviewCount: 0,
          totalSpent: 0,
          totalDiamonds: 0,
        };
      }

      if (!response.ok) {
        console.error('❌ User stats API error:', response.status);
        return {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          wishlistCount: 0,
          reviewCount: 0,
          totalSpent: 0,
          totalDiamonds: 0,
        };
      }

      const result = await response.json();
      console.log('✅ User stats:', result.data);
      return result.data || {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        wishlistCount: 0,
        reviewCount: 0,
        totalSpent: 0,
        totalDiamonds: 0,
      };
    } catch (error) {
      console.error('❌ Error fetching user stats:', error);
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        wishlistCount: 0,
        reviewCount: 0,
        totalSpent: 0,
        totalDiamonds: 0,
      };
    }
  },
};
