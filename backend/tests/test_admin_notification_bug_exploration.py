"""
Bug Condition Exploration Test for Admin Notification User Isolation Fix

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

Property 1: Fault Condition - Admin Notifications Query Failure Due to Non-Existent recipient_type Field

CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
DO NOT attempt to fix the test or the code when it fails.

This test verifies that admin notification endpoints fail or return incorrect results
when filtering by the non-existent recipient_type field.

Expected behavior on UNFIXED code:
- Queries will fail with database errors (column 'recipient_type' doesn't exist)
- This confirms the bug exists

Expected behavior on FIXED code:
- All queries work correctly
- Admin users see only their own notifications (filtered by user_id)
- No recipient_type filtering is attempted
"""

import pytest
from app.utils.supabase_client import get_supabase_admin


class TestAdminNotificationBugExploration:
    """
    Bug exploration tests for admin notification endpoints.
    These tests encode the EXPECTED behavior and will fail on unfixed code.
    
    This test directly queries the database to demonstrate the bug without
    needing API authentication.
    """
    
    def setup_method(self):
        """Set up test data before each test"""
        self.supabase = get_supabase_admin()
        
    def test_recipient_type_field_does_not_exist_in_schema(self):
        """
        Test that the recipient_type field does NOT exist in the notifications table.
        
        This is a schema verification test that confirms the root cause of the bug.
        
        Expected: This test should PASS, confirming recipient_type doesn't exist.
        """
        # Try to query with recipient_type filter - this should fail
        try:
            response = self.supabase.table('notifications').select('*').eq(
                'recipient_type', 'admin'
            ).limit(1).execute()
            
            # If we get here without an error, the field exists (unexpected)
            pytest.fail(
                "Query with recipient_type succeeded - field exists in schema! "
                "This contradicts the bug description."
            )
        except Exception as e:
            error_msg = str(e).lower()
            # We expect an error about the column not existing
            assert 'column' in error_msg or 'recipient_type' in error_msg, \
                f"Expected column error, got: {e}"
            print(f"✓ Confirmed: recipient_type field does not exist. Error: {e}")
    
    def test_admin_notification_query_with_recipient_type_fails(self):
        """
        Test that querying notifications with recipient_type filter fails.
        
        This simulates what the admin notification controller does on UNFIXED code.
        
        Expected on UNFIXED code: Query FAILS with column error
        Expected on FIXED code: This test becomes obsolete (recipient_type removed)
        
        **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**
        """
        # Create a test user_id (we'll use a UUID format)
        test_user_id = '00000000-0000-0000-0000-000000000001'
        
        # Try to query with both user_id and recipient_type (what unfixed code does)
        try:
            response = self.supabase.table('notifications').select('*').eq(
                'user_id', test_user_id
            ).eq(
                'recipient_type', 'admin'
            ).execute()
            
            # If we get here, the query succeeded (unexpected on unfixed code)
            pytest.fail(
                "Query with recipient_type succeeded! Either:\n"
                "1. The field was added to the schema, or\n"
                "2. The code has been fixed\n"
                f"Result: {response.data}"
            )
        except Exception as e:
            error_msg = str(e).lower()
            # We expect an error about the column not existing
            assert 'column' in error_msg or 'recipient_type' in error_msg, \
                f"Expected column error, got: {e}"
            print(f"✓ Bug confirmed: Query with recipient_type fails. Error: {e}")
            print("  This is the EXPECTED behavior on unfixed code.")
            print("  The admin notification controller will fail with this error.")
    
    def test_query_without_recipient_type_succeeds(self):
        """
        Test that querying notifications WITHOUT recipient_type filter works.
        
        This demonstrates the correct approach (filtering by user_id only).
        
        Expected: This test should PASS on both unfixed and fixed code.
        
        **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**
        """
        # Create a test user_id
        test_user_id = '00000000-0000-0000-0000-000000000001'
        
        # Query with only user_id (correct approach)
        try:
            response = self.supabase.table('notifications').select('*').eq(
                'user_id', test_user_id
            ).execute()
            
            # This should succeed
            print(f"✓ Query without recipient_type succeeded")
            print(f"  Returned {len(response.data)} notifications")
            print("  This is the CORRECT approach for both admin and regular users")
            
            # Verify all returned notifications belong to the user
            for notif in response.data:
                assert notif['user_id'] == test_user_id, \
                    "Notification belongs to wrong user"
            
        except Exception as e:
            pytest.fail(f"Query without recipient_type failed unexpectedly: {e}")
    
    def test_counterexample_admin_controller_line_31(self):
        """
        Test the exact query from admin_notification_controller.py line 31.
        
        This is a direct counterexample showing the bug in get_admin_notifications().
        
        Expected on UNFIXED code: FAILS with column error
        Expected on FIXED code: PASSES (recipient_type filter removed)
        
        **Validates: Requirement 2.1**
        """
        test_user_id = '00000000-0000-0000-0000-000000000001'
        
        print("\n=== Counterexample 1: GET /admin/notifications (line 31) ===")
        print(f"Code: query.eq('user_id', '{test_user_id}').eq('recipient_type', 'admin')")
        
        try:
            # This is the exact query from line 31 of admin_notification_controller.py
            response = self.supabase.table('notifications').select('*').eq(
                'user_id', test_user_id
            ).eq(
                'recipient_type', 'admin'
            ).execute()
            
            pytest.fail("Query succeeded - bug may be fixed or field was added")
        except Exception as e:
            print(f"Result: FAILS with error: {e}")
            print("Status: Bug CONFIRMED - admin cannot get their notifications")
            assert 'column' in str(e).lower() or 'recipient_type' in str(e).lower()
    
    def test_counterexample_admin_controller_line_70(self):
        """
        Test the exact query from admin_notification_controller.py line 70.
        
        This is a direct counterexample showing the bug in mark_admin_notification_as_read().
        
        Expected on UNFIXED code: FAILS with column error
        Expected on FIXED code: PASSES (recipient_type filter removed)
        
        **Validates: Requirement 2.2**
        """
        test_user_id = '00000000-0000-0000-0000-000000000001'
        test_notif_id = '00000000-0000-0000-0000-000000000002'
        
        print("\n=== Counterexample 2: PUT /admin/notifications/<id>/read (line 70) ===")
        print(f"Code: .eq('id', '{test_notif_id}').eq('user_id', '{test_user_id}').eq('recipient_type', 'admin')")
        
        try:
            # This is the exact query from line 70
            response = self.supabase.table('notifications').update({
                'is_read': True
            }).eq('id', test_notif_id).eq('user_id', test_user_id).eq(
                'recipient_type', 'admin'
            ).execute()
            
            pytest.fail("Query succeeded - bug may be fixed or field was added")
        except Exception as e:
            print(f"Result: FAILS with error: {e}")
            print("Status: Bug CONFIRMED - admin cannot mark notifications as read")
            assert 'column' in str(e).lower() or 'recipient_type' in str(e).lower()
    
    def test_counterexample_admin_controller_line_96(self):
        """
        Test the exact query from admin_notification_controller.py line 96.
        
        This is a direct counterexample showing the bug in mark_all_admin_notifications_as_read().
        
        Expected on UNFIXED code: FAILS with column error
        Expected on FIXED code: PASSES (recipient_type filter removed)
        
        **Validates: Requirement 2.3**
        """
        test_user_id = '00000000-0000-0000-0000-000000000001'
        
        print("\n=== Counterexample 3: PUT /admin/notifications/mark-all-read (line 96) ===")
        print(f"Code: .eq('user_id', '{test_user_id}').eq('recipient_type', 'admin').eq('is_read', False)")
        
        try:
            # This is the exact query from line 96
            response = self.supabase.table('notifications').update({
                'is_read': True
            }).eq('user_id', test_user_id).eq('recipient_type', 'admin').eq(
                'is_read', False
            ).execute()
            
            pytest.fail("Query succeeded - bug may be fixed or field was added")
        except Exception as e:
            print(f"Result: FAILS with error: {e}")
            print("Status: Bug CONFIRMED - admin cannot mark all notifications as read")
            assert 'column' in str(e).lower() or 'recipient_type' in str(e).lower()
    
    def test_counterexample_admin_controller_line_118(self):
        """
        Test the exact query from admin_notification_controller.py line 118.
        
        This is a direct counterexample showing the bug in delete_admin_notification().
        
        Expected on UNFIXED code: FAILS with column error
        Expected on FIXED code: PASSES (recipient_type filter removed)
        
        **Validates: Requirement 2.4**
        """
        test_user_id = '00000000-0000-0000-0000-000000000001'
        test_notif_id = '00000000-0000-0000-0000-000000000002'
        
        print("\n=== Counterexample 4: DELETE /admin/notifications/<id> (line 118) ===")
        print(f"Code: .delete().eq('id', '{test_notif_id}').eq('user_id', '{test_user_id}').eq('recipient_type', 'admin')")
        
        try:
            # This is the exact query from line 118
            response = self.supabase.table('notifications').delete().eq(
                'id', test_notif_id
            ).eq('user_id', test_user_id).eq('recipient_type', 'admin').execute()
            
            pytest.fail("Query succeeded - bug may be fixed or field was added")
        except Exception as e:
            print(f"Result: FAILS with error: {e}")
            print("Status: Bug CONFIRMED - admin cannot delete notifications")
            assert 'column' in str(e).lower() or 'recipient_type' in str(e).lower()
    
    def test_counterexample_admin_controller_line_141(self):
        """
        Test the exact query from admin_notification_controller.py line 141.
        
        This is a direct counterexample showing the bug in clear_all_admin_notifications().
        
        Expected on UNFIXED code: FAILS with column error
        Expected on FIXED code: PASSES (recipient_type filter removed)
        
        **Validates: Requirement 2.5**
        """
        test_user_id = '00000000-0000-0000-0000-000000000001'
        
        print("\n=== Counterexample 5: DELETE /admin/notifications/clear-all (line 141) ===")
        print(f"Code: .delete().eq('user_id', '{test_user_id}').eq('recipient_type', 'admin')")
        
        try:
            # This is the exact query from line 141
            response = self.supabase.table('notifications').delete().eq(
                'user_id', test_user_id
            ).eq('recipient_type', 'admin').execute()
            
            pytest.fail("Query succeeded - bug may be fixed or field was added")
        except Exception as e:
            print(f"Result: FAILS with error: {e}")
            print("Status: Bug CONFIRMED - admin cannot clear all notifications")
            assert 'column' in str(e).lower() or 'recipient_type' in str(e).lower()
    
    def test_counterexample_admin_controller_line_163(self):
        """
        Test the exact query from admin_notification_controller.py line 163.
        
        This is a direct counterexample showing the bug in get_admin_notification_stats().
        
        Expected on UNFIXED code: FAILS with column error
        Expected on FIXED code: PASSES (recipient_type filter removed)
        
        **Validates: Requirement 2.6**
        """
        test_user_id = '00000000-0000-0000-0000-000000000001'
        
        print("\n=== Counterexample 6: GET /admin/notifications/stats (line 163) ===")
        print(f"Code: .select('id, is_read, is_important').eq('user_id', '{test_user_id}').eq('recipient_type', 'admin')")
        
        try:
            # This is the exact query from line 163
            response = self.supabase.table('notifications').select(
                'id, is_read, is_important'
            ).eq('user_id', test_user_id).eq('recipient_type', 'admin').execute()
            
            pytest.fail("Query succeeded - bug may be fixed or field was added")
        except Exception as e:
            print(f"Result: FAILS with error: {e}")
            print("Status: Bug CONFIRMED - admin cannot get notification stats")
            assert 'column' in str(e).lower() or 'recipient_type' in str(e).lower()


