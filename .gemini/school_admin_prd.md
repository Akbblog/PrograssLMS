# School Admin Dashboard - Complete Implementation Plan

## Overview
This document outlines the complete implementation for the School Admin Dashboard, including sidebar structure, teacher/student management, attendance, communication, and role management.

---

## Phase 1: Dashboard & Sidebar Structure ✅ (Partially Complete)

### 1.1 Sidebar Menu Items (In Order)
1. **Dashboard** - Overview with stats cards
2. **Teachers** - Full CRUD for teachers
3. **Students** - Full CRUD for students
4. **Classes** - Class management
5. **Subjects** - Subject management
6. **Attendance** - Attendance tracking
7. **Communication** - Internal messaging
8. **Assessments** - Tests & quizzes
9. **Learning Courses** - Course management
10. **Reports** - Analytics & reports
11. **Roles & Permissions** - Role management
12. **Settings** - School settings

### 1.2 Dashboard Stats Cards
- Total Teachers (active/inactive)
- Total Students (by class)
- Today's Attendance Rate
- Pending Communications
- Upcoming Assessments
- Course Completion Rate

---

## Phase 2: Teacher Module (Priority: HIGH)

### 2.1 Backend Requirements
- [x] Teacher model exists with schoolId for multi-tenancy
- [ ] Add role/permissions field to teacher model
- [ ] Add teacher status (active/inactive/suspended)
- [ ] Ensure proper validation

### 2.2 Teacher CRUD Operations
- **Create Teacher**
  - Name, Email, Password
  - Assigned Classes (multi-select)
  - Assigned Subjects (multi-select)
  - Role/Permission level
  - Phone, Address
  - Profile picture (optional)

- **Read Teachers**
  - List with pagination
  - Filter by class, subject, status
  - Search by name/email

- **Update Teacher**
  - Edit all fields
  - Change password
  - Update permissions

- **Delete/Deactivate Teacher**
  - Soft delete (mark as inactive)
  - Can reactivate

### 2.3 Teacher Permissions (Initial Set)
```javascript
{
  canAddStudents: Boolean,
  canEditStudents: Boolean,
  canDeleteStudents: Boolean,
  canTakeAttendance: Boolean,
  canViewAttendance: Boolean,
  canAccessCommunication: Boolean,
  canCreateAssessments: Boolean,
  canViewReports: Boolean,
}
```

---

## Phase 3: Student Module (Priority: HIGH)

### 3.1 Backend Requirements
- [x] Student model exists with schoolId
- [ ] Add section field to student
- [ ] Add enrollment status
- [ ] Parent/Guardian information

### 3.2 Student CRUD Operations
- **Create Student**
  - Name, Email, Password
  - Class assignment (required)
  - Section assignment (optional)
  - Roll number
  - Date of birth
  - Parent/Guardian info
  - Phone, Address
  - Profile picture

- **Read Students**
  - List with pagination
  - Filter by class, section, status
  - Search by name/email/roll number

- **Update Student**
  - Promote to next class
  - Change section
  - Update profile

- **Delete/Withdraw Student**
  - Soft delete (mark as withdrawn)
  - Keep student history

### 3.3 Student Assignment Flow
1. Select Class from dropdown
2. Select Section (if applicable)
3. Auto-generate roll number (or manual entry)
4. Save student

---

## Phase 4: Attendance Module (Priority: HIGH)

### 4.1 Attendance Approach Analysis

| Method | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| Manual Entry | Simple, no hardware | Time-consuming | ✅ Start here |
| QR Code | Modern, fast | Requires devices | Future enhancement |
| Biometric | Accurate | Expensive hardware | Not recommended |
| Face Recognition | Touchless | Complex, expensive | Not recommended |

**Recommended Approach: Class-wise Manual Entry with Bulk Actions**

### 4.2 Attendance Data Model
```javascript
{
  student: ObjectId,
  classLevel: ObjectId,
  section: String,
  date: Date,
  status: "present" | "absent" | "late" | "excused",
  markedBy: ObjectId (Teacher/Admin),
  subject: ObjectId (optional, for subject-wise),
  remarks: String,
  schoolId: ObjectId,
  timestamps: true
}
```

### 4.3 Attendance UX/UI Design

**Teacher View:**
1. Select Class → Select Date
2. Show all students in a list
3. Quick toggles: Present (✓) | Absent (✗) | Late (⏰)
4. Bulk actions: "Mark All Present" | "Mark All Absent"
5. Save once at the end

**Admin View:**
1. Filter by class, date range, teacher
2. View attendance reports
3. Export to CSV/PDF
4. See attendance trends

### 4.4 Attendance Features
- [ ] Daily attendance per class
- [ ] Subject-wise attendance (optional toggle)
- [ ] Bulk marking with one click
- [ ] Attendance history calendar view
- [ ] Late arrival tracking
- [ ] Excused absence with reason
- [ ] Attendance percentage calculation
- [ ] Low attendance alerts

---

## Phase 5: Communication Module (Priority: MEDIUM)

### 5.1 Key Requirement
**STRICT ISOLATION: Communication within same school only**

### 5.2 Communication Data Models

