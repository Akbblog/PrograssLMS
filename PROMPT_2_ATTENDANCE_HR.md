# 🚀 LMS Enhancement - PROMPT 2 of 3
## QR Code Attendance System + HR Module

---

## 📌 Prerequisites
Complete PROMPT 1 first (Bug fixes, Library, Transport modules)

---

## 📱 MODULE 3: QR Code Attendance System

### Purpose
Real-time student attendance via QR code scanning with instant database sync

### Backend: Enhance Attendance Model
Modify `backend/models/Academic/Attendance.model.js` - add fields:
- `scanMethod`: enum ["manual", "qr-scan", "biometric", "rfid"]
- `deviceId`, `deviceName`: String
- `geoLocation`: { latitude, longitude, accuracy }
- `verifiedBy`: enum ["automated", "manual"]
- `qrScanTimestamp`: Date
- `parentNotified`: Boolean, `parentNotifiedAt`: Date

### Backend: New Models

**1. AttendanceDevice.model.js** (`backend/models/Academic/`)
- schoolId, deviceId, deviceName, location, deviceType
- assignedTo (Teacher ref), status, lastSync, lastHeartbeat

**2. StudentQRCode.model.js** (`backend/models/Students/`)
- schoolId, student (ref), qrCodeData (encrypted), qrCodeImage
- version, validFrom, validUntil, isActive, lastScannedAt

### Backend: Services

**1. WebSocket Service** (`backend/services/realtime/attendanceSocket.service.js`)
- Socket.IO for real-time updates
- Events: attendance:marked, attendance:stats:update, device:connected

**2. QR Generator** (`backend/services/qrcode/qrGenerator.service.js`)
- Generate encrypted QR codes per student
- Bulk generation, PNG/PDF export

### Backend: Routes (`/api/v1/attendance/`)
```
POST /qr/scan              - Process QR scan
POST /qr/generate/:studentId - Generate QR
POST /qr/generate-bulk     - Bulk generate
GET  /qr/download/:id      - Download QR
GET  /devices              - List devices
POST /devices              - Register device
GET  /live-stats           - Live stats
GET  /recent-scans         - Recent 50 scans
```

### Frontend Pages

**1. Scanner** (`frontend/app/admin/attendance/scanner/page.tsx`)
- Full-screen QR scanner (use html5-qrcode)
- Audio/visual confirmation, offline queue

**2. Live Dashboard** (`frontend/app/admin/attendance/live/page.tsx`)
- Real-time counters via WebSocket
- Class-wise breakdown, device status

**3. QR Management** (`frontend/app/admin/attendance/qr-codes/page.tsx`)
- Generate single/bulk QR codes
- Download, print, regenerate

---

## 👥 MODULE 4: HR Module

### Backend Models (`backend/models/HR/`)

**1. StaffProfile.model.js**
- schoolId, user (Teacher/Admin ref), employeeId
- designation, department, joiningDate, employmentType
- salary: { basic, hra, conveyance, deductions, netSalary }
- bankDetails: { accountNumber, bankName, ifscCode }
- emergencyContact, documents[], status

**2. LeaveType.model.js**
- schoolId, name, code, allowedDays
- carryForward, encashable, applicableTo, isPaid

**3. LeaveApplication.model.js**
- schoolId, staff, leaveType, fromDate, toDate
- totalDays, reason, status, approvedBy, remarks

**4. LeaveBalance.model.js**
- schoolId, staff, academicYear
- balances: [{ leaveType, entitled, taken, balance }]

**5. Payroll.model.js**
- schoolId, staff, month, year
- earnings: { basic, hra, bonus, totalEarnings }
- deductions: { pf, tax, totalDeductions }
- attendance: { presentDays, leaveDays }
- grossSalary, netSalary, paymentDate, status

**6. Appraisal.model.js**
- schoolId, staff, academicYear, reviewer
- ratings: { jobKnowledge, workQuality, etc. }
- overallScore, recommendations, status

### Backend Routes (`/api/v1/hr/`)
```
# Staff
GET/POST   /staff           - List/Create
GET/PUT    /staff/:id       - Get/Update

# Leaves
GET/POST   /leaves          - List/Apply
PUT        /leaves/:id/approve
PUT        /leaves/:id/reject
GET        /leaves/balance/:staffId

# Payroll
GET        /payroll         - List
POST       /payroll/generate - Generate monthly
POST       /payroll/:id/process - Process payment

# Appraisals
GET/POST   /appraisals      - List/Create
PUT        /appraisals/:id  - Update
```

### Frontend Pages (`frontend/app/admin/hr/`)

**1. page.tsx** - Dashboard with staff count, pending leaves, payroll status

**2. staff/page.tsx** - Staff directory with search/filter, profile modal

**3. leaves/page.tsx** - Apply, approve, balance tracking, calendar view

**4. payroll/page.tsx** - Generate, process, salary slip preview

**5. appraisals/page.tsx** - Create, review, performance trends

---

## 📦 Dependencies
```bash
# Backend
npm install socket.io qrcode

# Frontend
npm install socket.io-client html5-qrcode
```

---

## ✅ Verification
1. QR scanner opens camera and records attendance
2. Dashboard updates in real-time
3. HR staff profiles CRUD works
4. Leave applications can be submitted/approved
5. Payroll generates correctly
6. All endpoints respect multi-tenancy

**PROCEED TO PROMPT 3 AFTER COMPLETION**
