# Real-Time Statistics System

## Overview

এই সিস্টেম প্রতিটি ইউজার এবং সব অর্ডারের জন্য রিয়েল-টাইম স্ট্যাটিস্টিক্স প্রদান করে।

## Features

### 1. Platform-Wide Statistics (সক্রিয় গ্রাহক, সফল অর্ডার, গড় ডেলিভারি, রেটিং)

**Backend API:** `GET /api/stats/platform-stats`

**Real-Time Calculations:**
- ✅ **সক্রিয় গ্রাহক (Active Customers)**: যেসব ইউজার কমপক্ষে একটি অর্ডার করেছে
- ✅ **সফল অর্ডার (Successful Orders)**: সব completed status এর অর্ডার
- ✅ **গড় ডেলিভারি (Average Delivery)**: সব completed অর্ডারের created_at থেকে updated_at এর গড় সময়
- ✅ **গ্রাহক রেটিং (Customer Rating)**: সব reviews এর গড় rating

**Response Example:**
```json
{
  "success": true,
  "data": {
    "active_users": 4,
    "successful_orders": 3,
    "total_orders": 5,
    "avg_delivery_minutes": 1,
    "avg_rating": 5.0,
    "total_reviews": 25,
    "last_updated": "2026-03-03T10:30:00Z"
  }
}
```

### 2. User-Specific Statistics

**Backend API:** `GET /api/stats/user-stats/<user_id>`

**Real-Time Calculations:**
- ✅ User's total orders
- ✅ User's successful orders
- ✅ User's pending orders
- ✅ User's average delivery time
- ✅ User's average rating
- ✅ User's total reviews

**Response Example:**
```json
{
  "success": true,
  "data": {
    "user_id": "abc123",
    "total_orders": 10,
    "successful_orders": 8,
    "pending_orders": 2,
    "avg_delivery_minutes": 7,
    "avg_rating": 4.8,
    "total_reviews": 5,
    "last_updated": "2026-03-03T10:30:00Z"
  }
}
```

## Frontend Integration

### Using the Custom Hook

```typescript
import { usePlatformStats } from '@/hooks/usePlatformStats';

function MyComponent() {
  // Auto-refresh every 30 seconds
  const { stats, loading, error, refresh } = usePlatformStats();

  // Or disable auto-refresh
  const { stats } = usePlatformStats(false);

  // Or custom refresh interval (60 seconds)
  const { stats } = usePlatformStats(true, 60000);

  return (
    <div>
      <p>সক্রিয় গ্রাহক: {stats.active_users}</p>
      <p>সফল অর্ডার: {stats.successful_orders}</p>
      <p>গড় ডেলিভারি: {stats.avg_delivery_minutes} মিনিট</p>
      <p>গ্রাহক রেটিং: {stats.avg_rating}/৫</p>
      <button onClick={refresh}>Refresh Now</button>
    </div>
  );
}
```

### Manual Refresh

```typescript
import { refreshPlatformStats } from '@/hooks/usePlatformStats';

// Trigger refresh across all components
refreshPlatformStats();
```

## Auto-Refresh Behavior

- **Default Interval:** 30 seconds
- **Automatic:** Stats refresh automatically in the background
- **Event-Based:** Manual refresh triggers update across all components
- **Error Handling:** Falls back to cached stats on API errors

## Database Queries

### Active Users Count
```sql
SELECT COUNT(DISTINCT user_id) FROM orders;
```

### Successful Orders Count
```sql
SELECT COUNT(*) FROM orders WHERE status = 'completed';
```

### Average Delivery Time
```sql
SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 60) 
FROM orders 
WHERE status = 'completed' 
AND (updated_at - created_at) BETWEEN INTERVAL '1 minute' AND INTERVAL '2 hours';
```

### Average Rating
```sql
SELECT AVG(rating) FROM reviews;
```

## Performance Optimization

1. **Caching:** Frontend caches stats and only refreshes periodically
2. **Fallback Values:** Default values shown on API errors
3. **Efficient Queries:** Database queries optimized with proper indexes
4. **Conditional Refresh:** Only refresh when component is visible

## Usage in Pages

### Homepage (Index.tsx, IndexMobile.tsx)
```typescript
const { stats } = usePlatformStats();
```

### Store Page (Store.tsx)
```typescript
const { stats } = usePlatformStats();
```

### About Page (About.tsx)
```typescript
const { stats } = usePlatformStats();
```

## Triggering Manual Refresh

### After Order Completion
```typescript
// In order completion handler
await completeOrder(orderId);
refreshPlatformStats(); // Update stats immediately
```

### After Review Submission
```typescript
// In review submission handler
await submitReview(reviewData);
refreshPlatformStats(); // Update stats immediately
```

## Testing

### Test Real-Time Updates
1. Open homepage
2. Complete an order in another tab
3. Stats should update within 30 seconds (or immediately with manual refresh)

### Test User-Specific Stats
```bash
curl http://localhost:5000/api/stats/user-stats/<user_id>
```

## Benefits

✅ **Real-Time Data:** Always shows current statistics
✅ **Automatic Updates:** No manual refresh needed
✅ **User Isolation:** Each user sees their own stats
✅ **Performance:** Efficient caching and queries
✅ **Error Handling:** Graceful fallback on errors
✅ **Scalable:** Works with any number of users/orders

## Future Enhancements

- [ ] WebSocket support for instant updates
- [ ] Redis caching for faster queries
- [ ] Historical stats tracking
- [ ] Admin dashboard with detailed analytics
- [ ] Export stats to CSV/PDF
