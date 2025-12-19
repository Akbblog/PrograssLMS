const responseStatus = require("../../handlers/responseStatus.handler");
const {
  createClassLevelService,
  getAllClassesService,
  getClassLevelsService,
  deleteClassLevelService,
  updateClassLevelService,
  getSubjectsByClassService,
  getTeachersByClassService,
  assignSubjectToClassService,
  removeSubjectFromClassService,
} = require("../../services/academic/class.service");

/**
 * @desc Create Class Level
 * @route POST /api/v1/class-levels
 * @access Private
 **/
exports.createClassLevelController = async (req, res) => {
  try {
    await createClassLevelService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get all Class Levels
 * @route GET /api/v1/class-levels
 * @access Private
 **/
exports.getClassLevelsController = async (req, res) => {
  try {
    // Pass schoolId for multi-tenancy filtering
    const result = await getAllClassesService(req.schoolId);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get single Class Level
 * @route GET /api/v1/class-levels/:id
 * @access Private
 **/
exports.getClassLevelController = async (req, res) => {
  try {
    const result = await getClassLevelsService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Update Class Level
 * @route Patch /api/v1/class-levels/:id
 * @access Private
 **/
exports.updateClassLevelController = async (req, res) => {
  try {
    await updateClassLevelService(
      req.body,
      req.params.id,
      req.userAuth.id,
      res
    );
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Delete Class Level
 * @route Delete /api/v1/class-levels/:id
 * @access Private
 **/
exports.deleteClassLevelController = async (req, res) => {
  try {
    const result = await deleteClassLevelService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get subjects for a class
 * @route GET /api/v1/admin/subjects-by-class/:classId
 * @access Private
 **/
exports.getSubjectsByClassController = async (req, res) => {
  try {
    const result = await getSubjectsByClassService(req.params.classId, req.schoolId);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get teachers for a class
 * @route GET /api/v1/admin/teachers-by-class/:classId
 * @access Private
 **/
exports.getTeachersByClassController = async (req, res) => {
  try {
    const result = await getTeachersByClassService(req.params.classId, req.schoolId);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Assign a subject to a class
 * @route POST /api/v1/class-levels/:classId/subjects/:subjectId
 * @access Private
 **/
exports.assignSubjectToClassController = async (req, res) => {
  try {
    await assignSubjectToClassService(req.params.classId, req.params.subjectId, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Remove a subject from a class
 * @route DELETE /api/v1/class-levels/:classId/subjects/:subjectId
 * @access Private
 **/
exports.removeSubjectFromClassController = async (req, res) => {
  try {
    await removeSubjectFromClassService(req.params.classId, req.params.subjectId, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};
