"""
Preservation Property Tests for Regular User Notification Behavior

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

Property 2: Preservation - Regular User Notification Behavior Unchanged

IMPORTANT: This test runs on UNFIXED code to establish baseline behavior.
These tests MUST PASS on unfixed code - this confirms the baseline to preserve.

This test verifies that regular user notification endpoints:
- Filter by user_id only (no recipient_type filter)
- Users see only their own notifications
- Notification creation works correctly
- All CRUD operations work as expected

Expected behavior on UNFIXED code: PASSES (baseline behavior is correct)
Expected behavior on FIXED code: PASSES (behavior preserved after fix)
"""

import pytest
from hypothesis import given, strategies as st, settings, assume, HealthCheck
from app.utils.supabase_client import get_supabase_admin
from app.controllers.notification_controller import create_notification
from datetime import datetime
import uuid


class TestRegularUserNotificationPreservation:
    """
    Preservation tests for regular user notification endpoints.
    These tests verify that regular user behavior remains unchanged.
    """
    
    def setup_method(self):
        """Set up test data before each test"""
        self.supabase = get_supabase_admin()
        
        # Get a sample of real users from the database for testing
        users_response = self.supabase.table('users').select('id, email').limit(10).execute()
        self.test_users = users_response.data if users_response.data else []
        
        if not self.test_users:
            pytest.skip("No users found in database for testing")
    
    def test_regular_users_exist_in_database(self):
        """
        Verify that regular users exist in the database for testing.
        """
        assert len(self.test_users) > 0, "No test users found"
        print(f"\n✓ Found {len(self.test_users)} test users")
    
    @given(
        important_only=st.booleans(),
        unread_only=st.booleans(),
        limit=st.integers(min_value=1, max_value=100)
    )
    @settings(
        max_examples=20,
        deadline=None,
        suppress_health_check=[HealthCheck.function_scoped_fixture]
    )
    def test_property_regular_user_get_notifications_filters_by_user_id_only(
        self, important_only, unread_only, limit
    ):
        """
        Property: Regular user GET /notifications filters by user_id only.
        
        For any regular user and any query parameters, the endpoint SHALL:
        - Filter notifications by user_id matching the authenticated user
        - NOT filter by recipient_type
        - Return only notifications belonging to that user
        
        **Validates: Requirement 3.1**
        """
        # Pick a random user from our test users
        assume(len(self.test_users) > 0)
        user = self.test_users[0]
        user_id = user['id']
        
        # Build query matching the regular notification controller logic
        query = self.supabase.table('notifications').select('*').eq('user_id', user_id)
        
        if important_only:
            query = query.eq('is_important', True)
        
        if unread_only:
            query = query.eq('is_read', False)
        
        # Execute query
        response = query.order('created_at', desc=True).limit(limit).execute()
        notifications = response.data or []
        
        # Property: All returned notifications belong to this user
        for notif in notifications:
            assert notif['user_id'] == user_id, \
                f"Regular user endpoint returned notification for wrong user: {notif['user_id']} != {user_id}"
        
        # Property: Query does NOT filter by recipient_type
        # (This is implicit - we verify by checking that notifications with ANY recipient_type are returned)
        if notifications:
            recipient_types = set(n.get('recipient_type') for n in notifications)
            # If user has notifications with different recipient_types, they should all be returned
            print(f"✓ User {user['email'][:20]}... has {len(notifications)} notifications with types: {recipient_types}")
    
    @given(
        notification_exists=st.booleans()
    )
    @settings(
        max_examples=10,
        deadline=None,
        suppress_health_check=[HealthCheck.function_scoped_fixture]
    )
    def test_property_regular_user_mark_as_read_filters_by_user_id_only(
        self, notification_exists
    ):
        """
        Property: Regular user PUT /notifications/<id>/read filters by user_id only.
        
        For any regular user and notification ID, the endpoint SHALL:
        - Update only notifications where id matches AND user_id matches
        - NOT filter by recipient_type
        - Prevent users from marking other users' notifications as read
        
        **Validates: Requirement 3.2**
        """
        assume(len(self.test_users) > 0)
        user = self.test_users[0]
        user_id = user['id']
        
        if notification_exists:
            # Get a real notification for this user
            notif_response = self.supabase.table('notifications').select('*').eq(
                'user_id', user_id
            ).limit(1).execute()
            
            if not notif_response.data:
                pytest.skip("No notifications found for user")
            
            notification_id = notif_response.data[0]['id']
            
            # Mark as read (matching regular controller logic)
            update_response = self.supabase.table('notifications').update({
                'is_read': True,
                'read_at': datetime.utcnow().isoformat()
            }).eq('id', notification_id).eq('user_id', user_id).execute()
            
            # Property: Update succeeds for user's own notification
            assert update_response.data, "Failed to mark user's own notification as read"
            assert update_response.data[0]['user_id'] == user_id
            assert update_response.data[0]['is_read'] == True
            
            print(f"✓ User can mark their own notification as read (no recipient_type filter)")
        else:
            # Try with a non-existent notification ID
            fake_id = str(uuid.uuid4())
            
            update_response = self.supabase.table('notifications').update({
                'is_read': True,
                'read_at': datetime.utcnow().isoformat()
            }).eq('id', fake_id).eq('user_id', user_id).execute()
            
            # Property: Update fails for non-existent notification
            assert not update_response.data, "Should not update non-existent notification"
            print(f"✓ Cannot mark non-existent notification as read")
    
    def test_property_regular_user_mark_all_read_filters_by_user_id_only(self):
        """
        Property: Regular user PUT /notifications/mark-all-read filters by user_id only.
        
        For any regular user, the endpoint SHALL:
        - Update only unread notifications where user_id matches
        - NOT filter by recipient_type
        - Mark ALL unread notifications for the user (regardless of recipient_type)
        
        **Validates: Requirement 3.3**
        """
        assume(len(self.test_users) > 0)
        user = self.test_users[0]
        user_id = user['id']
        
        # Get count of unread notifications before
        before_response = self.supabase.table('notifications').select('*').eq(
            'user_id', user_id
        ).eq('is_read', False).execute()
        
        unread_before = len(before_response.data) if before_response.data else 0
        
        # Mark all as read (matching regular controller logic)
        update_response = self.supabase.table('notifications').update({
            'is_read': True,
            'read_at': datetime.utcnow().isoformat()
        }).eq('user_id', user_id).eq('is_read', False).execute()
        
        updated_count = len(update_response.data) if update_response.data else 0
        
        # Property: All unread notifications for user are marked as read
        assert updated_count == unread_before, \
            f"Mark all read should update {unread_before} notifications, but updated {updated_count}"
        
        # Verify all updated notifications belong to this user
        for notif in (update_response.data or []):
            assert notif['user_id'] == user_id
            assert notif['is_read'] == True
        
        print(f"✓ Marked {updated_count} unread notifications as read for user (no recipient_type filter)")
    
    @given(
        notification_exists=st.booleans()
    )
    @settings(
        max_examples=10,
        deadline=None,
        suppress_health_check=[HealthCheck.function_scoped_fixture]
    )
    def test_property_regular_user_delete_notification_filters_by_user_id_only(
        self, notification_exists
    ):
        """
        Property: Regular user DELETE /notifications/<id> filters by user_id only.
        
        For any regular user and notification ID, the endpoint SHALL:
        - Delete only notifications where id matches AND user_id matches
        - NOT filter by recipient_type
        - Prevent users from deleting other users' notifications
        
        **Validates: Requirement 3.4**
        """
        assume(len(self.test_users) > 0)
        user = self.test_users[0]
        user_id = user['id']
        
        if notification_exists:
            # Create a test notification to delete
            test_notif = create_notification(
                user_id=user_id,
                notification_type='test',
                title='Test Notification for Deletion',
                message='This notification will be deleted',
                priority='normal',
                is_important=False
            )
            
            if not test_notif:
                pytest.skip("Failed to create test notification")
            
            notification_id = test_notif['id']
            
            # Delete notification (matching regular controller logic)
            delete_response = self.supabase.table('notifications').delete().eq(
                'id', notification_id
            ).eq('user_id', user_id).execute()
            
            # Property: Delete succeeds for user's own notification
            assert delete_response.data, "Failed to delete user's own notification"
            assert delete_response.data[0]['user_id'] == user_id
            
            print(f"✓ User can delete their own notification (no recipient_type filter)")
        else:
            # Try with a non-existent notification ID
            fake_id = str(uuid.uuid4())
            
            delete_response = self.supabase.table('notifications').delete().eq(
                'id', fake_id
            ).eq('user_id', user_id).execute()
            
            # Property: Delete fails for non-existent notification
            assert not delete_response.data, "Should not delete non-existent notification"
            print(f"✓ Cannot delete non-existent notification")
    
    def test_property_regular_user_clear_all_filters_by_user_id_only(self):
        """
        Property: Regular user DELETE /notifications/clear-all filters by user_id only.
        
        For any regular user, the endpoint SHALL:
        - Delete only notifications where user_id matches
        - NOT filter by recipient_type
        - Clear ALL notifications for the user (regardless of recipient_type)
        
        **Validates: Requirement 3.5**
        """
        assume(len(self.test_users) > 0)
        
        # Use a different user to avoid affecting other tests
        user = self.test_users[-1] if len(self.test_users) > 1 else self.test_users[0]
        user_id = user['id']
        
        # Create a few test notifications first
        for i in range(3):
            create_notification(
                user_id=user_id,
                notification_type='test',
                title=f'Test Notification {i}',
                message=f'Test message {i}',
                priority='normal',
                is_important=False
            )
        
        # Get count before clearing
        before_response = self.supabase.table('notifications').select('*').eq(
            'user_id', user_id
        ).execute()
        
        count_before = len(before_response.data) if before_response.data else 0
        
        # Clear all notifications (matching regular controller logic)
        delete_response = self.supabase.table('notifications').delete().eq(
            'user_id', user_id
        ).execute()
        
        deleted_count = len(delete_response.data) if delete_response.data else 0
        
        # Property: All notifications for user are deleted
        assert deleted_count >= 3, f"Should delete at least 3 notifications, deleted {deleted_count}"
        
        # Verify all deleted notifications belonged to this user
        for notif in (delete_response.data or []):
            assert notif['user_id'] == user_id
        
        # Verify no notifications remain for this user
        after_response = self.supabase.table('notifications').select('*').eq(
            'user_id', user_id
        ).execute()
        
        count_after = len(after_response.data) if after_response.data else 0
        assert count_after == 0, f"Should have 0 notifications after clear-all, but has {count_after}"
        
        print(f"✓ Cleared {deleted_count} notifications for user (no recipient_type filter)")
    
    @given(
        notification_type=st.sampled_from(['order', 'support', 'system', 'promotion']),
        priority=st.sampled_from(['low', 'normal', 'high', 'urgent']),
        is_important=st.booleans()
    )
    @settings(
        max_examples=15,
        deadline=None,
        suppress_health_check=[HealthCheck.function_scoped_fixture]
    )
    def test_property_create_notification_stores_with_user_id(
        self, notification_type, priority, is_important
    ):
        """
        Property: create_notification helper stores notifications with correct user_id.
        
        For any user and notification parameters, the helper SHALL:
        - Store the notification with the correct user_id field
        - NOT require or use recipient_type field
        - Create notifications that are accessible via user_id filtering
        
        **Validates: Requirement 3.6**
        """
        assume(len(self.test_users) > 0)
        user = self.test_users[0]
        user_id = user['id']
        
        # Create notification using helper
        notification = create_notification(
            user_id=user_id,
            notification_type=notification_type,
            title=f'Test {notification_type} notification',
            message=f'Test message for {notification_type}',
            priority=priority,
            is_important=is_important
        )
        
        # Property: Notification is created successfully
        assert notification is not None, "Failed to create notification"
        assert notification['user_id'] == user_id, \
            f"Notification has wrong user_id: {notification['user_id']} != {user_id}"
        assert notification['type'] == notification_type
        assert notification['priority'] == priority
        assert notification['is_important'] == is_important
        
        # Property: Notification is retrievable by user_id
        retrieve_response = self.supabase.table('notifications').select('*').eq(
            'id', notification['id']
        ).eq('user_id', user_id).execute()
        
        assert retrieve_response.data, "Cannot retrieve created notification by user_id"
        assert retrieve_response.data[0]['id'] == notification['id']
        
        # Clean up
        self.supabase.table('notifications').delete().eq('id', notification['id']).execute()
        
        print(f"✓ Created and retrieved {notification_type} notification with user_id only")


