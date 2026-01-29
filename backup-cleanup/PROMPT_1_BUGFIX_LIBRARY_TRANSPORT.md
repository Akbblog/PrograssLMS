# 🚀 LMS Enhancement - PROMPT 1 of 3
## Bug Fixes + Library Management + Transport Management

---

## 📌 Project Context

You are enhancing an existing **School Management System (SaaS LMS)** built with:
- **Backend:** Node.js + Express.js + MongoDB + Mongoose
- **Frontend:** Next.js 16 + TypeScript + React 19 + Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Multi-tenancy:** Single database with `schoolId` isolation on all models
- **Auth:** JWT with role-based access (super_admin, admin, teacher, student, parent)

### Workspace Location
- Backend: `f:\webTest\LMS\backend`
- Frontend: `f:\webTest\LMS\frontend`

---

## ⚠️ PRIORITY 1: Fix Build Errors (DO THIS FIRST!)

Before adding any new features, resolve the Vercel build errors:

### Files to Audit:
1. `frontend/app/admin/finance/page.tsx` (Line ~376)
2. `frontend/app/admin/settings/page.tsx` (Lines ~519)

### Error Type:
`Parsing ecmascript source code failed` - syntax errors preventing build

### Action Required:
- Review both files for unclosed JSX tags, missing brackets, or malformed syntax
- Ensure all React components have proper opening/closing tags
- Validate the entire file compiles without errors
- Run `npm run build` in frontend directory to verify fix

---

## 📚 MODULE 1: Library Management System

### Purpose
Manage school library books, borrowing, returns, and inventory

### Backend Requirements

Create models in `backend/models/Library/`:

#### 1. Book.model.js
```javascript
// Required fields:
{
    schoolId: { type: ObjectId, ref: "School", required: true, index: true },
    title: { type: String, required: true },
    author: String,
    isbn: { type: String, unique: true, sparse: true },
    publisher: String,
    category: { type: ObjectId, ref: "BookCategory" },
    subcategory: String,
    quantity: { type: Number, default: 1 },
    availableQuantity: { type: Number, default: 1 },
    location: String, // shelf/rack number
    coverImage: String,
    description: String,
    publishedYear: Number,
    status: { type: String, enum: ["available", "damaged", "lost"], default: "available" },
    barcode: String,
    qrCode: String,
    purchaseDate: Date,
    purchasePrice: Number,
    tags: [String]
}
```

#### 2. BookCategory.model.js
```javascript
{
    schoolId: { type: ObjectId, ref: "School", required: true },
    name: { type: String, required: true },
    description: String,
    parentCategory: { type: ObjectId, ref: "BookCategory" },
    icon: String,
    color: String
}
```

#### 3. BookIssue.model.js
```javascript
{
    schoolId: { type: ObjectId, ref: "School", required: true },
    book: { type: ObjectId, ref: "Book", required: true },
    borrower: { type: ObjectId, refPath: "borrowerType", required: true },
    borrowerType: { type: String, enum: ["Student", "Teacher"], required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: Date,
    actualReturnDate: Date,
    status: { type: String, enum: ["issued", "returned", "overdue", "lost"], default: "issued" },
    fineAmount: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false },
    issuedBy: { type: ObjectId, ref: "Admin" },
    returnedTo: { type: ObjectId, ref: "Admin" },
    renewalCount: { type: Number, default: 0 },
    maxRenewals: { type: Number, default: 2 },
    notes: String
}
```

#### 4. LibrarySettings.model.js
```javascript
{
    schoolId: { type: ObjectId, ref: "School", required: true, unique: true },
    maxBooksPerStudent: { type: Number, default: 3 },
    maxBooksPerTeacher: { type: Number, default: 5 },
    borrowingPeriodDays: { type: Number, default: 14 },
    renewalPeriodDays: { type: Number, default: 7 },
    finePerDay: { type: Number, default: 5 },
    renewalAllowed: { type: Boolean, default: true },
    maxRenewals: { type: Number, default: 2 },
    sendOverdueReminders: { type: Boolean, default: true },
    reminderDaysBefore: { type: Number, default: 2 }
}
```

### Backend Controllers & Routes

Create in `backend/controllers/library/`:
- `book.controller.js` - CRUD for books
- `bookIssue.controller.js` - Issue, return, renew operations
- `librarySettings.controller.js` - Settings management
- `libraryReports.controller.js` - Reports and analytics

