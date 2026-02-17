# Deep Product Audit & Roadmap to Automation

**Audit Date**: February 18, 2026
**Auditor Role**: Principal Product Manager & Systems Architect (EdTech K-12/HE)
**Codebase**: School Management System (SIS + Finance ERP + LMS)

---

## EXECUTION PROGRESS UPDATE (Post-Audit Implementation)

### Completed Since Audit
- **Enrollment -> Fee Generation automation is now active (Prisma path)**:
  - Enrollment creation now triggers transactional invoice generation with idempotency keys.
- **Double-entry finance core added**:
  - `Invoice`, `InvoiceLine`, `InvoicePayerAllocation`, `FinancialAccount`, `JournalEntry`, `JournalLine`, `StudentFinancialClearance`, `PayrollRun`, `FinancialEvent`.
- **Financial Gatekeeper added to LMS student access paths**:
  - Students with finance hold are now blocked from course/grade-sensitive endpoints.
- **Payroll automation upgraded (Prisma path)**:
  - Dynamic payroll run generation + process + settle with ledger postings.
- **LMS Course Prisma support implemented**:
  - Replaced `501` stubs with working Prisma services for courses, modules, lessons, and lesson completion tracking.
- **DB rollout scripts added and executed**:
  - Manual SQL migration file introduced and executed.
  - Backfill script added for enrollment invoices and clearance recalculation.

### Current Verified Runtime State (Database)
- Manual migration: **Executed successfully**.
- Backfill dry-run: **75 active enrollments detected**.
- Post-fix validation: **75/75 active enrollments now have enrollment invoices**.
- Data integrity check:
  - `active enrollments = 75`
  - `enrollment invoices = 75`
  - `unique enrollment invoice refs = 75`
  - `enrollment invoice events = 75`

### Stabilization Fix Applied
- Resolved transaction-closure failures (`Transaction already closed`) by increasing Prisma interactive transaction `maxWait/timeout`.
- Resolved idempotency collision (`FinancialEvent ... unique constraint`) by converting event write from `create` to `upsert`.

---

## PHASE 1: STATUS AUDIT (The "As-Is" State)

### 1.1 Feature Maturity Matrix

