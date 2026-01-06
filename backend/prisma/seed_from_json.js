const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function upsertStudents(filePath) {
  const docs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const d of docs) {
    if (!d.email) continue;
    await prisma.student.upsert({
      where: { email: d.email },
      update: d,
      create: d
    });
  }
}

async function upsertTeachers(filePath) {
  const docs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const d of docs) {
    if (!d.email) continue;
    await prisma.teacher.upsert({
      where: { email: d.email },
      update: d,
      create: d
    });
  }
}

async function upsertClasses(filePath) {
  const docs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const d of docs) {
    if (!d.name) continue;
    await prisma.classLevel.upsert({
      where: { name: d.name },
      update: d,
      create: d
    });
  }
}

async function upsertSubjects(filePath) {
  const docs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const d of docs) {
    if (!d.name) continue;
    await prisma.subject.upsert({
      where: { name: d.name },
      update: d,
      create: d
    });
  }
}

async function main() {
  const base = path.resolve(__dirname);
  const studentsFile = process.argv[2] || path.join(base, 'seed-data', 'students_prisma.json');
  const teachersFile = process.argv[3] || path.join(base, 'seed-data', 'teachers_prisma.json');
  const classesFile = process.argv[4] || path.join(base, 'seed-data', 'classes_prisma.json');
  const subjectsFile = process.argv[5] || path.join(base, 'seed-data', 'subjects_prisma.json');

  if (fs.existsSync(studentsFile)) await upsertStudents(studentsFile);
  if (fs.existsSync(teachersFile)) await upsertTeachers(teachersFile);
  if (fs.existsSync(classesFile)) await upsertClasses(classesFile);
  if (fs.existsSync(subjectsFile)) await upsertSubjects(subjectsFile);

  await prisma.$disconnect();
  console.log('JSON seed completed');
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
