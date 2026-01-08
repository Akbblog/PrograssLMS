const responseStatus = require("../../handlers/responseStatus.handler.js");

// Dynamically load service based on USE_PRISMA flag
const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
const servicePath = usePrisma 
  ? "../../services/academic/exams.service.prisma_impl"
  : "../../services/academic/exams.service";

const {
  getAllExamService,
  createExamService,
  getExamByIdService,
  updateExamService,
} = require(servicePath);

/**
 * @desc Create new exam
 * @route POST /api/v1/exams
 * @access Private (Teacher Only)
 **/
exports.createExamController = async (req, res) => {
  try {
    await createExamService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get all exams
 * @route GET /api/v1/exams
 * @access Private (Teacher Only)
 **/
exports.getAllExamController = async (req, res) => {
  try {
    const result = await getAllExamService();
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get exam by ID
 * @route GET /api/v1/exams/:examId
 * @access Private (Teacher Only)
 **/
exports.getExamByIdController = async (req, res) => {
  try {
    const result = await getExamByIdService(req.params.examId);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Update Exam
 * @route PATCH /api/v1/exams/:id
 * @access Private (Teacher Only)
 **/
exports.updateExamController = async (req, res) => {
  try {
    await updateExamService(req.body, req.params.examId, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};