| Module | Maturity Level | Models | Routes | Frontend Pages | Notes |
|--------|---------------|--------|--------|----------------|-------|
| **Authentication & RBAC** | Production Ready | Admin, Teacher, Student, Role | admin.router, publicAuth | Login, role-based dashboards | 4 roles (super_admin, admin, teacher, student), JWT, Zustand store |
| **Academic Year/Term** | Production Ready | AcademicYear, AcademicTerm | academicYear, academicTerm | Admin CRUD pages | Dual-driver (Mongoose + Prisma) |
| **Class/Program/Subject** | Production Ready | ClassLevel, Program, Subject, Course | class, program, subject, course | Admin CRUD pages | Well-indexed, multi-tenant |
| **Student Management** | Production Ready | Student (162 lines) | students.router | Admin CRUD, profile, avatar | Text search, enrollment statuses |
| **Teacher Management** | Production Ready | Teacher | teachers.router | Admin CRUD, profile | Similar pattern to students |
| **Attendance (Student)** | Production Ready | Attendance (185 lines, rich schema) | attendance.router | Admin pages, QR scanner | 6 statuses, geo, device, behavior link, trend analysis |
| **Teacher Attendance** | Production Ready | TeacherAttendance | teacherAttendance.router | Admin pages | Separate from student attendance |
| **Grading System** | Production Ready | Grade (189 lines) | grade.router | Admin/Teacher pages | Weighted scores, GradingPolicy integration, class stats |
| **Exams & Results** | Production Ready | Exam, ExamResult, Question, QuestionBank | exams, results, question routers | Admin/Teacher pages | MCQ/true-false/short/matching, multimedia support |
| **Assignments** | Functional | Assignment (with embedded submissions) | assignment.router | Admin/Teacher pages | Submissions embedded in document (not scalable) |
| **Enrollment** | Functional | Enrollment | enrollment.router | Admin pages | Unique index prevents duplicates |
| **Performance Analytics** | Functional | (computed) | performance.router | Admin pages | GPA calc, trend analysis, recommendations |
| **Finance - Fee Structure** | Functional | FeeStructure (125 lines, rich) | fee.router, finance.router | Admin pages | Installments, sibling discount, financial aid, early payment |
| **Finance - Payments** | Skeleton | FeePayment (72 lines) | fee.router | Admin pages | Basic CRUD, no payment gateway integration, no auto-overdue |
| **Finance - Reporting** | Skeleton | (computed in FinanceService) | finance.router | Admin reports | Report generation exists but `sendPaymentReminders()` is stub |
| **HR - Payroll** | Skeleton | Payroll (19 lines) | hr.router | Admin pages | Manual entry only, no attendance sync, no tax calc |
| **HR - Leave** | Skeleton | LeaveApplication, LeaveBalance, LeaveType | hr.router | Admin pages | Basic approval workflow, no balance deduction logic |
| **HR - Appraisal** | Skeleton | Appraisal (16 lines) | hr.router | Admin pages | Minimal schema, no workflow |
| **HR - Staff Profile** | Skeleton | StaffProfile | hr.router | Admin pages | Exists but not linked to payroll |
| **Communication - Chat** | Functional | Conversation, Message | chat.router | Chat pages | Socket.io, read receipts, reactions, attachments |
| **Communication - Notifications** | Functional | Notification, NotificationRecipient | notifications.router | Notification bell | Role-targeted, delivery tracking |
| **Library** | Functional | Book, BookIssue, BookCategory, LibrarySettings | library.router | Admin pages | Issue/return, fines, renewals, text search |
| **Transport** | Functional | Route, Vehicle, TransportAllocation, DriverAttendance | transport.router | Admin pages | Stops with GPS, monthly fees, driver tracking |
| **Card System** | Functional | CardTemplate, CardCustomization, StudentQRCode | cards.router, cardTemplates.router | Card designer, templates | AES-256-GCM QR, PDF generation, avatar helper |
| **Documents** | Skeleton | DocumentTemplate | documents.router | Admin pages | Fee voucher template exists, generic template system |
| **Reports Dashboard** | Functional | (aggregated) | reports.router | Admin dashboard | Dashboard overview, attendance, academic, finance, HR, transport, library |
| **School Multi-tenancy** | Production Ready | School (294 lines) | superadmin/school.router | Superadmin pages | Subscription tiers, feature flags, storage limits, usage tracking |
| **Search** | Functional | (cross-model) | search.router | Global search component | Text indexes on Student, Teacher, Book, Route |
| **Data Migration** | Skeleton | MigrationTemplate, MigrationLog | migration.router | - | DataImporter service exists |
| **Behavior Incidents** | Skeleton | BehaviorIncident, AttendanceDevice | attendanceBehavior.router | - | Linked to attendance but minimal logic |

### 1.2 Silo Identification: Where Data Gets Stuck

#### SILO 1: Grades --> Finance (BROKEN)
- **Gap**: Failing grades do NOT trigger academic probation alerts
- **Gap**: Scholarship eligibility (`financialAidOptions.minAcademicPerformance`) exists in FeeStructure schema but is NEVER computed against actual Grade records
- **Impact**: Financial aid/scholarship auto-renewal requires manual verification

#### SILO 2: Attendance --> Finance (BROKEN)
- **Gap**: No attendance-based fee penalty system (e.g., chronic absence -> fee forfeiture)
- **Gap**: Transport route `monthlyFee` is stored but never flows into FeePayment
- **Impact**: Transport fees must be manually invoiced separate from tuition

#### SILO 3: Attendance --> Notifications (PARTIAL)
- **Gap**: Attendance model has `alertsGenerated` array and `parentNotified` boolean, but no service actually populates them
- **Gap**: `parentAcknowledged` field exists on both Attendance and Grade models but no acknowledgment workflow exists
- **Impact**: Parents are never automatically notified of absences or grades

#### SILO 4: HR Attendance --> Payroll (BROKEN)
- **Gap**: Payroll model has `attendance: { presentDays, leaveDays }` but `generatePayroll` controller accepts these as manual input (line 22-23 of payroll.controller.js)
- **Gap**: TeacherAttendance records are never aggregated into Payroll
- **Gap**: LeaveApplication approvals don't update LeaveBalance
- **Impact**: Payroll is 100% manual, leave has no enforcement

#### SILO 5: Library Fines --> Finance (BROKEN)
- **Gap**: BookIssue has `fineAmount` and `finePaid` but this is isolated from FeePayment
- **Impact**: Library fines can't be consolidated into a student's fee statement

