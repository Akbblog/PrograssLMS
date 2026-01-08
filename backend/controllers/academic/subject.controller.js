const responseStatus = require("../../handlers/responseStatus.handler.js");

// Dynamically load service based on USE_PRISMA flag
const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
const servicePath = usePrisma 
  ? "../../services/academic/subject.service.prisma_impl"
  : "../../services/academic/subject.service";

const {
  createSubjectService,
  createSimpleSubjectService,
  getAllSubjectsService,
  getSubjectsService,
  deleteSubjectService,
  updateSubjectService,
} = require(servicePath);

/**
 * @desc Create Subject (Simple - without program)
 * @route POST /api/v1/subjects
 * @access Private
 **/
exports.createSimpleSubjectController = async (req, res) => {
  try {
    await createSimpleSubjectService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Create Subject
 * @route POST /api/v1/create-subject/:programId
 * @access Private
 **/
exports.createSubjectController = async (req, res) => {
  try {
    await createSubjectService(
      req.body,
      req.params.programId,
      req.userAuth.id,
      res
    );
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get all Subjects
 * @route GET /api/v1/subject
 * @access Private
 **/
exports.getSubjectsController = async (req, res) => {
  try {
    // Pass schoolId for multi-tenancy filtering
    const result = await getAllSubjectsService(req.schoolId);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get single Subject
 * @route GET /api/v1/subject/:id
 * @access Private
 **/
exports.getSubjectController = async (req, res) => {
  try {
    const result = await getSubjectsService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Update Subject
 * @route Patch /api/v1/subject/:id
 * @access Private
 **/
exports.updateSubjectController = async (req, res) => {
  try {
    await updateSubjectService(req.body, req.params.id, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Delete Subject
 * @route Delete /api/v1/subject/:id
 * @access Private
 **/
exports.deleteSubjectController = async (req, res) => {
  try {
    const result = await deleteSubjectService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};
