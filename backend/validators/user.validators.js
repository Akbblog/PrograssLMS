// Validation schemas for user-related routes (compatible with validateRequest.validateBody)

const adminCreateSchema = {
  name: { type: "string", required: true },
  email: { type: "email", required: true },
  password: { type: "string", required: true },
};

const adminUpdateSchema = {
  name: { type: "string", required: false },
  email: { type: "email", required: false },
  phone: { type: "string", required: false },
};

const teacherCreateSchema = {
  name: { type: "string", required: true },
  email: { type: "email", required: true },
  password: { type: "string", required: true },
  phone: { type: "string", required: false },
};

const teacherUpdateSchema = {
  name: { type: "string", required: false },
  phone: { type: "string", required: false },
  qualifications: { type: "string", required: false },
};

const studentSelfRegisterSchema = {
  name: { type: "string", required: true },
  email: { type: "email", required: true },
  password: { type: "string", required: true },
};

const studentAdminCreateSchema = {
  name: { type: "string", required: true },
  email: { type: "email", required: true },
  password: { type: "string", required: true },
};

const studentUpdateSchema = {
  name: { type: "string", required: false },
  email: { type: "email", required: false },
  phone: { type: "string", required: false },
  guardian: { type: "object", required: false },
};

module.exports = {
  adminCreateSchema,
  adminUpdateSchema,
  teacherCreateSchema,
  teacherUpdateSchema,
  studentSelfRegisterSchema,
  studentAdminCreateSchema,
  studentUpdateSchema,
};
