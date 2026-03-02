"""
Script to investigate the actual notification bug
"""
from app.utils.supabase_client import get_supabase_admin
from collections import defaultdict

supabase = get_supabase_admin()

# Get all notifications
result = supabase.table('notifications').select('user_id, recipient_type, title').execute()

print(f"\n{'='*70}")
print("NOTIFICATION BUG INVESTIGATION")
print(f"{'='*70}\n")

print(f"Total notifications: {len(result.data)}\n")

# Analyze distribution by user and recipient_type
user_stats = defaultdict(lambda: {'user': 0, 'admin': 0, 'total': 0})

for notif in result.data:
    user_id = notif['user_id']
    recipient_type = notif.get('recipient_type', 'unknown')
    user_stats[user_id][recipient_type] += 1
    user_stats[user_id]['total'] += 1

print("Distribution by user:")
print(f"{'User ID':<40} {'User Type':<12} {'Admin Type':<12} {'Total':<8}")
print("-" * 70)

for user_id, stats in list(user_stats.items())[:10]:
    print(f"{user_id[:36]:<40} {stats['user']:<12} {stats['admin']:<12} {stats['total']:<8}")

print(f"\n{'='*70}")
print("POTENTIAL ISSUES:")
print(f"{'='*70}\n")

# Check for potential issues
issues_found = []

# Issue 1: Users with both 'user' and 'admin' type notifications
for user_id, stats in user_stats.items():
    if stats['user'] > 0 and stats['admin'] > 0:
        issues_found.append(f"User {user_id[:8]}... has BOTH user ({stats['user']}) and admin ({stats['admin']}) notifications")

# Issue 2: Check if admin notifications are properly isolated
admin_users = set()
regular_users = set()

for user_id, stats in user_stats.items():
    if stats['admin'] > 0:
        admin_users.add(user_id)
    if stats['user'] > 0:
        regular_users.add(user_id)

overlap = admin_users & regular_users
if overlap:
    print(f"⚠️  ISSUE: {len(overlap)} users have BOTH admin and user type notifications")
    print("   This could indicate improper notification type assignment\n")
else:
    print(f"✓ No overlap: {len(admin_users)} admin users, {len(regular_users)} regular users\n")

# Issue 3: Check if the admin notification controller is actually being used
print("Checking admin notification controller usage...")
print("If the bug is 'users seeing other users' notifications', we need to check:")
print("1. Are admin notifications properly filtered by user_id?")
print("2. Are regular notifications properly filtered by user_id?")
print("3. Is there any cross-user leakage?\n")

# Get a sample admin user
if admin_users:
    sample_admin = list(admin_users)[0]
    print(f"Sample admin user: {sample_admin[:8]}...")
    
    # Check their notifications
    admin_notifs = supabase.table('notifications').select('*').eq(
        'user_id', sample_admin
    ).eq('recipient_type', 'admin').execute()
    
    print(f"  Admin notifications for this user: {len(admin_notifs.data)}")
    
    # Check if there are any notifications for this user with recipient_type='user'
    user_notifs = supabase.table('notifications').select('*').eq(
        'user_id', sample_admin
    ).eq('recipient_type', 'user').execute()
    
    print(f"  User notifications for this user: {len(user_notifs.data)}")
    
    if len(user_notifs.data) > 0:
        print("  ⚠️  This admin user has 'user' type notifications - possible issue")

print(f"\n{'='*70}")
print("CONCLUSION:")
print(f"{'='*70}\n")

if len(issues_found) > 0:
    print("Issues found:")
    for issue in issues_found:
        print(f"  - {issue}")
else:
    print("No obvious issues found with recipient_type field.")
    print("\nPossible scenarios:")
    print("1. The bug was already fixed by applying the migration")
    print("2. The bug description is incorrect")
    print("3. The bug is about something else (e.g., user isolation logic)")
    print("4. The bug only occurs in specific scenarios not covered by current data")

print()