Create routes in `backend/routes/v1/library/`:
```
GET    /api/v1/library/books           - List all books
POST   /api/v1/library/books           - Add new book
GET    /api/v1/library/books/:id       - Get book details
PUT    /api/v1/library/books/:id       - Update book
DELETE /api/v1/library/books/:id       - Delete book
POST   /api/v1/library/issue           - Issue book
POST   /api/v1/library/return/:issueId - Return book
POST   /api/v1/library/renew/:issueId  - Renew book
GET    /api/v1/library/issues          - List all issues
GET    /api/v1/library/overdue         - List overdue books
GET    /api/v1/library/borrower/:id    - Borrower history
GET    /api/v1/library/settings        - Get settings
PUT    /api/v1/library/settings        - Update settings
GET    /api/v1/library/stats           - Dashboard stats
```

### Frontend Requirements

Create `frontend/app/admin/library/` with:

#### 1. page.tsx (Dashboard)
- Books available count
- Currently issued count
- Overdue books count (with alert styling)
- Recent issues/returns activity feed
- Quick action buttons (Issue, Return, Add Book)

#### 2. books/page.tsx (Book Catalog)
- Searchable, filterable book list
- Add/Edit book modal
- Category filtering
- Status filtering
- Bulk import from CSV

#### 3. issue/page.tsx (Issue/Return Interface)
- Student/Teacher search autocomplete
- Barcode/QR scanner integration placeholder
- Issue form with due date calculation
- Return interface with fine calculation
- Current borrowings display

#### 4. reports/page.tsx
- Most borrowed books
- Overdue report with borrower details
- Category-wise breakdown
- Monthly issue statistics

---

## 🚌 MODULE 2: Transport Management System

### Purpose
Manage school vehicles, routes, drivers, and student transport allocation

### Backend Requirements

Create models in `backend/models/Transport/`:

#### 1. Vehicle.model.js
```javascript
{
    schoolId: { type: ObjectId, ref: "School", required: true },
    vehicleNumber: { type: String, required: true },
    vehicleType: { type: String, enum: ["bus", "van", "car", "minibus"], required: true },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    driver: { type: ObjectId, ref: "Teacher" }, // Staff member assigned as driver
    conductor: { type: ObjectId, ref: "Teacher" },
    make: String,
    model: String,
    year: Number,
    color: String,
    insuranceNumber: String,
    insuranceExpiry: Date,
    fitnessExpiryDate: Date,
    registrationNumber: String,
    gpsTrackerId: String,
    fuelType: { type: String, enum: ["diesel", "petrol", "cng", "electric"] },
    status: { type: String, enum: ["active", "maintenance", "retired"], default: "active" },
    images: [String],
    notes: String
}
```

#### 2. Route.model.js
```javascript
{
    schoolId: { type: ObjectId, ref: "School", required: true },
    routeName: { type: String, required: true },
    routeCode: { type: String, required: true },
    vehicle: { type: ObjectId, ref: "Vehicle" },
    stops: [{
        stopName: { type: String, required: true },
        address: String,
        pickupTime: String, // "07:30"
        dropTime: String,   // "14:30"
        latitude: Number,
        longitude: Number,
        sequence: { type: Number, required: true }
    }],
    distanceKm: Number,
    estimatedDurationMinutes: Number,
    monthlyFee: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}
```

#### 3. TransportAllocation.model.js
```javascript
{
    schoolId: { type: ObjectId, ref: "School", required: true },
    student: { type: ObjectId, ref: "Student", required: true },
    route: { type: ObjectId, ref: "Route", required: true },
    stop: { type: String, required: true }, // Stop name from route
    vehicleAssigned: { type: ObjectId, ref: "Vehicle" },
    startDate: { type: Date, required: true },
    endDate: Date,
    monthlyFee: { type: Number, required: true },
    pickupType: { type: String, enum: ["pickup-only", "drop-only", "both"], default: "both" },
    status: { type: String, enum: ["active", "suspended", "terminated"], default: "active" },
    emergencyContact: String,
    specialInstructions: String
}
```

