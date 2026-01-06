// Simple Prisma seed script (JS) example
// Usage:
// 1. npm install @prisma/client
// 2. node prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding sample data (no-op placeholder)');
  // Example: create one student for testing
  await prisma.student.upsert({
    where: { email: 'elena.pet@example.com' },
    update: {},
    create: {
      name: 'Elena Pet',
      email: 'elena.pet@example.com',
      studentId: 'STU12345',
      phone: '555-0101',
      schoolId: 'SCHOOL-TEST-1'
    }
  });

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
