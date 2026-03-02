# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Admin Notifications Query Failure Due to Non-Existent recipient_type Field
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists (query failures or incorrect filtering)
  - **Scoped PBT Approach**: Scope the property to concrete failing cases - admin notification endpoints with authenticated admin users
  - Test that admin notification endpoints fail or return incorrect results when filtering by non-existent recipient_type field
  - Test all 6 admin endpoints: GET /admin/notifications, PUT /admin/notifications/<id>/read, PUT /admin/notifications/mark-all-read, DELETE /admin/notifications/<id>, DELETE /admin/notifications/clear-all, GET /admin/notifications/stats
  - For each endpoint, verify that queries contain .eq('recipient_type', 'admin') filter on unfixed code
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (query errors, empty results, or incorrect filtering - this is correct and proves the bug exists)
  - Document counterexamples found (e.g., "GET /admin/notifications returns empty array despite notifications existing for admin user_id")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Regular User Notification Behavior Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for regular user notification endpoints (non-admin endpoints)
  - Test regular user endpoints: GET /notifications, PUT /notifications/<id>/read, PUT /notifications/mark-all-read, DELETE /notifications/<id>, DELETE /notifications/clear-all
  - Verify that regular user endpoints filter by user_id only (no recipient_type filter)
  - Verify that regular users see only their own notifications
  - Verify that notification creation via create_notification helper works correctly
  - Write property-based tests capturing observed behavior patterns: for all regular user requests, notifications are filtered by user_id only and users see only their own notifications
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 3. Fix admin notification controller to filter by user_id only

  - [x] 3.1 Remove recipient_type filters from all admin notification endpoints
    - Remove .eq('recipient_type', 'admin') from get_admin_notifications() at line 31
    - Remove .eq('recipient_type', 'admin') from mark_admin_notification_as_read() at line 70
    - Remove .eq('recipient_type', 'admin') from mark_all_admin_notifications_as_read() at line 96
    - Remove .eq('recipient_type', 'admin') from delete_admin_notification() at line 118
    - Remove .eq('recipient_type', 'admin') from clear_all_admin_notifications() at line 141
    - Remove .eq('recipient_type', 'admin') from get_admin_notification_stats() at line 163
    - Update comment at line 30 to clarify admin sees notifications where user_id matches (not recipient_type)
    - _Bug_Condition: isBugCondition(request) where request.endpoint is admin notification endpoint AND query_contains_recipient_type_filter(request)_
    - _Expected_Behavior: Admin notifications filtered by user_id only, matching authenticated admin's ID, without recipient_type filter_
    - _Preservation: Regular user notification endpoints continue to filter by user_id only, all existing functionality unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Admin Notifications Filtered by User ID Only
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - Verify all 6 admin endpoints now work correctly without recipient_type filter
    - Verify admin users see only their own notifications (filtered by user_id)
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Regular User Notification Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - Verify regular user notification endpoints continue to work correctly
    - Verify notification creation continues to work correctly
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
