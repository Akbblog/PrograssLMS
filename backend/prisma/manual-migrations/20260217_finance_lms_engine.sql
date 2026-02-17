-- Manual migration for finance + LMS Prisma models
-- Reason: prisma migrate dev requires shadow DB privileges not available in current MySQL user.
-- Apply on the target database before running backfill/app services.

-- =========================================================
-- Existing tables: add new columns for FeeStructure/FeePayment
-- =========================================================

ALTER TABLE `FeeStructure`
  ADD COLUMN IF NOT EXISTS `description` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `academicTerm` VARCHAR(36) NULL,
  ADD COLUMN IF NOT EXISTS `paymentPlans` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `legacyAmount` DOUBLE NULL,
  ADD COLUMN IF NOT EXISTS `legacyDueDate` DATETIME(3) NULL,
  ADD COLUMN IF NOT EXISTS `legacyType` VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS `effectiveFrom` DATETIME(3) NULL,
  ADD COLUMN IF NOT EXISTS `effectiveUntil` DATETIME(3) NULL;

CREATE INDEX IF NOT EXISTS `FeeStructure_schoolId_academicYear_status_idx`
  ON `FeeStructure` (`schoolId`, `academicYear`, `status`);

ALTER TABLE `FeePayment`
  ADD COLUMN IF NOT EXISTS `feeStructureId` VARCHAR(36) NULL,
  ADD COLUMN IF NOT EXISTS `invoiceId` VARCHAR(36) NULL,
  ADD COLUMN IF NOT EXISTS `amountDue` DOUBLE NULL,
  ADD COLUMN IF NOT EXISTS `paymentDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS `transactionId` VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `remarks` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `recordedBy` VARCHAR(36) NULL,
  ADD COLUMN IF NOT EXISTS `academicTerm` VARCHAR(36) NULL;

CREATE INDEX IF NOT EXISTS `FeePayment_schoolId_studentId_status_idx`
  ON `FeePayment` (`schoolId`, `studentId`, `status`);
CREATE INDEX IF NOT EXISTS `FeePayment_schoolId_invoiceId_idx`
  ON `FeePayment` (`schoolId`, `invoiceId`);

-- =========================================================
-- New finance tables
-- =========================================================

CREATE TABLE IF NOT EXISTS `Invoice` (
  `id` VARCHAR(36) NOT NULL,
  `schoolId` VARCHAR(36) NOT NULL,
  `studentId` VARCHAR(36) NOT NULL,
  `feeStructureId` VARCHAR(36) NULL,
  `sourceType` VARCHAR(100) NOT NULL DEFAULT 'manual',
  `sourceRef` VARCHAR(255) NULL,
  `academicYear` VARCHAR(36) NULL,
  `academicTerm` VARCHAR(36) NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `subtotal` DOUBLE NOT NULL DEFAULT 0,
  `totalDue` DOUBLE NOT NULL DEFAULT 0,
  `totalPaid` DOUBLE NOT NULL DEFAULT 0,
  `outstanding` DOUBLE NOT NULL DEFAULT 0,
  `dueDate` DATETIME(3) NULL,
  `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `paidAt` DATETIME(3) NULL,
  `metadata` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS `Invoice_schoolId_studentId_status_idx`
  ON `Invoice` (`schoolId`, `studentId`, `status`);
CREATE INDEX IF NOT EXISTS `Invoice_schoolId_sourceType_sourceRef_idx`
  ON `Invoice` (`schoolId`, `sourceType`, `sourceRef`);