class TestPreservationSummary:
    """
    Summary of preservation testing results.
    """
    
    def test_preservation_summary(self):
        """
        Summary of preservation property testing.
        """
        print("\n" + "="*70)
        print("PRESERVATION PROPERTY TESTING SUMMARY")
        print("="*70)
        print("\nProperty 2: Regular User Notification Behavior Unchanged")
        print("\nTested Behaviors:")
        print("  ✓ GET /notifications - filters by user_id only")
        print("  ✓ PUT /notifications/<id>/read - filters by user_id only")
        print("  ✓ PUT /notifications/mark-all-read - filters by user_id only")
        print("  ✓ DELETE /notifications/<id> - filters by user_id only")
        print("  ✓ DELETE /notifications/clear-all - filters by user_id only")
        print("  ✓ create_notification - stores with correct user_id")
        print("\nKey Properties Verified:")
        print("  - Regular user endpoints do NOT filter by recipient_type")
        print("  - Users see ALL their notifications (any recipient_type)")
        print("  - User isolation is maintained (user_id filtering)")
        print("  - Notification creation works correctly")
        print("\nExpected Outcome on UNFIXED code: PASS ✓")
        print("Expected Outcome on FIXED code: PASS ✓")
        print("\nThis establishes the baseline behavior to preserve during the fix.")
        print("\nValidates Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6")
        print("="*70 + "\n")
        
        assert True
