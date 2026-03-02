import { useState, useEffect, useCallback } from 'react';

interface PlatformStats {
  active_users: number;
  successful_orders: number;
  total_orders: number;
  avg_delivery_minutes: number;
  avg_rating: number;
  total_reviews: number;
  last_updated: string;
}

const DEFAULT_STATS: PlatformStats = {
  active_users: 100000,
  successful_orders: 50000,
  total_orders: 60000,
  avg_delivery_minutes: 8,
  avg_rating: 4.9,
  total_reviews: 12847,
  last_updated: new Date().toISOString()
};

/**
 * Custom hook for fetching and auto-updating platform statistics
 * 
 * @param autoRefresh - Enable automatic refresh every 30 seconds (default: true)
 * @param refreshInterval - Refresh interval in milliseconds (default: 30000)
 * @returns Platform statistics and loading state
 */
export function usePlatformStats(autoRefresh = true, refreshInterval = 30000) {
  const [stats, setStats] = useState<PlatformStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/stats/platform-stats`);

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setStats(result.data);
          setError(null);
          console.log('✅ Platform stats updated:', result.data);
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('❌ Error fetching platform stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      // Keep using cached stats on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing platform stats...');
      fetchStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchStats]);

  // Listen for manual refresh events
  useEffect(() => {
    const handleRefresh = () => {
      console.log('🔄 Manual refresh triggered');
      fetchStats();
    };

    window.addEventListener('refreshPlatformStats', handleRefresh);
    return () => window.removeEventListener('refreshPlatformStats', handleRefresh);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  };
}

/**
 * Trigger a manual refresh of platform stats across all components
 */
export function refreshPlatformStats() {
  window.dispatchEvent(new Event('refreshPlatformStats'));
}
