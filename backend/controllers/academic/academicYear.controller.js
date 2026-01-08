const responseStatus = require("../../handlers/responseStatus.handler.js");

// Dynamically load service based on USE_PRISMA flag
const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
const servicePath = usePrisma 
  ? "../../services/academic/academicYear.service.prisma_impl"
  : "../../services/academic/academicYear.service";

const {
  createAcademicYearService,
  getAcademicYearsService,
  getAcademicYearService,
  updateAcademicYearService,
  deleteAcademicYearService,
} = require(servicePath);

/**
 * @desc Create Academic Year
 * @route POST /api/v1/academic-years
 * @access Private
 **/
exports.createAcademicYearController = async (req, res) => {
  try {
    await createAcademicYearService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get all Academic Years
 * @route GET /api/v1/academic-years
 * @access Private
 **/
exports.getAcademicYearsController = async (req, res) => {
  try {
    const result = await getAcademicYearsService(req.schoolId);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get single Academic Year
 * @route GET /api/v1/academic-years/:id
 * @access Private
 **/
exports.getAcademicYearController = async (req, res) => {
  try {
    const result = await getAcademicYearService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Update Academic Year
 * @route Patch /api/v1/academic-years/:id
 * @access Private
 **/
exports.updateAcademicYearController = async (req, res) => {
  try {
    await updateAcademicYearService(req.body, req.params.id, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Delete Academic Year
 * @route Delete /api/v1/academic-years/:id
 * @access Private
 **/
exports.deleteAcademicYearController = async (req, res) => {
  try {
    const result = await deleteAcademicYearService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};
