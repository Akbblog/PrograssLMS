const Course = require("../../models/Academic/Course.model");
const Module = require("../../models/Academic/Module.model");
const Lesson = require("../../models/Academic/Lesson.model");
const Admin = require("../../models/Staff/admin.model");
const responseStatus = require("../../handlers/responseStatus.handler");

/**
 * Create Course Service
 */
exports.createCourseService = async (data, userId, res) => {
    const {
        title, description, thumbnail, category, difficulty,
        subject, classLevels, instructor, estimatedHours, tags, status
    } = data;

    // Get admin's schoolId
    const admin = await Admin.findById(userId);
    if (!admin) {
        return responseStatus(res, 401, "failed", "Admin not found");
    }

    const schoolId = admin.schoolId;
    if (!schoolId) {
        return responseStatus(res, 400, "failed", "No school associated with this admin");
    }

    // Create course
    const course = await Course.create({
        title,
        description,
        thumbnail,
        category,
        difficulty: difficulty || "beginner",
        subject,
        classLevels: classLevels || [],
        instructor,
        estimatedHours: estimatedHours || 0,
        tags: tags || [],
        status: status || "draft",
        schoolId,
        createdBy: userId,
    });

    return responseStatus(res, 201, "success", course);
};

/**
 * Get All Courses Service
 */
exports.getAllCoursesService = async (schoolId, filters = {}) => {
    const query = schoolId ? { schoolId } : {};

    if (filters.status) query.status = filters.status;
    if (filters.category) query.category = filters.category;
    if (filters.difficulty) query.difficulty = filters.difficulty;

    return await Course.find(query)
        .populate("subject", "name")
        .populate("classLevels", "name")
        .populate("instructor", "name email")
        .populate("modules")
        .sort({ createdAt: -1 });
};

/**
 * Get Single Course Service
 */
exports.getCourseService = async (id) => {
    return await Course.findById(id)
        .populate("subject", "name")
        .populate("classLevels", "name")
        .populate("instructor", "name email")
        .populate({
            path: "modules",
            populate: {
                path: "lessons",
                model: "Lesson"
            }
        });
};

/**
 * Update Course Service
 */
exports.updateCourseService = async (data, id, res) => {
    const course = await Course.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
    );

    if (!course) {
        return responseStatus(res, 404, "failed", "Course not found");
    }

    return responseStatus(res, 200, "success", course);
};

/**
 * Delete Course Service
 */
exports.deleteCourseService = async (id, res) => {
    // First delete all modules and lessons
    const course = await Course.findById(id);
    if (!course) {
        return responseStatus(res, 404, "failed", "Course not found");
    }

    // Delete all lessons in all modules
    for (const moduleId of course.modules) {
        await Lesson.deleteMany({ module: moduleId });
    }

    // Delete all modules
    await Module.deleteMany({ course: id });

    // Delete course
    await Course.findByIdAndDelete(id);

    return responseStatus(res, 200, "success", { message: "Course deleted successfully" });
};

/**
 * Publish Course Service
 */
exports.publishCourseService = async (id, res) => {
    const course = await Course.findByIdAndUpdate(
        id,
        {
            status: "published",
            publishedAt: new Date()
        },
        { new: true }
    );

    if (!course) {
        return responseStatus(res, 404, "failed", "Course not found");
    }

    return responseStatus(res, 200, "success", course);
};

// ============ MODULE SERVICES ============

/**
 * Create Module Service
 */
exports.createModuleService = async (data, courseId, res) => {
    const { title, description, sequence, isRequired } = data;

    const course = await Course.findById(courseId);
    if (!course) {
        return responseStatus(res, 404, "failed", "Course not found");
    }

    // Get next sequence number if not provided
    const nextSequence = sequence || (await Module.countDocuments({ course: courseId })) + 1;

    const module = await Module.create({
        title,
        description,
        sequence: nextSequence,
        course: courseId,
        isRequired: isRequired !== false,
        schoolId: course.schoolId,
    });

    // Add module to course
    course.modules.push(module._id);
    await course.save();

    return responseStatus(res, 201, "success", module);
};

/**
 * Update Module Service
 */
exports.updateModuleService = async (data, id, res) => {
    const module = await Module.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
    );

    if (!module) {
        return responseStatus(res, 404, "failed", "Module not found");
    }

    return responseStatus(res, 200, "success", module);
};

/**
 * Delete Module Service
 */
exports.deleteModuleService = async (id, res) => {
    const module = await Module.findById(id);
    if (!module) {
        return responseStatus(res, 404, "failed", "Module not found");
    }

    // Delete all lessons in module
    await Lesson.deleteMany({ module: id });

    // Remove from course
    await Course.findByIdAndUpdate(module.course, {
        $pull: { modules: id }
    });

    // Delete module
    await Module.findByIdAndDelete(id);

    return responseStatus(res, 200, "success", { message: "Module deleted successfully" });
};

// ============ LESSON SERVICES ============

/**
 * Create Lesson Service
 */
exports.createLessonService = async (data, moduleId, res) => {
    const { title, description, type, content, duration, sequence, isPreview, isRequired, resources } = data;

    const module = await Module.findById(moduleId);
    if (!module) {
        return responseStatus(res, 404, "failed", "Module not found");
    }

    // Get next sequence number if not provided
    const nextSequence = sequence || (await Lesson.countDocuments({ module: moduleId })) + 1;

    const lesson = await Lesson.create({
        title,
        description,
        type: type || "video",
        content: content || {},
        duration: duration || 0,
        sequence: nextSequence,
        module: moduleId,
        isPreview: isPreview || false,
        isRequired: isRequired !== false,
        resources: resources || [],
        schoolId: module.schoolId,
    });

    // Add lesson to module
    module.lessons.push(lesson._id);
    module.duration = (module.duration || 0) + (duration || 0);
    await module.save();

    return responseStatus(res, 201, "success", lesson);
};

/**
 * Update Lesson Service
 */
exports.updateLessonService = async (data, id, res) => {
    const lesson = await Lesson.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
    );

    if (!lesson) {
        return responseStatus(res, 404, "failed", "Lesson not found");
    }

    return responseStatus(res, 200, "success", lesson);
};

/**
 * Delete Lesson Service
 */
exports.deleteLessonService = async (id, res) => {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
        return responseStatus(res, 404, "failed", "Lesson not found");
    }

    // Remove from module
    await Module.findByIdAndUpdate(lesson.module, {
        $pull: { lessons: id },
        $inc: { duration: -(lesson.duration || 0) }
    });

    // Delete lesson
    await Lesson.findByIdAndDelete(id);

    return responseStatus(res, 200, "success", { message: "Lesson deleted successfully" });
};

/**
 * Mark Lesson Complete Service
 */
exports.markLessonCompleteService = async (lessonId, studentId, watchTime, res) => {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        return responseStatus(res, 404, "failed", "Lesson not found");
    }

    // Check if already completed
    const existingCompletion = lesson.completions.find(
        c => c.student.toString() === studentId
    );

    if (existingCompletion) {
        existingCompletion.watchTime = watchTime || existingCompletion.watchTime;
    } else {
        lesson.completions.push({
            student: studentId,
            completedAt: new Date(),
            watchTime: watchTime || 0,
        });
    }

    await lesson.save();

    return responseStatus(res, 200, "success", { message: "Lesson marked as complete" });
};