**Conversation Model:**
```javascript
{
  schoolId: ObjectId (REQUIRED - for isolation),
  type: "private" | "group",
  name: String (for groups),
  participants: [{
    user: ObjectId,
    userType: "admin" | "teacher" | "staff" | "student",
    role: "owner" | "admin" | "member",
    joinedAt: Date,
    canSendMessages: Boolean,
  }],
  createdBy: ObjectId,
  isActive: Boolean,
  settings: {
    allowStudents: Boolean,
    allowAttachments: Boolean,
    muteNotifications: Boolean,
  }
}
```

**Message Model:**
```javascript
{
  conversation: ObjectId,
  sender: ObjectId,
  senderType: "admin" | "teacher" | "staff" | "student",
  content: String,
  messageType: "text" | "image" | "file" | "announcement",
  attachments: [{
    url: String,
    type: String,
    name: String,
    size: Number,
  }],
  readBy: [{
    user: ObjectId,
    readAt: Date,
  }],
  schoolId: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date,
  timestamps: true
}
```

### 5.3 Predefined Groups
Created automatically when school is onboarded:
- "All Teachers" - All teachers in school
- "Admin & Staff" - Admin and staff only
- Custom groups created by admin

### 5.4 Communication UI Components
- **Inbox** - List of conversations
- **Chat View** - Message thread with input
- **Group Info** - Members, settings
- **Create Group** - Modal for new groups
- **Search** - Find messages/conversations

### 5.5 Role-Based Access Matrix

| Feature | Admin | Teacher | Staff | Student |
|---------|-------|---------|-------|---------|
| Create groups | ✓ | ✗ | ✗ | ✗ |
| Manage groups | ✓ | ✗ | ✗ | ✗ |
| Send messages | ✓ | ✓ | ✓ | If in group |
| Private message | ✓ | Permission | Permission | ✗ |
| Add students | ✓ | If allowed | ✗ | ✗ |
| Delete messages | Own only | Own only | Own only | ✗ |

---

## Phase 6: Role Management System (Priority: MEDIUM)

### 6.1 Role Data Model
```javascript
{
  name: String,
  description: String,
  type: "system" | "custom",
  permissions: {
    // Dashboard
    viewDashboard: Boolean,
    
    // Teachers
    viewTeachers: Boolean,
    addTeachers: Boolean,
    editTeachers: Boolean,
    deleteTeachers: Boolean,
    
    // Students
    viewStudents: Boolean,
    addStudents: Boolean,
    editStudents: Boolean,
    deleteStudents: Boolean,
    
    // Attendance
    viewAttendance: Boolean,
    takeAttendance: Boolean,
    editAttendance: Boolean,
    
    // Communication
    accessCommunication: Boolean,
    createGroups: Boolean,
    manageGroups: Boolean,
    
    // Assessments
    viewAssessments: Boolean,
    createAssessments: Boolean,
    gradeAssessments: Boolean,
    
    // Courses
    viewCourses: Boolean,
    createCourses: Boolean,
    manageCourses: Boolean,
    
    // Reports
    viewReports: Boolean,
    exportReports: Boolean,
    
    // Settings
    manageSchoolSettings: Boolean,
    manageRoles: Boolean,
  },
  schoolId: ObjectId,
  isActive: Boolean,
  createdBy: ObjectId,
}
```

### 6.2 Default Roles (Created on School Onboarding)

1. **Full Access Teacher**
   - All teacher permissions enabled
   - Can add/edit students
   - Full attendance access
   - Communication access

2. **Restricted Teacher**
   - View students only
   - Take attendance only
   - Limited communication

3. **Attendance Manager**
   - Full attendance access
   - View students
   - No editing permissions

4. **View Only**
   - View dashboard
   - View students/teachers
   - No editing capabilities

---

## Phase 7: Implementation Order

### Sprint 1 (This Session)
1. ✅ Fix sidebar structure and navigation
2. ✅ Complete Teacher module with forms
3. ✅ Complete Student module with class/section
4. ✅ Ensure multi-tenancy in all queries

### Sprint 2
1. Implement Attendance backend
2. Create Attendance UI with bulk actions
3. Add attendance reports

### Sprint 3
1. Create Communication models
2. Build Chat UI
3. Implement group management

### Sprint 4
1. Role management backend
2. Role management UI
3. Apply permissions across modules

---

## Files to Create/Modify

### Backend
- `/models/Academic/Attendance.model.js` (new)
- `/models/Communication/Conversation.model.js` (new)
- `/models/Communication/Message.model.js` (new)
- `/models/Staff/Role.model.js` (new)
- `/services/academic/attendance.service.js` (enhance)
- `/services/communication/chat.service.js` (new)
- `/services/staff/role.service.js` (new)
- `/routes/v1/communication/chat.router.js` (new)
- `/routes/v1/staff/role.router.js` (new)

### Frontend
- `/app/admin/layout.tsx` (update sidebar)
- `/app/admin/teachers/page.tsx` (enhance)
- `/app/admin/students/page.tsx` (enhance)
- `/app/admin/attendance/page.tsx` (new)
- `/app/admin/communication/page.tsx` (enhance)
- `/app/admin/roles/page.tsx` (new)
- `/components/attendance/AttendanceSheet.tsx` (new)
- `/components/communication/ChatInterface.tsx` (new)