#### SILO 6: Assignment Submissions --> Grades (BROKEN)
- **Gap**: Assignment submissions have a `grade` field but graded assignments don't create Grade records
- **Impact**: Assignment scores are invisible to performance analytics, GPA, and report cards

#### SILO 7: Enrollment --> Fee Generation (BROKEN)
- **Gap**: When a student enrolls in a subject/class, no FeePayment record is auto-generated
- **Gap**: `FinanceService.generateStudentFeeStructure()` exists but is never called automatically
- **Impact**: Fee invoicing is entirely manual

### 1.3 The 2026 Standard Check

| Criterion | Status | Details |
|-----------|--------|---------|
| **Cloud-Native** | PARTIAL | Vercel deployment support (`serverless-http`), but no container orchestration, no health-check readiness probes beyond basic `/health` |
| **Mobile-First** | WEAK | No PWA manifest, no service worker, no responsive design tokens in Tailwind config, no native mobile app or React Native wrapper |
| **AI-Driven Insights** | MISSING | `PerformanceService` has rule-based recommendations (if < 70% suggest tutoring) but no ML/predictive models, no anomaly detection, no NLP for behavioral notes |
| **Real-time Collaboration** | PARTIAL | Socket.io for chat exists but not used for live attendance dashboards, grade entry, or collaborative editing |
| **Accessibility (WCAG 2.2)** | UNKNOWN | No aria- attributes audit, no a11y testing, no keyboard navigation testing |
| **Data Privacy (GDPR/FERPA)** | WEAK | No data export endpoint, no right-to-deletion, no audit trail for data access, no consent management |
| **API Versioning** | YES | All routes under `/api/v1/` |
| **Multi-Currency** | MISSING | School model has `paymentSettings.currency` (default USD) but FeePayment has no currency field, no exchange rate handling |
| **i18n / l10n** | MISSING | No internationalization framework, all strings hardcoded in English |
| **Offline Support** | MISSING | No service worker, no IndexedDB caching, no offline-first architecture |
| **SSO / OAuth** | MISSING | JWT-only auth, no SAML/OAuth2/OpenID Connect for district-level SSO |
| **Webhooks / Event Bus** | MISSING | No event-driven architecture, no webhook endpoints for third-party integrations |
| **Rate Limiting** | YES | `express-rate-limit` middleware exists |
| **Input Validation** | PARTIAL | `validateRequest` middleware exists but not applied consistently; Zod on frontend only |
| **Test Coverage** | 0% | `"test": "echo \"Error: no test specified\" && exit 1"` in package.json |

---

## PHASE 2: THE "INCOMPLETE FEATURE" RESCUE PLAN

### 2.1 Finance Module

#### Missing Logic
1. **Auto-Overdue Detection**: No cron/scheduled job to mark `FeePayment` records as "overdue" when `dueDate` passes
   ```
   NEEDED: A daily scheduler that runs:
   FeePayment.updateMany(
     { status: { $in: ['pending', 'partial'] }, dueDate: { $lt: new Date() } },
     { $set: { status: 'overdue' } }
   )
   ```

2. **Late Fee Calculation**: `FeeStructure.paymentPlans[].lateFeePolicy` is defined in schema but never applied
   ```
   NEEDED: Post-overdue hook that creates a new FeePayment line item for the late fee amount
   ```

3. **Payment Gateway Integration**: `School.integrations.paymentGateway` schema exists but zero implementation
   ```
   NEEDED: Stripe/Razorpay/Flutterwave adapter with webhook handler for payment confirmation
   ```

4. **Receipt/Invoice Generation**: `FeeVoucherTemplate.js` exists but no controller calls it for payment receipts
   ```
   NEEDED: Auto-generate PDF receipt on successful payment, email to guardian
   ```

5. **Financial Aid Auto-Eligibility**: `financialAidOptions.eligibilityCriteria.minAcademicPerformance` exists but is never checked
   ```
   NEEDED: Service that runs at term-end to check student GPA against scholarship criteria
   ```

#### Edge Cases
- **Mid-term transfer**: Student transfers between classes mid-term -> Fee structure changes but no proration logic exists. Need: `calculateProratedFees(oldClass, newClass, transferDate)`
- **Sibling discount race condition**: `getSiblingCount()` uses `guardian.email` match which breaks for guardians with multiple emails
- **Refund flow**: No refund model or workflow for overpayment/withdrawal
- **Multi-currency**: Schools in different countries can't operate in local currency. Need currency field on FeePayment + exchange rate service
- **Academic year rollover**: No logic to archive old fee structures or carry forward balances

