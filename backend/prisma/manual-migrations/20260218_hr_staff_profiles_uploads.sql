-- HR staff profile + teacher photo/documents support (Prisma mode)
-- Apply with:
-- npx prisma db execute --schema prisma/schema.prisma --file prisma/manual-migrations/20260218_hr_staff_profiles_uploads.sql

CREATE TABLE IF NOT EXISTS `StaffProfile` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `schoolId` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) DEFAULT NULL,
  `employeeId` VARCHAR(100) NOT NULL,
  `personalInfo` JSON DEFAULT NULL,
  `personalInfoPhoto` LONGTEXT DEFAULT NULL,
  `contactInfo` JSON DEFAULT NULL,
  `employmentInfo` JSON DEFAULT NULL,
  `qualifications` JSON DEFAULT NULL,
  `documents` JSON DEFAULT NULL,
  `bankDetails` JSON DEFAULT NULL,
  `salary` JSON DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `StaffProfile_schoolId_employeeId_key` (`schoolId`, `employeeId`),
  KEY `StaffProfile_schoolId_status_idx` (`schoolId`, `status`)
);

SET @has_teacher_photo := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Teacher'
    AND COLUMN_NAME = 'personalInfoPhoto'
);
SET @sql_teacher_photo := IF(
  @has_teacher_photo = 0,
  'ALTER TABLE `Teacher` ADD COLUMN `personalInfoPhoto` LONGTEXT NULL',
  'SELECT 1'
);
PREPARE stmt_teacher_photo FROM @sql_teacher_photo;
EXECUTE stmt_teacher_photo;
DEALLOCATE PREPARE stmt_teacher_photo;

SET @has_teacher_documents := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Teacher'
    AND COLUMN_NAME = 'documents'
);
SET @sql_teacher_documents := IF(
  @has_teacher_documents = 0,
  'ALTER TABLE `Teacher` ADD COLUMN `documents` JSON NULL',
  'SELECT 1'
);
PREPARE stmt_teacher_documents FROM @sql_teacher_documents;
EXECUTE stmt_teacher_documents;
DEALLOCATE PREPARE stmt_teacher_documents;
