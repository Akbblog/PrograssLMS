const { getPrisma } = require('../../lib/prismaClient');
const responseStatus = require('../../handlers/responseStatus.handler');

exports.studentCheckExamResultService = async (examId, studentId, res) => {
  const result = await prisma.result.findFirst({ where: { examId, studentId } });
  if (!result) return responseStatus(res, 404, 'failed', 'Result not found');
  if (!result.isPublished) return responseStatus(res, 400, 'failed', 'Result is not published yet!');
  return responseStatus(res, 200, 'success', result);
};

exports.getAllExamResultsService = async (classId, teacherId, res) => {
  const results = await prisma.result.findMany({ where: { classLevel: classId } });
  // Authorization check left to controller; mimic previous behavior minimally
  return responseStatus(res, 200, 'success', results);
};

exports.adminPublishResultService = async (examId, res) => {
  const updated = await prisma.result.updateMany({ where: { examId }, data: { isPublished: true } });
  return responseStatus(res, 200, 'success', { updated: updated.count });
};