### 2.2 HR / Payroll Module

#### Missing Logic
1. **Attendance-to-Payroll Sync**:
   ```
   NEEDED: Service that aggregates TeacherAttendance records for a month and populates
   Payroll.attendance.presentDays / leaveDays automatically
   ```

2. **Leave Balance Deduction**:
   ```
   NEEDED: Post-approval hook on LeaveApplication that decrements LeaveBalance.remaining
   Currently: LeaveApplication can be approved but LeaveBalance is never updated
   ```

3. **Salary Slab Configuration**: No model for salary structure per role/grade
   ```
   NEEDED: SalaryStructure model { role, grade, basic, hra, allowances, deductions }
   ```

4. **Tax Calculation Engine**: Payroll only has flat `deductions.tax` with no computation
   ```
   NEEDED: Tax bracket configuration per country/state, TDS calculation
   ```

5. **Payslip PDF Generation**: No payslip template exists (only FeeVoucher exists)
   ```
   NEEDED: PayslipTemplate.js using @react-pdf/renderer
   ```

#### Edge Cases
- **Teacher substitution**: No model for substitution tracking. If Teacher A covers Teacher B's class, the hours aren't attributed correctly for payroll
- **Overtime/extra classes**: No mechanism to track additional teaching hours beyond scheduled
- **Contractual vs permanent staff**: Payroll treats all staff identically; need employment type field
- **Mid-month joining/exit**: No proration logic for partial-month salary

### 2.3 Attendance Module

#### Missing Logic
1. **Consecutive Absence Alert Trigger**: `analyzeTrends()` computes `consecutiveAbsences` but never triggers notifications
   ```
   NEEDED: Post-save middleware on Attendance that checks consecutive absent count and:
   - At 3 consecutive: notify parent via SMS/email
   - At 5 consecutive: escalate to admin
   - At 10 consecutive: flag for potential dropout
   ```

2. **QR Scan Deduplication**: No protection against scanning the same QR code twice in one day
   ```
   NEEDED: Unique index on { student, date, scanMethod: 'qr-scan' } or nonce tracking
   ```

3. **Geofencing Validation**: `geoLocation` is stored but never validated against school coordinates
   ```
   NEEDED: Compare scan location against School.address coordinates with configurable radius
   ```

#### Edge Cases
- **Multiple periods per day**: Current schema is 1 attendance record per student per day per subject, but doesn't handle schools with period-based attendance
- **Half-day attendance**: `early-departure` status exists but no half-day logic for fee/payroll impact
- **Timezone handling**: All dates are UTC with no school-timezone normalization
- **Attendance correction workflow**: Teachers can overwrite attendance but no audit trail of changes

### 2.4 Assignment / LMS Module

#### Missing Logic
1. **Grade Sync**: When a submission is graded (status: 'graded'), no Grade record is created
   ```
   NEEDED: Post-grade hook on Assignment.submissions that creates a Grade record:
   { student, subject, assessmentType: 'homework', score: submission.grade, maxScore: assignment.totalPoints }
   ```

2. **Late Submission Penalty**: Assignment has no `latePenaltyPerDay` field
   ```
   NEEDED: Auto-calculate penalty based on (submittedAt - dueDate) * penaltyRate
   ```

3. **Plagiarism Check**: No content comparison between submissions
4. **Rubric Support**: No rubric model for structured grading criteria

#### Edge Cases
- **Submissions embedded in Assignment document**: This is a scalability problem. A class of 100 students each submitting 1MB files creates 100MB+ documents. Need: separate `Submission` collection with reference to Assignment
- **Re-submission after grading**: No version tracking on submissions
- **Group assignments**: No support for team submissions

### 2.5 Communication Module

#### Missing Logic
1. **Automated Notifications**: Infrastructure exists (Notification + NotificationRecipient) but no triggers are wired:
   - No notification on grade entry
   - No notification on attendance absence
   - No notification on fee due/overdue
   - No notification on assignment posted

2. **Email/SMS Delivery**: `School.integrations.smsGateway` and `emailService` schemas exist but no Nodemailer/Twilio integration code beyond the package dependency

3. **Announcement Broadcast**: Message model supports `messageType: 'announcement'` but no broadcast-to-all-parents endpoint

### 2.6 Library Module

