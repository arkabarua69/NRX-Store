# Bugfix Requirements Document

## Introduction

Users are seeing notifications from other users' accounts due to a schema mismatch in the admin notification controller. The controller attempts to filter notifications using a `recipient_type` field that does not exist in the database schema, causing the filtering to fail and allowing cross-user notification leakage.

The notifications table only contains a `user_id` field for identifying notification ownership. The admin notification controller incorrectly assumes a `recipient_type` field exists, while the regular notification controller correctly filters by `user_id` only.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN an admin user requests their notifications via `/admin/notifications` THEN the system attempts to filter by non-existent `recipient_type='admin'` field causing query failure or incorrect results

1.2 WHEN an admin user marks a notification as read via `/admin/notifications/<id>/read` THEN the system attempts to filter by non-existent `recipient_type='admin'` field potentially affecting wrong notifications

1.3 WHEN an admin user marks all notifications as read via `/admin/notifications/mark-all-read` THEN the system attempts to filter by non-existent `recipient_type='admin'` field potentially affecting notifications from other users

1.4 WHEN an admin user deletes a notification via `/admin/notifications/<id>` THEN the system attempts to filter by non-existent `recipient_type='admin'` field potentially deleting wrong notifications

1.5 WHEN an admin user clears all notifications via `/admin/notifications/clear-all` THEN the system attempts to filter by non-existent `recipient_type='admin'` field potentially clearing notifications from other users

1.6 WHEN an admin user requests notification stats via `/admin/notifications/stats` THEN the system attempts to filter by non-existent `recipient_type='admin'` field returning incorrect statistics

### Expected Behavior (Correct)

2.1 WHEN an admin user requests their notifications via `/admin/notifications` THEN the system SHALL filter by `user_id` matching the authenticated admin's ID only

2.2 WHEN an admin user marks a notification as read via `/admin/notifications/<id>/read` THEN the system SHALL update only notifications where `id` matches AND `user_id` matches the authenticated admin's ID

2.3 WHEN an admin user marks all notifications as read via `/admin/notifications/mark-all-read` THEN the system SHALL update only unread notifications where `user_id` matches the authenticated admin's ID

2.4 WHEN an admin user deletes a notification via `/admin/notifications/<id>` THEN the system SHALL delete only notifications where `id` matches AND `user_id` matches the authenticated admin's ID

2.5 WHEN an admin user clears all notifications via `/admin/notifications/clear-all` THEN the system SHALL delete only notifications where `user_id` matches the authenticated admin's ID

2.6 WHEN an admin user requests notification stats via `/admin/notifications/stats` THEN the system SHALL calculate statistics only from notifications where `user_id` matches the authenticated admin's ID

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a regular user requests their notifications via `/notifications` THEN the system SHALL CONTINUE TO filter by `user_id` matching the authenticated user's ID

3.2 WHEN a regular user marks a notification as read via `/notifications/<id>/read` THEN the system SHALL CONTINUE TO update only notifications where `id` matches AND `user_id` matches the authenticated user's ID

3.3 WHEN a regular user marks all notifications as read via `/notifications/mark-all-read` THEN the system SHALL CONTINUE TO update only unread notifications where `user_id` matches the authenticated user's ID

3.4 WHEN a regular user deletes a notification via `/notifications/<id>` THEN the system SHALL CONTINUE TO delete only notifications where `id` matches AND `user_id` matches the authenticated user's ID

3.5 WHEN a regular user clears all notifications via `/notifications/clear-all` THEN the system SHALL CONTINUE TO delete only notifications where `user_id` matches the authenticated user's ID

3.6 WHEN the `create_notification` helper function creates a notification THEN the system SHALL CONTINUE TO store the notification with the correct `user_id` field
