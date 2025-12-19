const responseStatus = require("../../handlers/responseStatus.handler");
const {
  createSubjectService,
  createSimpleSubjectService,
  getAllSubjectsService,
  getSubjectsService,
  deleteSubjectService,
  updateSubjectService,
} = require("../../services/academic/subject.service");

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