#### Missing Logic
1. **Auto-Overdue Detection**: No scheduler to mark BookIssues as 'overdue' when `dueDate` passes
2. **Fine Calculation**: `fineAmount` exists but no per-day fine rate configuration
3. **Reservation System**: No book reservation/hold model
4. **Fine-to-Fee Integration**: Library fines are isolated from fee statements

#### Edge Cases
- **Inter-library loan**: No support for multi-campus book transfers
- **Digital resources**: No e-book/digital asset model
- **Barcode/RFID scanning**: No integration beyond QR

### 2.7 Transport Module

#### Missing Logic
1. **Fee-to-Finance Integration**: Route has `monthlyFee` but it never generates FeePayment records
2. **Route Optimization**: No algorithm for optimizing stop sequences
3. **Live Tracking**: No GPS integration for real-time vehicle location
4. **Parent Notification**: No ETA notification for pickup/dropoff

#### Edge Cases
- **Mid-term route change**: No proration for transport fee changes
- **Seasonal routes**: No support for different routes in different terms
- **Capacity management**: No seat-count enforcement on vehicle allocation

---

## PHASE 3: THE AUTOMATION & INTELLIGENCE ROADMAP

### 3.1 The Academic-Finance Loop

**Current State**: Zero integration
**Target State**: Fully automated billing pipeline

#### Implementation Plan

```
TRIGGER CHAIN:
  Enrollment Created
    -> generateStudentFeeStructure() [EXISTS but never called]
    -> Create FeePayment records per installment
    -> Send fee notification to guardian

  Transport Allocation Created
    -> Generate transport fee line item
    -> Add to student's fee statement

  Term End
    -> Evaluate scholarship eligibility against GPA
    -> Auto-apply financial aid for next term
    -> Generate consolidated fee statement

  Assignment Graded
    -> Create Grade record
    -> Recompute student GPA
    -> Check probation threshold
    -> If GPA < threshold: generate probation notification

  Library Fine Created
    -> Create FeePayment line item (category: 'library')
    -> Block card generation if unpaid fines > threshold
```

**New Services Needed**:
1. `EventBus` - Central event dispatcher (Node.js EventEmitter or Redis Pub/Sub)
2. `BillingAutomationService` - Listens for enrollment/allocation events, generates fees
3. `ScholarshipEvaluationService` - Term-end GPA-to-aid matcher
4. `ConsolidatedStatementService` - Aggregates all fee types (tuition + transport + library + misc) into single statement

### 3.2 Predictive "At-Risk" Student Detection

**Current State**: Basic recommendations in `PerformanceService` (rule-based: if < 70% suggest tutoring)
**Target State**: Multi-signal early warning system

#### Risk Score Algorithm

```javascript
class AtRiskDetectionService {
  // Weighted risk score (0-100, higher = more at risk)
  async calculateRiskScore(studentId, termId) {
    const weights = {
      academicPerformance: 0.35,
      attendancePattern: 0.25,
      assignmentCompletion: 0.20,
      behavioralSignals: 0.10,
      engagementDecline: 0.10,
    };

    // 1. Academic Performance Score (0-100, inverted: lower GPA = higher risk)
    const grades = await Grade.find({ student: studentId, academicTerm: termId });
    const avgPercentage = grades.reduce((s, g) => s + g.percentage, 0) / (grades.length || 1);
    const academicRisk = Math.max(0, 100 - avgPercentage);

    // 2. Attendance Pattern (consecutive absences weighted heavily)
    const stats = await Attendance.calculateStudentStats(studentId, yearId, termId);
    const attendanceRisk = Math.max(0, 100 - stats.attendanceRate);
    // Bonus risk for consecutive absences
    const consecutiveBonus = Math.min(30, stats.trends.consecutiveAbsences * 10);

    // 3. Assignment Completion Rate
    const assignments = await Assignment.find({ classLevel: studentClassId, academicTerm: termId });
    let submitted = 0, total = 0;
    assignments.forEach(a => {
      total++;
      if (a.submissions.find(s => s.student.equals(studentId) && s.status !== 'pending')) submitted++;
    });
    const completionRate = total > 0 ? (submitted / total) * 100 : 100;
    const assignmentRisk = Math.max(0, 100 - completionRate);

    // 4. Behavioral Signals (incidents count)
    const incidents = await BehaviorIncident.countDocuments({ student: studentId, academicTerm: termId });
    const behaviorRisk = Math.min(100, incidents * 20);

    // 5. Engagement Decline (compare current term vs previous term)
    const prevTermGrades = await this.getPreviousTermAverage(studentId, termId);
    const decline = prevTermGrades - avgPercentage;
    const declineRisk = decline > 0 ? Math.min(100, decline * 3) : 0;

    const totalRisk =
      (academicRisk * weights.academicPerformance) +
      ((attendanceRisk + consecutiveBonus) * weights.attendancePattern) +
      (assignmentRisk * weights.assignmentCompletion) +
      (behaviorRisk * weights.behavioralSignals) +
      (declineRisk * weights.engagementDecline);

    return {
      score: Math.round(totalRisk),
      level: totalRisk > 70 ? 'critical' : totalRisk > 50 ? 'warning' : totalRisk > 30 ? 'monitor' : 'healthy',
      breakdown: { academicRisk, attendanceRisk, assignmentRisk, behaviorRisk, declineRisk },
      recommendations: this.generateInterventions(totalRisk, { academicRisk, attendanceRisk, assignmentRisk }),
    };
  }

  generateInterventions(score, breakdown) {
    const interventions = [];
    if (breakdown.attendanceRisk > 50) interventions.push({ type: 'parent-meeting', priority: 'high', message: 'Schedule parent-teacher meeting re: attendance' });
    if (breakdown.academicRisk > 60) interventions.push({ type: 'tutoring', priority: 'high', message: 'Assign peer tutor or after-school help' });
    if (breakdown.assignmentRisk > 40) interventions.push({ type: 'counseling', priority: 'medium', message: 'Check-in with student on workload/understanding' });
    if (score > 70) interventions.push({ type: 'admin-alert', priority: 'critical', message: 'Flag for academic probation review' });
    return interventions;
  }
}
```

