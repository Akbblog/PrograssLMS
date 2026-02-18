const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const backendRoot = path.join(__dirname, '..');
const controllerPath = path.join(backendRoot, 'controllers', 'hr', 'staff.controller.js');
const prismaClientPath = path.join(backendRoot, 'lib', 'prismaClient.js');
const staffProfileModelPath = path.join(backendRoot, 'models', 'HR', 'StaffProfile.model.js');

const originalUsePrisma = process.env.USE_PRISMA;

const mockModule = (modulePath, exportsValue) => {
  require.cache[modulePath] = {
    id: modulePath,
    filename: modulePath,
    loaded: true,
    exports: exportsValue,
  };
};

const cleanup = () => {
  delete require.cache[controllerPath];
  delete require.cache[prismaClientPath];
  delete require.cache[staffProfileModelPath];

  if (typeof originalUsePrisma === 'undefined') {
    delete process.env.USE_PRISMA;
  } else {
    process.env.USE_PRISMA = originalUsePrisma;
  }
};

const makeResponse = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  },
});

const loadControllerWithPrisma = (prisma) => {
  process.env.USE_PRISMA = 'true';
  delete require.cache[controllerPath];
  mockModule(prismaClientPath, { getPrisma: () => prisma });
  mockModule(staffProfileModelPath, {});
  return require(controllerPath);
};

test.afterEach(cleanup);
test.after(cleanup);

test('listStaff includes teachers in Prisma mode', async () => {
  const prisma = {
    staffProfile: {
      findMany: async () => [
        {
          id: 'staff-1',
          schoolId: 'school-1',
          employeeId: 'EMP-100',
          personalInfo: { firstName: 'Layla', lastName: 'Ahmed', photo: 'https://cdn.example.com/staff-layla.png' },
          contactInfo: { email: 'layla@school.edu', phone: '555-0001' },
          employmentInfo: { department: 'administration', designation: 'HR Manager' },
          qualifications: [],
          documents: [],
          bankDetails: {},
          salary: {},
          status: 'active',
          userId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    teacher: {
      findMany: async () => [
        {
          id: 'teacher-1',
          schoolId: 'school-1',
          name: 'Aisha Khan',
          email: 'aisha@school.edu',
          phone: '555-1000',
          personalInfoPhoto: 'https://cdn.example.com/teacher-aisha.png',
          role: 'teacher',
          status: 'active',
        },
      ],
    },
  };

  const controller = loadControllerWithPrisma(prisma);
  const req = { schoolId: 'school-1' };
  const res = makeResponse();

  await controller.listStaff(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'success');
  assert.ok(Array.isArray(res.body.data));
  assert.equal(res.body.data.length, 2);

  const teacherRow = res.body.data.find((row) => row._source === 'teacher');
  assert.ok(teacherRow);
  assert.equal(teacherRow.personalInfo.firstName, 'Aisha');
  assert.equal(teacherRow.personalInfo.photo, 'https://cdn.example.com/teacher-aisha.png');
  assert.equal(teacherRow.contactInfo.email, 'aisha@school.edu');
  assert.equal(teacherRow.employmentInfo.department, 'teaching');
});

test('createStaff in Prisma mode persists photo URL', async () => {
  let createPayload = null;

  const prisma = {
    staffProfile: {
      create: async ({ data }) => {
        createPayload = data;
        return {
          id: 'staff-new',
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
    },
  };

  const controller = loadControllerWithPrisma(prisma);
  const req = {
    schoolId: 'school-1',
    body: {
      employeeId: 'EMP-777',
      personalInfo: {
        firstName: 'Nadia',
        lastName: 'Iqbal',
        photo: 'https://cdn.example.com/staff-nadia.png',
      },
      contactInfo: {
        email: 'nadia@school.edu',
        phone: '555-7777',
      },
      employmentInfo: {
        department: 'support',
        designation: 'Librarian',
      },
      documents: [{ type: 'id_proof', name: 'ID Card', url: 'https://cdn.example.com/id-card.pdf' }],
      status: 'active',
    },
  };
  const res = makeResponse();

  await controller.createStaff(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.status, 'success');
  assert.equal(createPayload.personalInfoPhoto, 'https://cdn.example.com/staff-nadia.png');
  assert.equal(res.body.data.personalInfo.photo, 'https://cdn.example.com/staff-nadia.png');
  assert.equal(res.body.data.documents.length, 1);
  assert.equal(res.body.data.documents[0].url, 'https://cdn.example.com/id-card.pdf');
});
