const responseStatus = require("../../handlers/responseStatus.handler.js");

// Dynamically load service based on USE_PRISMA flag
const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
const servicePath = usePrisma 
  ? "../../services/academic/program.service.prisma_impl"
  : "../../services/academic/program.service";

const {
  createProgramService,
  getAllProgramsService,
  getProgramsService,
  updateProgramService,
  deleteProgramService,
} = require(servicePath);

/**
 * @desc Create Program
 * @route POST /api/v1/programs
 * @access Private
 **/
exports.createProgramController = async (req, res) => {
  try {
    await createProgramService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get all programs
 * @route GET /api/v1/programs
 * @access Private
 **/
exports.getProgramsController = async (req, res) => {
  try {
    const schoolId = req.userAuth?.schoolId;
    const result = await getAllProgramsService(schoolId);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get single Program
 * @route GET /api/v1/programs/:id
 * @access Private
 **/
exports.getProgramController = async (req, res) => {
  try {
    const result = await getProgramsService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Update Program
 * @route Patch /api/v1/programs/:id
 * @access Private
 **/
exports.updateProgramController = async (req, res) => {
  try {
    await updateProgramService(req.body, req.params.id, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Delete Program
 * @route Delete /api/v1/programs/:id
 * @access Private
 **/
exports.deleteProgramController = async (req, res) => {
  try {
    const result = await deleteProgramService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};
