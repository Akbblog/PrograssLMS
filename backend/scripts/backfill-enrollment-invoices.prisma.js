require("dotenv").config();

const { getPrisma, disconnectPrisma } = require("../lib/prismaClient");
const financeEngine = require("../services/finance/transactionEngine.prisma_impl");

const TX_OPTIONS = {
  maxWait: 20000,
  timeout: 120000,
};

function parseArgs(argv = []) {
  const out = {
    dryRun: true,
    schoolId: null,
    limit: 0,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") out.dryRun = true;
    if (arg === "--apply") out.dryRun = false;
    if (arg === "--schoolId" && argv[i + 1]) out.schoolId = String(argv[i + 1]);
    if (arg === "--limit" && argv[i + 1]) out.limit = Number(argv[i + 1]) || 0;
  }

  return out;
}

async function main() {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Database unavailable");

  const args = parseArgs(process.argv.slice(2));

  try {
    await prisma.invoice.findFirst({ select: { id: true } });
    await prisma.financialEvent.findFirst({ select: { id: true } });
    await prisma.studentFinancialClearance.findFirst({ select: { id: true } });
  } catch (error) {
    if (String(error?.message || "").includes("does not exist")) {
      throw new Error(
        "Required finance tables are missing. Run Prisma migration/deploy first, then rerun this script."
      );
    }
    throw error;
  }

  const enrollmentWhere = { status: "active" };
  if (args.schoolId) enrollmentWhere.schoolId = args.schoolId;

  const enrollments = await prisma.enrollment.findMany({
    where: enrollmentWhere,
    orderBy: { createdAt: "asc" },
    take: args.limit > 0 ? args.limit : undefined,
  });

  console.log(`[Backfill] Found ${enrollments.length} active enrollments`);
  console.log(`[Backfill] dryRun=${args.dryRun} schoolId=${args.schoolId || "ALL"} limit=${args.limit || "ALL"}`);

  let created = 0;
  let skipped = 0;
  let failed = 0;
  const touchedStudents = new Set();

  for (const enrollment of enrollments) {
    const schoolId = String(enrollment.schoolId);
    const eventKey = `enrollment:${enrollment.id}`;
    touchedStudents.add(`${schoolId}:${enrollment.studentId}`);

    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        schoolId,
        sourceType: "enrollment",
        sourceRef: String(enrollment.id),
      },
      select: { id: true },
    });

    if (existingInvoice) {
      skipped += 1;
      continue;
    }

    if (args.dryRun) {
      created += 1;
      continue;
    }

    try {
      const result = await financeEngine.triggerEnrollmentInvoice({
        schoolId,
        studentId: String(enrollment.studentId),
        academicYear: enrollment.academicYear ? String(enrollment.academicYear) : null,
        academicTerm: enrollment.academicTerm ? String(enrollment.academicTerm) : null,
        classLevel: enrollment.classLevel ? String(enrollment.classLevel) : null,
        sourceType: "enrollment",
        sourceRef: String(enrollment.id),
        eventType: "enrollment_invoice",
        eventKey,
        metadata: {
          enrollmentId: enrollment.id,
          backfill: true,
        },
      });

      if (result?.invoice?.id) {
        created += 1;
      } else {
        skipped += 1;
      }
    } catch (error) {
      failed += 1;
      console.error(`[Backfill] Enrollment ${enrollment.id} failed: ${error.message}`);
    }
  }

  if (!args.dryRun) {
    for (const key of touchedStudents) {
      const [schoolId, studentId] = key.split(":");
      try {
        await prisma.$transaction(
          (tx) => financeEngine.evaluateStudentClearanceTx(tx, schoolId, studentId),
          TX_OPTIONS
        );
      } catch (error) {
        console.error(`[Backfill] Clearance recompute failed for ${studentId}: ${error.message}`);
      }
    }
  }

  console.log("[Backfill] Summary");
  console.log(`[Backfill] created=${created}`);
  console.log(`[Backfill] skipped=${skipped}`);
  console.log(`[Backfill] failed=${failed}`);
  console.log(`[Backfill] touchedStudents=${touchedStudents.size}`);
}

if (require.main === module) {
  main()
    .then(async () => {
      await disconnectPrisma();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error("[Backfill] Fatal:", error.message);
      await disconnectPrisma();
      process.exit(1);
    });
}

module.exports = { main };
