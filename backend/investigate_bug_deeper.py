"""
Deeper investigation into the notification bug
"""
from app.utils.supabase_client import get_supabase_admin

supabase = get_supabase_admin()

print(f"\n{'='*70}")
print("DEEPER BUG INVESTIGATION")
print(f"{'='*70}\n")

# The user with both types
admin_user_id = 'c7c30732-2122-4a78-84dc-fb42e7085e02'

print(f"Investigating user: {admin_user_id[:8]}...\n")

# Get all notifications for this user
all_notifs = supabase.table('notifications').select('*').eq(
    'user_id', admin_user_id
).order('created_at', desc=True).limit(10).execute()

print(f"Recent notifications for this user:")
print(f"{'Type':<12} {'Recipient':<12} {'Title':<40}")
print("-" * 70)

for notif in all_notifs.data:
    print(f"{notif['type']:<12} {notif['recipient_type']:<12} {notif['title'][:38]:<40}")

print(f"\n{'='*70}")
print("HYPOTHESIS TESTING")
print(f"{'='*70}\n")

print("Hypothesis 1: Admin users should ONLY see recipient_type='admin' notifications")
print("  Current behavior: Admin user has BOTH 'user' and 'admin' type notifications")
print("  This suggests the bug is about FILTERING, not schema\n")

print("Hypothesis 2: The admin notification controller filters by recipient_type='admin'")
print("  This means admin users would ONLY see their 'admin' type notifications")
print("  But they might be MISSING their 'user' type notifications\n")

print("Hypothesis 3: Regular users should ONLY see recipient_type='user' notifications")
print("  Let's check if regular users have any 'admin' type notifications...\n")

# Check regular users
regular_users = supabase.table('notifications').select('user_id').eq(
    'recipient_type', 'user'
).execute()

regular_user_ids = set([n['user_id'] for n in regular_users.data])

# Check if any regular users have admin notifications
for user_id in list(regular_user_ids)[:5]:
    admin_count = len(supabase.table('notifications').select('id').eq(
        'user_id', user_id
    ).eq('recipient_type', 'admin').execute().data)
    
    user_count = len(supabase.table('notifications').select('id').eq(
        'user_id', user_id
    ).eq('recipient_type', 'user').execute().data)
    
    if admin_count > 0:
        print(f"  User {user_id[:8]}...: user={user_count}, admin={admin_count} ⚠️")
    else:
        print(f"  User {user_id[:8]}...: user={user_count}, admin={admin_count} ✓")

print(f"\n{'='*70}")
print("ACTUAL BUG IDENTIFIED")
print(f"{'='*70}\n")

print("The REAL bug is NOT that recipient_type doesn't exist.")
print("The REAL bug is that the filtering logic is WRONG:\n")

print("Current (WRONG) behavior:")
print("  - Admin controller filters by: user_id AND recipient_type='admin'")
print("  - Regular controller filters by: user_id AND recipient_type='user'")
print("  - Result: Users are SPLIT into two separate notification streams\n")

print("Expected (CORRECT) behavior:")
print("  - Admin controller should filter by: user_id ONLY")
print("  - Regular controller should filter by: user_id ONLY")
print("  - Result: Users see ALL their notifications regardless of type\n")

print("Why this is a problem:")
print("  - Admin users miss their 'user' type notifications")
print("  - The recipient_type field is UNNECESSARY for user isolation")
print("  - User isolation should be based on user_id ONLY")
print("  - The recipient_type field creates artificial separation\n")

print("The fix:")
print("  - Remove .eq('recipient_type', 'admin') from admin controller")
print("  - Remove .eq('recipient_type', 'user') from regular controller (if present)")
print("  - Filter by user_id ONLY for proper user isolation\n")
