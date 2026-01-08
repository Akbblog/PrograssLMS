const responseStatus = require("../../handlers/responseStatus.handler.js");

// Dynamically load service based on USE_PRISMA flag
const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
const servicePath = usePrisma
    ? "../../services/academic/course.service.prisma_impl"
    : "../../services/academic/course.service";

const {
    createCourseService,
    getAllCoursesService,
    getCourseService,
    updateCourseService,
    deleteCourseService,
    publishCourseService,
    createModuleService,
    updateModuleService,
    deleteModuleService,
    createLessonService,
    updateLessonService,
    deleteLessonService,
    markLessonCompleteService,
} = require(servicePath);

// ============ COURSE CONTROLLERS ============

/**
 * @desc Create Course
 * @route POST /api/v1/courses
 * @access Private (Admin)
 */
exports.createCourseController = async (req, res) => {
    try {
        await createCourseService(req.body, req.userAuth.id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get All Courses
 * @route GET /api/v1/courses
 * @access Private (Admin)
 */
exports.getAllCoursesController = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            category: req.query.category,
            difficulty: req.query.difficulty,
        };
        const result = await getAllCoursesService(req.schoolId, filters);
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get Single Course
 * @route GET /api/v1/courses/:id
 * @access Private
 */
exports.getCourseController = async (req, res) => {
    try {
        const result = await getCourseService(req.params.id);
        if (!result) {
            return responseStatus(res, 404, "failed", "Course not found");
        }
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Update Course
 * @route PATCH /api/v1/courses/:id
 * @access Private (Admin)
 */
exports.updateCourseController = async (req, res) => {
    try {
        await updateCourseService(req.body, req.params.id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Delete Course
 * @route DELETE /api/v1/courses/:id
 * @access Private (Admin)
 */
exports.deleteCourseController = async (req, res) => {
    try {
        await deleteCourseService(req.params.id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Publish Course
 * @route POST /api/v1/courses/:id/publish
 * @access Private (Admin)
 */
exports.publishCourseController = async (req, res) => {
    try {
        await publishCourseService(req.params.id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

// ============ MODULE CONTROLLERS ============

/**
 * @desc Create Module
 * @route POST /api/v1/courses/:courseId/modules
 * @access Private (Admin)
 */
exports.createModuleController = async (req, res) => {
    try {
        await createModuleService(req.body, req.params.courseId, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Update Module
 * @route PATCH /api/v1/modules/:id
 * @access Private (Admin)
 */
exports.updateModuleController = async (req, res) => {
    try {
        await updateModuleService(req.body, req.params.id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Delete Module
 * @route DELETE /api/v1/modules/:id
 * @access Private (Admin)
 */
exports.deleteModuleController = async (req, res) => {
    try {
        await deleteModuleService(req.params.id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

// ============ LESSON CONTROLLERS ============

/**
 * @desc Create Lesson
 * @route POST /api/v1/modules/:moduleId/lessons
 * @access Private (Admin)
 */
exports.createLessonController = async (req, res) => {
    try {
        await createLessonService(req.body, req.params.moduleId, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Update Lesson
 * @route PATCH /api/v1/lessons/:id
 * @access Private (Admin)
 */
exports.updateLessonController = async (req, res) => {
    try {
        await updateLessonService(req.body, req.params.id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Delete Lesson
 * @route DELETE /api/v1/lessons/:id
 * @access Private (Admin)
 */
exports.deleteLessonController = async (req, res) => {
    try {
        await deleteLessonService(req.params.id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Mark Lesson Complete
 * @route POST /api/v1/lessons/:id/complete
 * @access Private (Student)
 */
exports.markLessonCompleteController = async (req, res) => {
    try {
        await markLessonCompleteService(
            req.params.id,
            req.userAuth.id,
            req.body.watchTime,
            res
        );
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};
