const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const { isPassMatched } = require('../handlers/passHash.handler');

(async () => {
  const prisma = new PrismaClient();
  try {
    const checks = [
      { kind: 'superadmin', model: 'admin', email: 'SA@progresslms.com', password: 'Superpass' },
      { kind: 'star-admin', model: 'admin', email: 'admin@starschool.com', password: 'admin123' },
      { kind: 'teacher', model: 'teacher', email: 'ali.khan@starschool.com', password: 'teacher123' },
      { kind: 'student', model: 'student', email: 'student1@starschool.com', password: 'student123' },
    ];

    for (const c of checks) {
      let record = null;
      if (c.model === 'admin') record = await prisma.admin.findUnique({ where: { email: c.email } });
      if (c.model === 'teacher') record = await prisma.teacher.findUnique({ where: { email: c.email } });
      if (c.model === 'student') record = await prisma.student.findUnique({ where: { email: c.email } });

      if (!record) {
        console.log(`[MISSING] ${c.kind} (${c.email}) not found in DB`);
        continue;
      }
      const matched = await isPassMatched(c.password, record.password || '');
      console.log(`[${matched ? 'OK' : 'FAIL'}] ${c.kind} (${c.email}) - password match: ${matched}`);
    }
  } catch (err) {
    console.error('Error checking credentials:', err.message || err);
    console.error(err.stack);
  } finally {
    await prisma.$disconnect();
  }
})();
