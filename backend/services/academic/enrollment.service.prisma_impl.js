const { getPrisma } = require('../../lib/prismaClient');
const financeEngine = require('../finance/transactionEngine.prisma_impl');

const TX_OPTIONS = {
  maxWait: 20000,
  timeout: 120000,
};

exports.createEnrollment = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
    const {
      student,
      subject,
      classLevel,
      academicYear,
      academicTerm,
      payerSplits,
      feeStructureId,
      dueDate,
      strictFinancialSync,
    } = req.body || {};
    const schoolId = req.userAuth.schoolId;

    if (!student) {
      return res.status(400).json({ status: 'fail', message: 'student is required' });
    }

    const strictSync = strictFinancialSync !== false;
    const eventType = 'enrollment_invoice';

    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findFirst({
        where: {
          schoolId: String(schoolId),
          studentId: String(student),
          subjectId: subject ? String(subject) : null,
          academicYear: academicYear ? String(academicYear) : null,
          academicTerm: academicTerm ? String(academicTerm) : null,
          status: 'active',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (existingEnrollment) {
        const enrollmentEventKey = `enrollment:${existingEnrollment.id}`;
        const existingInvoice = await tx.invoice.findFirst({
          where: {
            schoolId: String(schoolId),
            sourceType: 'enrollment',
            sourceRef: String(existingEnrollment.id),
          },
          orderBy: { createdAt: 'desc' },
        });

        if (existingInvoice) {
          return {
            enrollment: existingEnrollment,
            invoice: existingInvoice,
            feeStructure: null,
            clearance: null,
            deduplicated: true,
          };
        }

        try {
          const invoiceResult = await financeEngine.createInvoiceForEnrollmentTx(tx, {
            schoolId,
            studentId: String(student),
            academicYear: academicYear ? String(academicYear) : null,
            academicTerm: academicTerm ? String(academicTerm) : null,
            classLevel: classLevel ? String(classLevel) : null,
            sourceType: 'enrollment',
            sourceRef: String(existingEnrollment.id),
            payerSplits: Array.isArray(payerSplits) ? payerSplits : [],
            feeStructureId: feeStructureId ? String(feeStructureId) : null,
            dueDate: dueDate || null,
            metadata: {
              enrollmentId: existingEnrollment.id,
              recovered: true,
              createdBy: req.userAuth?._id || req.userAuth?.id || req.userId || null,
            },
          });

          await tx.financialEvent.upsert({
            where: {
              schoolId_eventType_eventKey: {
                schoolId: String(schoolId),
                eventType,
                eventKey: enrollmentEventKey,
              },
            },
            update: {
              status: 'processed',
              payload: JSON.stringify({
                enrollmentId: existingEnrollment.id,
                recovered: true,
              }),
              processedAt: new Date(),
            },
            create: {
              schoolId: String(schoolId),
              eventType,
              eventKey: enrollmentEventKey,
              status: 'processed',
              payload: JSON.stringify({
                enrollmentId: existingEnrollment.id,
                recovered: true,
              }),
              processedAt: new Date(),
            },
          });

          return {
            enrollment: existingEnrollment,
            invoice: invoiceResult.invoice,
            feeStructure: invoiceResult.feeStructure || null,
            clearance: invoiceResult.clearance || null,
            deduplicated: true,
          };
        } catch (recoveryErr) {
          await tx.financialEvent.upsert({
            where: {
              schoolId_eventType_eventKey: {
                schoolId: String(schoolId),
                eventType,
                eventKey: enrollmentEventKey,
              },
            },
            update: {
              status: 'failed',
              payload: JSON.stringify({
                enrollmentId: existingEnrollment.id,
                recovered: true,
                error: recoveryErr.message,
              }),
              processedAt: new Date(),
            },
            create: {
              schoolId: String(schoolId),
              eventType,
              eventKey: enrollmentEventKey,
              status: 'failed',
              payload: JSON.stringify({
                enrollmentId: existingEnrollment.id,
                recovered: true,
                error: recoveryErr.message,
              }),
              processedAt: new Date(),
            },
          });

          if (strictSync) {
            throw new Error(`Enrollment finance sync failed: ${recoveryErr.message}`);
          }

          return {
            enrollment: existingEnrollment,
            invoice: null,
            feeStructure: null,
            clearance: null,
            deduplicated: true,
            financeWarning: recoveryErr.message,
          };
        }
      }

      const enrollment = await tx.enrollment.create({
        data: {
          studentId: String(student),
          subjectId: subject ? String(subject) : null,
          classLevel: classLevel ? String(classLevel) : null,
          academicYear: academicYear ? String(academicYear) : null,
          academicTerm: academicTerm ? String(academicTerm) : null,
          schoolId: String(schoolId),
        },
      });

      const enrollmentEventKey = `enrollment:${enrollment.id}`;

      const existingEvent = await tx.financialEvent.findUnique({
        where: {
          schoolId_eventType_eventKey: {
            schoolId: String(schoolId),
            eventType,
            eventKey: enrollmentEventKey,
          },
        },
      });

      if (existingEvent) {
        const alreadyInvoiced = await tx.invoice.findFirst({
          where: {
            schoolId: String(schoolId),
            sourceType: 'enrollment',
            sourceRef: String(enrollment.id),
          },
          orderBy: { createdAt: 'desc' },
        });
        return {
          enrollment,
          invoice: alreadyInvoiced || null,
          feeStructure: null,
          clearance: null,
          deduplicated: true,
        };
      }

      try {
        const invoiceResult = await financeEngine.createInvoiceForEnrollmentTx(tx, {
          schoolId,
          studentId: String(student),
          academicYear: academicYear ? String(academicYear) : null,
          academicTerm: academicTerm ? String(academicTerm) : null,
          classLevel: classLevel ? String(classLevel) : null,
          sourceType: 'enrollment',
          sourceRef: String(enrollment.id),
          payerSplits: Array.isArray(payerSplits) ? payerSplits : [],
          feeStructureId: feeStructureId ? String(feeStructureId) : null,
          dueDate: dueDate || null,
          metadata: {
            enrollmentId: enrollment.id,
            createdBy: req.userAuth?._id || req.userAuth?.id || req.userId || null,
          },
        });

        await tx.financialEvent.create({
          data: {
            schoolId: String(schoolId),
            eventType,
            eventKey: enrollmentEventKey,
            status: 'processed',
            payload: JSON.stringify({
              enrollmentId: enrollment.id,
              student,
              subject: subject || null,
              academicYear: academicYear || null,
              academicTerm: academicTerm || null,
            }),
            processedAt: new Date(),
          },
        });

        return {
          enrollment,
          invoice: invoiceResult.invoice,
          feeStructure: invoiceResult.feeStructure || null,
          clearance: invoiceResult.clearance || null,
          deduplicated: false,
        };
      } catch (invoiceErr) {
        await tx.financialEvent.create({
          data: {
            schoolId: String(schoolId),
            eventType,
            eventKey: enrollmentEventKey,
            status: 'failed',
            payload: JSON.stringify({
              enrollmentId: enrollment.id,
              error: invoiceErr.message,
            }),
            processedAt: new Date(),
          },
        });

        if (strictSync) {
          throw new Error(`Enrollment finance sync failed: ${invoiceErr.message}`);
        }

        return {
          enrollment,
          invoice: null,
          feeStructure: null,
          clearance: null,
          deduplicated: false,
          financeWarning: invoiceErr.message,
        };
      }
    }, TX_OPTIONS);

    return res.status(201).json({
      status: 'success',
      data: result.enrollment,
      finance: {
        invoice: result.invoice || null,
        feeStructure: result.feeStructure || null,
        clearance: result.clearance || null,
        warning: result.financeWarning || null,
      },
      deduplicated: Boolean(result.deduplicated),
    });
  } catch (err) {
    console.error('[Prisma][Enrollment] create error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getStudentEnrollments = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
    const { studentId } = req.params;
    const schoolId = req.userAuth.schoolId;

    // Prisma schema stores scalar IDs on Enrollment (no relation fields defined),
    // so avoid using `include` with non-relation fields. Return the enrollment records
    // directly and let the caller/consumer resolve related metadata if needed.
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId, schoolId, status: 'active' },
      select: {
        id: true,
        studentId: true,
        subjectId: true,
        classLevel: true,
        academicYear: true,
        academicTerm: true,
        status: true,
        progress: true,
        schoolId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ status: 'success', data: enrollments });
  } catch (err) {
    console.error('[Prisma][Enrollment] list error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateEnrollmentProgress = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
    const { enrollmentId } = req.params;
    const { progress } = req.body;

    const enrollment = await prisma.enrollment.update({ where: { id: enrollmentId }, data: { progress } });
    return res.status(200).json({ status: 'success', data: enrollment });
  } catch (err) {
    console.error('[Prisma][Enrollment] update error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