#### 4. DriverAttendance.model.js
```javascript
{
    schoolId: { type: ObjectId, ref: "School", required: true },
    driver: { type: ObjectId, ref: "Teacher", required: true },
    date: { type: Date, required: true },
    checkInTime: Date,
    checkOutTime: Date,
    vehicle: { type: ObjectId, ref: "Vehicle" },
    route: { type: ObjectId, ref: "Route" },
    totalTrips: { type: Number, default: 0 },
    status: { type: String, enum: ["present", "absent", "leave"], default: "present" },
    kmReading: {
        start: Number,
        end: Number
    },
    fuelFilled: Number,
    notes: String
}
```

### Backend Controllers & Routes

Create in `backend/controllers/transport/`:
- `vehicle.controller.js`
- `route.controller.js`
- `allocation.controller.js`
- `driverAttendance.controller.js`

Create routes in `backend/routes/v1/transport/`:
```
# Vehicles
GET    /api/v1/transport/vehicles        - List vehicles
POST   /api/v1/transport/vehicles        - Add vehicle
PUT    /api/v1/transport/vehicles/:id    - Update vehicle
DELETE /api/v1/transport/vehicles/:id    - Delete vehicle

# Routes
GET    /api/v1/transport/routes          - List routes
POST   /api/v1/transport/routes          - Create route
PUT    /api/v1/transport/routes/:id      - Update route
DELETE /api/v1/transport/routes/:id      - Delete route

# Allocations
GET    /api/v1/transport/allocations              - List allocations
POST   /api/v1/transport/allocations              - Allocate student
PUT    /api/v1/transport/allocations/:id          - Update allocation
DELETE /api/v1/transport/allocations/:id          - Remove allocation
GET    /api/v1/transport/allocations/student/:id  - Student allocation
GET    /api/v1/transport/allocations/route/:id    - Route allocations

# Driver Attendance
GET    /api/v1/transport/driver-attendance        - List attendance
POST   /api/v1/transport/driver-attendance        - Mark attendance
GET    /api/v1/transport/stats                    - Dashboard stats
```

### Frontend Requirements

Create `frontend/app/admin/transport/` with:

#### 1. page.tsx (Dashboard)
- Active vehicles count
- Active routes count
- Students using transport
- Today's driver attendance status
- Quick stats cards

#### 2. vehicles/page.tsx
- Vehicle fleet list with status badges
- Add/Edit vehicle modal
- Insurance/fitness expiry alerts
- Vehicle details view

#### 3. routes/page.tsx
- Route list with stop counts
- Add/Edit route with stop management
- Drag-and-drop stop reordering
- Route map visualization (optional)

#### 4. allocations/page.tsx
- Student-route allocation interface
- Bulk allocation from class
- Current allocations list
- Filter by route/class
- Fee integration display

---

## 📐 Implementation Guidelines for This Prompt

### File Structure to Create
```
backend/
├── models/
│   ├── Library/
│   │   ├── Book.model.js
│   │   ├── BookCategory.model.js
│   │   ├── BookIssue.model.js
│   │   └── LibrarySettings.model.js
│   └── Transport/
│       ├── Vehicle.model.js
│       ├── Route.model.js
│       ├── TransportAllocation.model.js
│       └── DriverAttendance.model.js
├── controllers/
│   ├── library/
│   └── transport/
└── routes/v1/
    ├── library/
    └── transport/

frontend/app/admin/
├── library/
│   ├── page.tsx
│   ├── books/page.tsx
│   ├── issue/page.tsx
│   └── reports/page.tsx
└── transport/
    ├── page.tsx
    ├── vehicles/page.tsx
    ├── routes/page.tsx
    └── allocations/page.tsx
```

### Standards to Follow
1. All models must include `schoolId` for multi-tenancy
2. Use existing shadcn/ui components and AdminPageLayout
3. Follow existing API patterns in `/api/v1/`
4. Include proper authentication middleware
5. Add TypeScript types for frontend components

---

## ✅ Verification for Prompt 1

After completing this prompt:
1. Run `npm run build` in frontend - should complete without errors
2. Library module: Can add books, issue to students, track returns
3. Transport module: Can manage vehicles, routes, allocate students
4. All new API endpoints return proper responses
5. Test with multiple schools to verify multi-tenancy

---

**PROCEED TO PROMPT 2 AFTER COMPLETING ALL TASKS IN PROMPT 1**