**New Models Needed**:
- `RiskAssessment` - Stores periodic risk scores per student per term
- `Intervention` - Tracks recommended and executed interventions

**Cron Schedule**: Run weekly during term, daily in exam periods

### 3.3 Staff Productivity & Automated Payroll

**Current State**: 100% manual payroll entry
**Target State**: Auto-generated payroll from attendance + leave + teaching hours

#### Implementation Plan

```javascript
class AutoPayrollService {
  async generateMonthlyPayroll(schoolId, month, year) {
    const teachers = await Teacher.find({ schoolId, isActive: true });
    const results = [];

    for (const teacher of teachers) {
      // 1. Get salary structure
      const salary = await SalaryStructure.findOne({ schoolId, role: teacher.role, grade: teacher.grade });
      if (!salary) continue;

      // 2. Aggregate attendance for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const attendanceRecords = await TeacherAttendance.find({
        teacher: teacher._id,
        date: { $gte: startDate, $lte: endDate }
      });

      const presentDays = attendanceRecords.filter(a => a.status === 'present').length;
      const lateDays = attendanceRecords.filter(a => a.status === 'late').length;
      const workingDays = await this.getWorkingDays(schoolId, month, year); // from academic calendar

      // 3. Get approved leaves
      const leaves = await LeaveApplication.find({
        staff: teacher._id,
        status: 'approved',
        fromDate: { $lte: endDate },
        toDate: { $gte: startDate }
      });
      const leaveDays = leaves.reduce((sum, l) => sum + l.totalDays, 0);
      const unpaidLeaveDays = await this.calculateUnpaidLeave(teacher._id, leaves);

      // 4. Get extra teaching hours (substitutions)
      const extraHours = await SubstitutionLog.aggregate([
        { $match: { substituteTeacher: teacher._id, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, totalHours: { $sum: '$hours' } } }
      ]);

      // 5. Calculate
      const dailyRate = salary.basic / workingDays;
      const lossOfPay = unpaidLeaveDays * dailyRate;
      const overtimePay = (extraHours[0]?.totalHours || 0) * (dailyRate / 8) * 1.5;

      const earnings = {
        basic: salary.basic,
        hra: salary.hra,
        bonus: overtimePay,
        totalEarnings: salary.basic + salary.hra + overtimePay
      };

      const deductions = {
        pf: salary.basic * 0.12,
        tax: this.calculateTax(earnings.totalEarnings, schoolId),
        lossOfPay,
        totalDeductions: (salary.basic * 0.12) + this.calculateTax(earnings.totalEarnings, schoolId) + lossOfPay
      };

      const payroll = await Payroll.create({
        schoolId, staff: teacher._id, month, year,
        earnings, deductions,
        attendance: { presentDays, leaveDays },
        grossSalary: earnings.totalEarnings,
        netSalary: earnings.totalEarnings - deductions.totalDeductions,
        status: 'pending'
      });

      results.push(payroll);
    }

    return results;
  }
}
```

