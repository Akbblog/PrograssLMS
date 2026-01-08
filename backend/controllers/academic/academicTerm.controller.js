const responseStatus = require("../../handlers/responseStatus.handler.js");

// Dynamically load service based on USE_PRISMA flag
const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
const servicePath = usePrisma 
  ? "../../services/academic/academicTerm.service.prisma_impl"
  : "../../services/academic/academicTerm.service";

const {
  createAcademicTermService,
  getAcademicTermsService,
  getAcademicTermService,
  updateAcademicTermService,
  deleteAcademicTermService,
} = require(servicePath);

/**
 * @desc Create Academic Term
 * @route POST /api/v1/academic-term
 * @access Private
 **/
exports.createAcademicTermController = async (req, res) => {
  try {
    await createAcademicTermService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get all Academic Terms
 * @route GET /api/v1/academic-Terms
 * @access Private
 **/
exports.getAcademicTermsController = async (req, res) => {
  try {
    const result = await getAcademicTermsService(req.schoolId);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get single Academic Term
 * @route GET /api/v1/academic-Terms/:id
 * @access Private
 **/
exports.getAcademicTermController = async (req, res) => {
  try {
    const result = await getAcademicTermService(req.params.id);
    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Update Academic Term
 * @route Patch /api/v1/academic-Terms/:id
 * @access Private
 **/
exports.updateAcademicTermController = async (req, res) => {
  try {
    await updateAcademicTermService(
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
 * @desc Delete Academic Term
 * @route Delete /api/v1/academic-Terms/:id
 * @access Private
 **/
exports.deleteAcademicTermController = async (req, res) => {
  try {
    const result = await deleteAcademicTermService(req.params.id);
    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};
