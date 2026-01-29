# 🚀 LMS Enhancement - PROMPT 3 of 3
## Document Generation + School Config + Data Migration

---

## 📌 Prerequisites
Complete PROMPT 1 and PROMPT 2 first

---

## 📄 MODULE 5: Document Generation System

### Purpose
Generate printable PDF documents for school operations

### Recommended Library
Use `@react-pdf/renderer` for React-native PDF generation

### Backend Models (`backend/models/Documents/`)

**DocumentTemplate.model.js**
- schoolId, templateType, templateName
- headerConfig: { logo, schoolName, address, contact }
- footerConfig: { text, showPageNumber }
- watermark, primaryColor, fontFamily
- isDefault, status

### Backend Service (`backend/services/documentGenerator/`)

Create generators for each document type:

**1. Fee Documents**
- `compactFeeVoucher.js` - Single page, essential info
- `detailedFeeVoucher.js` - Full breakdown
- `parentwiseVoucher.js` - Consolidated for multiple children

**2. Academic Documents**
- `marksheet.js` - Grade report with subject marks
- `admitCard.js` - Exam admission card with photo
- `examSummary.js` - All exams and results overview
- `examDatesheet.js` - Examination schedule
- `rollNumberSlip.js` - Assigned roll numbers
- `performanceCertificate.js` - Achievement summary
- `leavingCertificate.js` - Transfer certificate
- `characterCertificate.js` - Conduct certification

**3. Staff Documents**
- `salarySlip.js` - Monthly salary breakdown

**4. ID Cards & Certificates**
- `studentIdCard.js` - Photo ID
- `staffIdCard.js` - Staff photo ID
- `studentBirthdayCard.js` - Birthday greeting
- `staffBirthdayCard.js` - Staff birthday greeting

### Backend Routes (`/api/v1/documents/`)
```
GET    /templates           - List templates
POST   /templates           - Create template
PUT    /templates/:id       - Update template

POST   /generate/fee-voucher/:studentId
POST   /generate/fee-voucher-bulk
POST   /generate/marksheet/:studentId
POST   /generate/admit-card/:studentId
POST   /generate/exam-datesheet/:examId
POST   /generate/id-card/:studentId
POST   /generate/salary-slip/:staffId/:month/:year
POST   /generate/leaving-certificate/:studentId
POST   /generate/character-certificate/:studentId

GET    /download/:documentId
```

### Frontend (`frontend/app/admin/documents/`)

**1. page.tsx** - Document center dashboard

**2. templates/page.tsx** - Manage document templates

**3. generate/page.tsx** - Document generation interface
- Select document type
- Select student/staff/class
- Preview before download
- Bulk generation options

### Frontend Components (`frontend/components/documents/`)

Create PDF templates using @react-pdf/renderer:
- `FeeVoucherTemplate.tsx`
- `MarksheetTemplate.tsx`
- `IdCardTemplate.tsx`
- `CertificateTemplate.tsx`
- etc.

---

## ⚙️ MODULE 6: School System Configuration

### Enhance Settings Page (`frontend/app/admin/settings/`)

**1. General Settings Tab**
- School profile (name, logo, contact)
- Academic calendar configuration
- Working days/holidays

**2. Module Configuration Tab**
- Enable/disable modules per school
- Feature flags for premium features
- Custom field definitions

**3. Branding Tab**
- Primary/secondary colors
- Document watermarks
- Email template customization

**4. Integration Tab**
- SMS gateway configuration
- Payment gateway settings
- Third-party integrations

### Backend: Enhance School Model

Add to `backend/models/School.model.js`:
```javascript
moduleConfig: {
    library: { enabled: Boolean },
    transport: { enabled: Boolean },
    hr: { enabled: Boolean },
    qrAttendance: { enabled: Boolean }
},
branding: {
    primaryColor: String,
    secondaryColor: String,
    documentWatermark: String,
    emailHeader: String,
    emailFooter: String
},
integrations: {
    smsGateway: { provider, apiKey, senderId },
    paymentGateway: { provider, merchantId, apiKey },
    emailService: { provider, apiKey }
}
```

---

## 🔄 MODULE 7: Rapid Data Migration (2-Day Setup)

### Purpose
Transfer school data from any software in 2 days

### Day 1 Goals
- Import all students, staff, classes
- Set up fee structures
- Configure basic settings

### Day 2 Goals
- System fully operational
- Print fee vouchers
- Take attendance
- All modules working

### Backend Service (`backend/services/dataMigration/`)

**1. DataImporter.service.js**
- Excel/CSV parsing with `xlsx` package
- Field mapping and transformation
- Bulk insert with validation
- Rollback on errors
- Progress tracking

**2. MigrationTemplate.model.js**
```javascript
{
    schoolId: ObjectId,
    name: String,
    entityType: enum ["students", "staff", "fees", "attendance"],
    fieldMappings: [{
        sourceField: String,
        targetField: String,
        transformation: String,
        defaultValue: any
    }],
    validationRules: Object,
    isDefault: Boolean
}
```

**3. MigrationLog.model.js**
```javascript
{
    schoolId: ObjectId,
    migrationId: String,
    entityType: String,
    fileName: String,
    totalRecords: Number,
    successCount: Number,
    errorCount: Number,
    errors: [{ row, field, message }],
    status: enum ["pending", "processing", "completed", "failed"],
    startedAt: Date,
    completedAt: Date,
    performedBy: ObjectId
}
```

### Backend Routes (`/api/v1/migration/`)
```
POST   /upload              - Upload file for preview
POST   /validate            - Validate data
POST   /execute             - Execute migration
GET    /status/:migrationId - Check status
GET    /logs                - Migration history
POST   /rollback/:id        - Rollback migration

GET    /templates           - List mapping templates
POST   /templates           - Save mapping template
```

### Frontend (`frontend/app/admin/settings/migration/`)

**page.tsx** - Migration Wizard with steps:
1. Upload Excel/CSV file
2. Select entity type (Students, Staff, etc.)
3. Map source fields to target fields
4. Preview and validate data
5. Execute migration
6. View results and fix errors

### Import Templates

Create sample Excel templates for:
- Students (name, class, roll, parent info)
- Staff (name, designation, salary)
- Fee structures
- Existing fee payments
- Previous attendance

---

## 📦 Dependencies
```bash
# Backend
npm install xlsx @react-pdf/renderer puppeteer

# Frontend
npm install @react-pdf/renderer xlsx
```

---

## ✅ Final Verification

After completing all 3 prompts:

1. **Build Success**: `npm run build` passes
2. **Library**: Books can be issued/returned
3. **Transport**: Routes and allocations work
4. **Attendance**: QR scanning with real-time updates
5. **HR**: Leave and payroll functional
6. **Documents**: All 17 document types generate
7. **Migration**: Excel import works
8. **2-Day Setup**: New school operational in 2 days

---

## 📁 Complete File Structure

```
backend/
├── models/
│   ├── Library/
│   ├── Transport/
│   ├── HR/
│   ├── Documents/
│   └── Migration/
├── services/
│   ├── documentGenerator/
│   ├── dataMigration/
│   └── realtime/
└── routes/v1/
    ├── library/
    ├── transport/
    ├── hr/
    ├── documents/
    └── migration/

frontend/app/admin/
├── library/
├── transport/
├── hr/
├── attendance/scanner/
├── documents/
└── settings/migration/
```

---

**🎉 ALL PROMPTS COMPLETE - SYSTEM READY FOR FULL DEPLOYMENT**