**New Models Needed**:
- `SalaryStructure` - Per-role/grade salary configuration
- `SubstitutionLog` - Tracks teacher substitutions
- `TaxBracket` - Configurable tax slabs per region
- `PayslipTemplate` - PDF template for payslips

---

## PHASE 4: SCALABLE ARCHITECTURE

### 4.1 Current Architecture Assessment

```
CURRENT: Monolithic Express.js + React (Next.js)
                |
    +-----------+-----------+
    |     backend/          |     frontend/
    |  - Express server     |  - Next.js 16
    |  - 55+ models         |  - 80+ pages
    |  - 50+ controllers    |  - 36 UI components
    |  - 60+ services       |  - 3 Zustand stores
    |  - Mongoose + Prisma  |  - React Query
    |  - Socket.io          |  - shadcn/ui
    +-----------------------+-------------------+
                |
     +----------+----------+
     | MongoDB  |  MySQL   |
     | (primary)| (Prisma) |
     +----------+----------+
```

**Verdict**: The codebase is a **Modular Monolith** by accident. Domain boundaries exist (Academic/, Finance/, HR/, Library/, Transport/, Communication/) but they're coupled through direct `require()` imports and shared models.

### 4.2 Recommended Architecture: Intentional Modular Monolith

**Why NOT Microservices**: At your current scale (single-school to ~50 schools), microservices would introduce network latency, distributed transaction complexity, and operational overhead that outweigh benefits. The codebase is already organically domain-separated.

**Recommended**: Formalize the modular monolith with strict module boundaries and an internal event bus.

```
RECOMMENDED ARCHITECTURE:

                    [API Gateway / Next.js BFF]
                              |
                    [Express.js Application]
                              |
              +---------------+---------------+
              |          EVENT BUS            |
              |   (Node EventEmitter / Redis) |
              +------+----+----+----+--------+
                     |    |    |    |
        +--------+  +--+  +--+  +--+  +--------+
        |Academic|  |Finance| |HR | |Comms   |
        |Module  |  |Module | |Mod| |Module  |
        +--------+  +-------+ +---+ +--------+
        |Library |  |Transport| |Cards|  |Reports|
        |Module  |  |Module   | |Mod  |  |Module |
        +--------+  +---------+ +-----+  +-------+
                              |
                    [Shared Kernel]
                    - School model
                    - Auth middleware
                    - Response handler
                    - Database drivers
```

### 4.3 Module Contract Rules

1. **No Cross-Module Model Imports**: Finance module should NOT `require('../Academic/Grade.model')` directly. Instead, consume events or use a shared service interface.

2. **Event-Driven Integration**:
   ```javascript
   // backend/lib/eventBus.js
   const EventEmitter = require('events');
   const bus = new EventEmitter();
   bus.setMaxListeners(50);
   module.exports = bus;

   // In Academic module (publisher):
   bus.emit('grade:created', { studentId, subjectId, score, percentage });

   // In Finance module (subscriber):
   bus.on('grade:created', async ({ studentId, percentage }) => {
     await scholarshipService.checkEligibility(studentId, percentage);
   });

   // In Communication module (subscriber):
   bus.on('grade:created', async ({ studentId }) => {
     await notificationService.notifyParentOfGrade(studentId);
   });
   ```

3. **Shared Kernel** (models/services that ALL modules need):
   - `School.model.js` - Multi-tenancy root
   - `isLoggedIn.js` / `isAdmin.js` - Auth middleware
   - `responseStatus.handler.js` - Response formatter
   - `eventBus.js` - Inter-module communication

4. **Module Interface Pattern**:
   ```javascript
   // backend/modules/finance/index.js (public API of finance module)
   module.exports = {
     generateStudentFees: require('./services/billing').generateStudentFees,
     recordPayment: require('./controllers/payment').recordPayment,
     getStudentBalance: require('./services/balance').getStudentBalance,
     // Events this module emits:
     events: ['payment:received', 'payment:overdue', 'fee:generated'],
     // Events this module listens to:
     subscribesTo: ['enrollment:created', 'transport:allocated', 'library:fine-created'],
   };
   ```

### 4.4 Adding New Modules Without Breaking Existing Ones

