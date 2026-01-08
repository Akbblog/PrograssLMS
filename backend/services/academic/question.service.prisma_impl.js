const responseStatus = require("../../handlers/responseStatus.handler.js");

// NOTE: Prisma schema currently does not include QuestionBank models.
// These stubs prevent Prisma deployments from hitting Mongoose/ObjectId paths.

exports.createQuestionService = async (_data, _userId, res) => {
  return responseStatus(res, 501, "failed", "Question bank is not yet supported in Prisma mode");
};

exports.getAllQuestionsService = async (_schoolId, _filters = {}) => {
  return [];
};

exports.getQuestionService = async (_id) => {
  return null;
};

exports.updateQuestionService = async (_data, _id, res) => {
  return responseStatus(res, 501, "failed", "Question bank is not yet supported in Prisma mode");
};

exports.deleteQuestionService = async (_id, res) => {
  return responseStatus(res, 501, "failed", "Question bank is not yet supported in Prisma mode");
};

exports.bulkImportQuestionsService = async (_questions, _userId, res) => {
  return responseStatus(res, 501, "failed", "Question bank is not yet supported in Prisma mode");
};