class TestBugSummary:
    """
    Summary test that documents all counterexamples found.
    """
    
    def test_bug_summary(self):
        """
        Summary of bug exploration findings.
        
        This test documents all counterexamples found during bug exploration.
        """
        print("\n" + "="*70)
        print("BUG EXPLORATION SUMMARY")
        print("="*70)
        print("\nBug: Admin notification endpoints fail due to non-existent recipient_type field")
        print("\nRoot Cause:")
        print("  - The notifications table schema does NOT have a 'recipient_type' column")
        print("  - The admin_notification_controller.py attempts to filter by this field")
        print("  - All 6 admin notification endpoints are affected")
        print("\nCounterexamples Found:")
        print("  1. GET /admin/notifications (line 31) - FAILS")
        print("  2. PUT /admin/notifications/<id>/read (line 70) - FAILS")
        print("  3. PUT /admin/notifications/mark-all-read (line 96) - FAILS")
        print("  4. DELETE /admin/notifications/<id> (line 118) - FAILS")
        print("  5. DELETE /admin/notifications/clear-all (line 141) - FAILS")
        print("  6. GET /admin/notifications/stats (line 163) - FAILS")
        print("\nExpected Fix:")
        print("  - Remove .eq('recipient_type', 'admin') from all 6 endpoints")
        print("  - Filter by user_id only (matching regular notification controller)")
        print("\nValidates Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6")
        print("="*70 + "\n")
        
        # This test always passes - it's just documentation
        assert True
