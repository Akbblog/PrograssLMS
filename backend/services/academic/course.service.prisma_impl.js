const responseStatus = require("../../handlers/responseStatus.handler.js");

// NOTE: Prisma schema currently does not include Course/Module/Lesson models.
// These stubs prevent Prisma deployments from hitting Mongoose/ObjectId paths.

exports.createCourseService = async (_data, _userId, res) => {
  return responseStatus(res, 501, "failed", "Courses are not yet supported in Prisma mode");
};

exports.getAllCoursesService = async (_schoolId, _filters = {}) => {
  return [];
};

exports.getCourseService = async (_id) => {
  return null;
};

exports.updateCourseService = async (_data, _id, res) => {
  return responseStatus(res, 501, "failed", "Courses are not yet supported in Prisma mode");
};

exports.deleteCourseService = async (_id, res) => {
  return responseStatus(res, 501, "failed", "Courses are not yet supported in Prisma mode");
};

exports.publishCourseService = async (_id, res) => {
  return responseStatus(res, 501, "failed", "Courses are not yet supported in Prisma mode");
};

exports.createModuleService = async (_data, _courseId, res) => {
  return responseStatus(res, 501, "failed", "Course modules are not yet supported in Prisma mode");
};

exports.updateModuleService = async (_data, _id, res) => {
  return responseStatus(res, 501, "failed", "Course modules are not yet supported in Prisma mode");
};

exports.deleteModuleService = async (_id, res) => {
  return responseStatus(res, 501, "failed", "Course modules are not yet supported in Prisma mode");
};

exports.createLessonService = async (_data, _moduleId, res) => {
  return responseStatus(res, 501, "failed", "Course lessons are not yet supported in Prisma mode");
};

exports.updateLessonService = async (_data, _id, res) => {
  return responseStatus(res, 501, "failed", "Course lessons are not yet supported in Prisma mode");
};

exports.deleteLessonService = async (_id, res) => {
  return responseStatus(res, 501, "failed", "Course lessons are not yet supported in Prisma mode");
};

exports.markLessonCompleteService = async (_lessonId, _studentId, _watchTime, res) => {
  return responseStatus(res, 501, "failed", "Course lessons are not yet supported in Prisma mode");
};