CREATE TABLE IF NOT EXISTS `InvoiceLine` (
  `id` VARCHAR(36) NOT NULL,
  `invoiceId` VARCHAR(36) NOT NULL,
  `code` VARCHAR(100) NULL,
  `name` VARCHAR(255) NOT NULL,
  `quantity` DOUBLE NOT NULL DEFAULT 1,
  `unitPrice` DOUBLE NOT NULL DEFAULT 0,
  `amount` DOUBLE NOT NULL DEFAULT 0,
  `metadata` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS `InvoiceLine_invoiceId_idx`
  ON `InvoiceLine` (`invoiceId`);

CREATE TABLE IF NOT EXISTS `InvoicePayerAllocation` (
  `id` VARCHAR(36) NOT NULL,
  `invoiceId` VARCHAR(36) NOT NULL,
  `payerType` VARCHAR(50) NOT NULL DEFAULT 'parent',
  `payerRef` VARCHAR(255) NULL,
  `percentage` DOUBLE NULL,
  `fixedAmount` DOUBLE NULL,
  `amountDue` DOUBLE NOT NULL DEFAULT 0,
  `amountPaid` DOUBLE NOT NULL DEFAULT 0,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `metadata` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS `InvoicePayerAllocation_invoiceId_payerType_idx`
  ON `InvoicePayerAllocation` (`invoiceId`, `payerType`);

CREATE TABLE IF NOT EXISTS `FinancialAccount` (
  `id` VARCHAR(36) NOT NULL,
  `schoolId` VARCHAR(36) NOT NULL,
  `code` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `normalSide` VARCHAR(10) NOT NULL,
  `isSystem` BOOLEAN NOT NULL DEFAULT FALSE,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `FinancialAccount_schoolId_code_key` (`schoolId`, `code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS `FinancialAccount_schoolId_category_idx`
  ON `FinancialAccount` (`schoolId`, `category`);

CREATE TABLE IF NOT EXISTS `JournalEntry` (
  `id` VARCHAR(36) NOT NULL,
  `schoolId` VARCHAR(36) NOT NULL,
  `referenceType` VARCHAR(100) NOT NULL,
  `referenceId` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `postedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `metadata` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS `JournalEntry_schoolId_referenceType_referenceId_idx`
  ON `JournalEntry` (`schoolId`, `referenceType`, `referenceId`);

CREATE TABLE IF NOT EXISTS `JournalLine` (
  `id` VARCHAR(36) NOT NULL,
  `journalEntryId` VARCHAR(36) NOT NULL,
  `accountId` VARCHAR(36) NOT NULL,
  `debit` DOUBLE NOT NULL DEFAULT 0,
  `credit` DOUBLE NOT NULL DEFAULT 0,
  `memo` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS `JournalLine_journalEntryId_idx`
  ON `JournalLine` (`journalEntryId`);
CREATE INDEX IF NOT EXISTS `JournalLine_accountId_idx`
  ON `JournalLine` (`accountId`);

CREATE TABLE IF NOT EXISTS `StudentFinancialClearance` (
  `id` VARCHAR(36) NOT NULL,
  `schoolId` VARCHAR(36) NOT NULL,
  `studentId` VARCHAR(36) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'clear',
  `outstandingAmount` DOUBLE NOT NULL DEFAULT 0,
  `holdCourses` BOOLEAN NOT NULL DEFAULT FALSE,
  `holdGrades` BOOLEAN NOT NULL DEFAULT FALSE,
  `holdCertificates` BOOLEAN NOT NULL DEFAULT FALSE,
  `reason` TEXT NULL,
  `lastEvaluatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `StudentFinancialClearance_schoolId_studentId_key` (`schoolId`, `studentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `PayrollRun` (
  `id` VARCHAR(36) NOT NULL,
  `schoolId` VARCHAR(36) NOT NULL,
  `staffId` VARCHAR(36) NOT NULL,
  `month` INT NOT NULL,
  `year` INT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `baseSalary` DOUBLE NOT NULL DEFAULT 0,
  `activityAmount` DOUBLE NOT NULL DEFAULT 0,
  `bonusAmount` DOUBLE NOT NULL DEFAULT 0,
  `deductionAmount` DOUBLE NOT NULL DEFAULT 0,
  `grossSalary` DOUBLE NOT NULL DEFAULT 0,
  `netSalary` DOUBLE NOT NULL DEFAULT 0,
  `metrics` TEXT NULL,
  `generatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `processedAt` DATETIME(3) NULL,
  `paymentDate` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS `PayrollRun_schoolId_staffId_month_year_idx`
  ON `PayrollRun` (`schoolId`, `staffId`, `month`, `year`);

CREATE TABLE IF NOT EXISTS `FinancialEvent` (
  `id` VARCHAR(36) NOT NULL,
  `schoolId` VARCHAR(36) NOT NULL,
  `eventType` VARCHAR(100) NOT NULL,
  `eventKey` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'processed',
  `payload` TEXT NULL,
  `processedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `FinancialEvent_schoolId_eventType_eventKey_key` (`schoolId`, `eventType`, `eventKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- New LMS course tables (Prisma mode)
-- =========================================================

CREATE TABLE IF NOT EXISTS `Course` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `thumbnail` TEXT NULL,
  `category` VARCHAR(100) NULL,
  `difficulty` VARCHAR(50) NOT NULL DEFAULT 'beginner',
  `subjectId` VARCHAR(36) NULL,
  `classLevels` TEXT NULL,
  `instructorId` VARCHAR(36) NULL,
  `estimatedHours` DOUBLE NOT NULL DEFAULT 0,
  `prerequisites` TEXT NULL,
  `tags` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'draft',
  `publishedAt` DATETIME(3) NULL,
  `allowEnrollment` BOOLEAN NOT NULL DEFAULT TRUE,
  `requireCompletion` BOOLEAN NOT NULL DEFAULT FALSE,
  `showProgress` BOOLEAN NOT NULL DEFAULT TRUE,
  `certificate` BOOLEAN NOT NULL DEFAULT FALSE,
  `schoolId` VARCHAR(36) NOT NULL,
  `createdBy` VARCHAR(36) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS `Course_schoolId_status_createdAt_idx`
  ON `Course` (`schoolId`, `status`, `createdAt`);

CREATE TABLE IF NOT EXISTS `CourseModule` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `sequence` INT NOT NULL DEFAULT 1,
  `courseId` VARCHAR(36) NOT NULL,
  `duration` INT NOT NULL DEFAULT 0,
  `isRequired` BOOLEAN NOT NULL DEFAULT TRUE,
  `schoolId` VARCHAR(36) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS `CourseModule_courseId_sequence_idx`
  ON `CourseModule` (`courseId`, `sequence`);
CREATE INDEX IF NOT EXISTS `CourseModule_schoolId_courseId_idx`
  ON `CourseModule` (`schoolId`, `courseId`);

CREATE TABLE IF NOT EXISTS `CourseLesson` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `sequence` INT NOT NULL DEFAULT 1,
  `type` VARCHAR(50) NOT NULL DEFAULT 'video',
  `content` TEXT NULL,
  `duration` INT NOT NULL DEFAULT 0,
  `moduleId` VARCHAR(36) NOT NULL,
  `isPreview` BOOLEAN NOT NULL DEFAULT FALSE,
  `isRequired` BOOLEAN NOT NULL DEFAULT TRUE,
  `resources` TEXT NULL,
  `schoolId` VARCHAR(36) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS `CourseLesson_moduleId_sequence_idx`
  ON `CourseLesson` (`moduleId`, `sequence`);
CREATE INDEX IF NOT EXISTS `CourseLesson_schoolId_moduleId_idx`
  ON `CourseLesson` (`schoolId`, `moduleId`);

CREATE TABLE IF NOT EXISTS `CourseLessonCompletion` (
  `id` VARCHAR(36) NOT NULL,
  `lessonId` VARCHAR(36) NOT NULL,
  `studentId` VARCHAR(36) NOT NULL,
  `completedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `watchTime` INT NOT NULL DEFAULT 0,
  `schoolId` VARCHAR(36) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `CourseLessonCompletion_lessonId_studentId_key` (`lessonId`, `studentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS `CourseLessonCompletion_studentId_schoolId_idx`
  ON `CourseLessonCompletion` (`studentId`, `schoolId`);
