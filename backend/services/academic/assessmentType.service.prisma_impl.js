const responseStatus = require("../../handlers/responseStatus.handler.js");

// NOTE: Prisma schema currently does not include AssessmentType models.
// These stubs prevent Prisma deployments from hitting Mongoose/ObjectId paths.

exports.createAssessmentTypeService = async (_data, _userId, res) => {
  return responseStatus(res, 501, "failed", "Assessment types are not yet supported in Prisma mode");
};

exports.getAllAssessmentTypesService = async (_schoolId) => {
  return [];
};

exports.getAssessmentTypeService = async (_id) => {
  return null;
};

exports.updateAssessmentTypeService = async (_data, _id, _userId, res) => {
  return responseStatus(res, 501, "failed", "Assessment types are not yet supported in Prisma mode");
};

exports.deleteAssessmentTypeService = async (_id, res) => {
  return responseStatus(res, 501, "failed", "Assessment types are not yet supported in Prisma mode");
};
