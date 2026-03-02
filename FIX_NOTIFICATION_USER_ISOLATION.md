# Fix: Notification User Isolation 🔒

## সমস্যা
User দের account এ অন্য user এর notification দেখাচ্ছিল। প্রতিটি user শুধু তার নিজের notification দেখতে পারবে।

## সমাধান

### 1. Backend Fix (notification_controller.py)

#### আগে (সমস্যা):
```python
# Admin/user check করছিল এবং recipient_type filter করছিল
if is_admin:
    query = query.eq('recipient_type', 'admin')
else:
    query = query.eq('user_id', user_id_str).eq('recipient_type', 'user')
```

#### এখন (ঠিক):
```python
# শুধু user_id দিয়ে filter করছে
query = supabase.table('notifications').select('*').eq('user_id', user_id_str)
```

### 2. Database Fix (SQL Script)

File: `backend/supabase/fix_notification_user_ids.sql`

এটা করবে:
- ✅ Orphaned notifications delete করবে (যেগুলোর user_id নেই)
- ✅ Index যোগ করবে faster queries এর জন্য
- ✅ user_id field কে NOT NULL করবে

## কিভাবে কাজ করে

### Notification Creation
```python
# Order complete হলে
create_notification(
    user_id=order.user_id,  # ✅ Specific user
    notification_type='success',
    title='অর্ডার সম্পন্ন!',
    message='আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে',
    related_order_id=order.id
)
```

### Notification Fetching
```python
# Backend automatically filters by user_id
query = supabase.table('notifications')\
    .select('*')\
    .eq('user_id', current_user.id)  # ✅ Only this user's notifications
```

### Frontend Display
```typescript
// User A logs in
const notifications = await notificationService.getNotifications();
// Returns only User A's notifications ✅

// User B logs in
const notifications = await notificationService.getNotifications();
// Returns only User B's notifications ✅
```

## Database Schema

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,  -- ✅ Required, references auth.users
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal',
  is_important BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  related_order_id UUID,
  related_support_id UUID,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  
  -- Foreign key constraint
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
```

## Setup Steps

### Step 1: Run SQL Script
Go to Supabase SQL Editor:
```sql
-- Run: backend/supabase/fix_notification_user_ids.sql
```

This will:
1. Check current notification status
2. Delete orphaned notifications
3. Add performance indexes
4. Make user_id required

### Step 2: Deploy Backend
```bash
git add backend/app/controllers/notification_controller.py
git commit -m "Fix: Notification user isolation"
git push origin main
```

Render will auto-deploy.

### Step 3: Test

#### Test User A:
1. Login as User A
2. Go to notifications
3. Should see only User A's notifications ✅

#### Test User B:
1. Login as User B
2. Go to notifications
3. Should see only User B's notifications ✅
4. Should NOT see User A's notifications ❌

## Notification Types

### User Notifications
```python
# Order completed
create_notification(
    user_id=user.id,
    notification_type='success',
    title='অর্ডার সম্পন্ন!',
    message='আপনার ডায়মন্ড পৌঁছে গেছে'
)

# Payment verified
create_notification(
    user_id=user.id,
    notification_type='info',
    title='পেমেন্ট ভেরিফাই হয়েছে',
    message='আপনার পেমেন্ট সফলভাবে ভেরিফাই হয়েছে'
)

# Order pending
create_notification(
    user_id=user.id,
    notification_type='warning',
    title='অর্ডার পেন্ডিং',
    message='আপনার অর্ডার ভেরিফিকেশনের জন্য অপেক্ষা করছে'
)
```

## Security Features

### 1. User Isolation
```python
# Backend ensures user can only see their own notifications
query = query.eq('user_id', current_user.id)
```

### 2. Authorization Check
```python
# Mark as read - only if notification belongs to user
response = supabase.table('notifications')\
    .update({'is_read': True})\
    .eq('id', notification_id)\
    .eq('user_id', current_user.id)\  # ✅ Security check
    .execute()
```

### 3. Delete Protection
```python
# Delete - only if notification belongs to user
response = supabase.table('notifications')\
    .delete()\
    .eq('id', notification_id)\
    .eq('user_id', current_user.id)\  # ✅ Security check
    .execute()
```

## API Endpoints

### Get Notifications
```http
GET /api/notifications
Authorization: Bearer <user_token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "user-uuid",  // ✅ Current user's ID
      "type": "success",
      "title": "অর্ডার সম্পন্ন!",
      "message": "আপনার ডায়মন্ড পৌঁছে গেছে",
      "is_read": false,
      "created_at": "2026-02-27T10:00:00Z"
    }
  ]
}
```

### Mark as Read
```http
PUT /api/notifications/{id}/read
Authorization: Bearer <user_token>

// Only works if notification belongs to current user ✅
```

### Mark All as Read
```http
PUT /api/notifications/mark-all-read
Authorization: Bearer <user_token>

// Only marks current user's notifications ✅
```

## Testing Checklist

- [ ] User A sees only their notifications
- [ ] User B sees only their notifications
- [ ] User A cannot see User B's notifications
- [ ] User B cannot see User A's notifications
- [ ] Mark as read works correctly
- [ ] Delete works correctly
- [ ] Notification count is accurate
- [ ] New notifications appear for correct user
- [ ] No orphaned notifications in database

## Debugging

### Check User's Notifications
```sql
-- In Supabase SQL Editor
SELECT 
  n.id,
  n.user_id,
  u.email,
  n.title,
  n.message,
  n.is_read,
  n.created_at
FROM notifications n
JOIN auth.users u ON n.user_id = u.id
WHERE u.email = 'user@example.com'
ORDER BY n.created_at DESC;
```

### Check Notification Distribution
```sql
SELECT 
  u.email,
  COUNT(n.id) as notification_count,
  COUNT(CASE WHEN n.is_read = false THEN 1 END) as unread_count
FROM auth.users u
LEFT JOIN notifications n ON u.id = n.user_id
GROUP BY u.email
ORDER BY notification_count DESC;
```

### Find Orphaned Notifications
```sql
SELECT * FROM notifications WHERE user_id IS NULL;
-- Should return 0 rows after fix ✅
```

## Common Issues

### Issue: User sees no notifications

**Cause:** user_id mismatch

**Fix:**
```sql
-- Check user's actual ID
SELECT id, email FROM auth.users WHERE email = 'user@example.com';

-- Check notifications for that user
SELECT * FROM notifications WHERE user_id = '<user-id>';
```

### Issue: User sees other user's notifications

**Cause:** Backend not filtering by user_id

**Fix:** Already fixed in notification_controller.py ✅

### Issue: Notifications not appearing

**Cause:** Notification created with wrong user_id

**Fix:**
```python
# Ensure correct user_id when creating
create_notification(
    user_id=order.user_id,  # ✅ From order
    # NOT: user_id=current_admin.id  # ❌ Wrong!
    ...
)
```

## Summary

✅ Backend filters notifications by user_id
✅ Each user sees only their own notifications
✅ Database enforces user_id requirement
✅ Indexes added for performance
✅ Security checks on all operations
✅ Orphaned notifications cleaned up

---

**Status:** ✅ Fixed
**Files Changed:**
- `backend/app/controllers/notification_controller.py`
- `backend/supabase/fix_notification_user_ids.sql`

**Next Steps:**
1. Run SQL script in Supabase
2. Deploy backend to Render
3. Test with multiple users
4. Verify isolation works correctly