**Example**: Adding a "Hostel" module later

```
1. Create: backend/modules/hostel/
   - models/Room.model.js, HostelAllocation.model.js
   - services/hostel.service.js
   - controllers/hostel.controller.js
   - routes/hostel.router.js
   - index.js (public interface)

2. Register in: backend/routes/v1/index.js
   router.use('/hostel', require('./hostel/hostel.router'));

3. Subscribe to existing events:
   bus.on('enrollment:created', async (data) => {
     await hostelService.checkBoardingStatus(data.studentId);
   });

4. Emit new events:
   bus.emit('hostel:fee-due', { studentId, amount, dueDate });
   // Finance module picks this up and creates FeePayment

5. No existing module code is modified.
```

### 4.5 Database Strategy

| Timeframe | Recommendation |
|-----------|---------------|
| **Now** | Standardize on MongoDB (Mongoose). The Prisma dual-driver adds complexity with many `prisma_impl` files and `501 Not Supported` fallbacks. Pick one. |
| **At 50+ schools** | Add read replicas for reporting queries. Use MongoDB Atlas with `secondaryPreferred` read preference for report aggregation pipelines. |
| **At 200+ schools** | Consider sharding by `schoolId`. Current compound indexes (`schoolId + ...`) already support this. |
| **Never** | Don't split into per-module databases (finance DB, academic DB). The join/transaction complexity isn't worth it at education-sector scale. |

### 4.6 Priority Implementation Roadmap

| Priority | Task | Effort | Impact | Dependencies |
|----------|------|--------|--------|-------------|
| **P0** | Add EventBus + wire 5 critical events | 3 days | HIGH | None |
| **P0** | Auto-overdue scheduler for FeePayment | 1 day | HIGH | None |
| **P0** | Assignment grade -> Grade record sync | 2 days | HIGH | EventBus |
| **P1** | Enrollment -> Fee generation automation | 3 days | HIGH | EventBus, FinanceService |
| **P1** | Attendance -> Parent notification pipeline | 3 days | HIGH | EventBus, Nodemailer |
| **P1** | At-Risk student detection service | 5 days | HIGH | Grade, Attendance, Assignment data |
| **P1** | Payroll auto-generation from attendance | 5 days | MEDIUM | TeacherAttendance, SalaryStructure model |
| **P2** | Payment gateway integration (Stripe) | 5 days | MEDIUM | Fee module |
| **P2** | Transport fee -> Finance integration | 2 days | MEDIUM | EventBus |
| **P2** | Library fine -> Finance integration | 2 days | MEDIUM | EventBus |
| **P2** | PDF receipt/payslip generation | 3 days | MEDIUM | @react-pdf templates |
| **P3** | Multi-currency support | 5 days | LOW | FeePayment schema change |
| **P3** | SSO/OAuth integration | 5 days | LOW | Auth middleware |
| **P3** | i18n framework | 5 days | LOW | All frontend pages |
| **P3** | PWA + offline support | 5 days | LOW | Service worker, IndexedDB |
| **P3** | Test suite (target 60% coverage) | 10 days | HIGH | Jest, Supertest setup |

---

## SUMMARY SCORECARD

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Feature Breadth** | 8/10 | Covers SIS + Finance + HR + Library + Transport + Communication + Cards |
| **Feature Depth** | 4/10 | Most modules are CRUD-only, lacking automation and cross-module integration |
| **Data Integration** | 2/10 | 7 critical silos identified; modules operate as isolated data islands |
| **Automation** | 1/10 | Nearly everything requires manual entry; zero scheduled jobs |
| **Intelligence** | 2/10 | Basic rule-based recommendations only; no predictive analytics |
| **Architecture** | 5/10 | Clean domain separation exists but no formal module contracts or event bus |
| **Testing** | 0/10 | Zero tests |
| **DevOps** | 3/10 | Vercel deployment works; no CI/CD pipeline, no staging environment |
| **Mobile** | 2/10 | Responsive via Tailwind but not mobile-optimized or PWA |
| **Security** | 5/10 | JWT + RBAC + rate limiting + helmet; but no CSRF, no audit logging, no field-level encryption |

**Overall Product Readiness**: **3.2 / 10** for production deployment at scale

**Path to 7/10**: Implement P0 + P1 items (est. 3-4 weeks) to close critical silos and add automation backbone. This transforms the product from "data entry system" to "operational platform."
