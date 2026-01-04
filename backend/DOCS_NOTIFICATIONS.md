# Notifications System - Design & Usage

## Overview
This system implements a real-time, database-backed notification system with per-user recipient records. It is event-driven via `EventBus` and provides REST and SSE endpoints for real-time delivery.

## DB Schema
- Notification
  - _id
  - title
  - message
  - type: enum(info|success|warning|error)
  - targetRoles: [String]
  - userId (nullable)
  - userModel
  - actionUrl
  - meta
  - createdAt
  - updatedAt

- NotificationRecipient
  - _id
  - notificationId
  - userId
  - userModel
  - readAt (nullable)
  - deliveredAt (nullable)
  - status: pending|delivered|failed
  - createdAt

## APIs (backend)
- GET /api/v1/communication/notifications?page=&limit=
  - Return paginated notifications for caller (server-side RBAC via `isLoggedIn`)
- GET /api/v1/communication/notifications/unread-count
  - Returns { count }
- POST /api/v1/communication/notifications/mark-read { notificationId }
- POST /api/v1/communication/notifications/mark-all-read
- POST /api/v1/communication/notifications/send { title, message, targetRoles, type, actionUrl }
  - Admin only
- GET /api/v1/communication/notifications/stream
  - SSE endpoint; requires Authorization header with Bearer token

## Next.js App Router proxy
To satisfy the requirement for App Router API routes, there is a proxy at:
- /api/notifications (Next.js route) which forwards to backend endpoints.
Note: SSE long-lived connections are best handled directly against the backend SSE endpoint. Proxying SSE through a Next.js serverless function is not recommended.

## Event → Notification Mapping (key examples)
- "auth.login" → Notification: "New login" → userId
- "auth.passwordReset" → Notification: "Password Reset" → userId
- "assignment.posted" → Notification: "Assignment Posted" → targetRoles: [student,parent]
- "assignment.graded" → Notification: "Assignment Graded" → targetRoles: [student]
- "user.created" → Notification: "User Created" → targetRoles: [admin]
- "system.announcement" → Notification: broadcast to roles
- "job.success"/"job.failure" → Notification to admin

## Admin Features
- Admins can send broadcast via endpoint or UI at `/admin/notifications`
- Notification types can be disabled by marking notifications as `disabled` (future enhancement: central type config)

## Realtime
- SSE endpoint sends `event: notification` messages with payload { notification, recipient }
- Fallback: client polls `/api/notifications/unread-count` every 20s
- Delivered recipients are updated when SSE push occurs (deliveredAt + status)

## Known Constraints / Caveats
- SSE is implemented on the backend Express server and is **not** proxied as a streaming proxy through Next.js App Router (serverless functions typically do not support long-lived SSE easily). Clients should connect directly to `${BACKEND_URL}/api/v1/communication/notifications/stream`.
- Scaling across multiple backend instances requires a shared pub/sub (Redis) to deliver events to all instances. Current implementation uses in-memory SSE connection map and EventBus, suitable for a single server or with sticky sessions.

## Test / Verification Checklist
- [ ] Run `npm run seed:notifications` to seed notifications for admin/teacher/student
- [ ] Start backend and frontend and connect as each role
- [ ] Verify unread-count updates on notification stream events
- [ ] Trigger `node scripts/trigger-notifications.js` and verify notifications are created and delivered
- [ ] Verify permission isolation by attempting to read other users' notifications (should be denied)
- [ ] Verify persistence across logout/login
- [ ] Verify Admin broadcast flows and that targetRoles receive the notification

