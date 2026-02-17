const { getPrisma } = require("../../lib/prismaClient");
const responseStatus = require("../../handlers/responseStatus.handler.js");

function parseJSON(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value);
  } catch (_e) {
    return fallback;
  }
}

function toIdArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map((v) => String(v));
  if (typeof value === "string" && value.trim()) {
    const parsed = parseJSON(value, null);
    if (Array.isArray(parsed)) return parsed.filter(Boolean).map((v) => String(v));
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => String(v));
  }
  return [];
}

function toStringArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    const parsed = parseJSON(value, null);
    if (Array.isArray(parsed)) return parsed.filter(Boolean).map((v) => String(v).trim()).filter(Boolean);
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

function asInt(value, fallback = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.round(n);
}

function asFloat(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toNullableId(value) {
  if (value == null) return null;
  const str = String(value).trim();
  return str ? str : null;
}

function normalizeTeacherRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name || [row.firstName, row.lastName].filter(Boolean).join(" ").trim() || "Teacher",
    email: row.email || null,
  };
}

function normalizeSubjectRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
  };
}

function normalizeClassLevelRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    section: row.section || null,
  };
}

function normalizeCompletionRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    student: row.studentId,
    completedAt: row.completedAt,
    watchTime: row.watchTime || 0,
  };
}

function normalizeLessonRow(lesson, completionsByLesson = {}) {
  const completions = completionsByLesson[lesson.id] || [];
  return {
    _id: lesson.id,
    id: lesson.id,
    title: lesson.title,
    description: lesson.description || "",
    sequence: lesson.sequence,
    type: lesson.type || "video",
    content: parseJSON(lesson.content, {}),
    duration: lesson.duration || 0,
    module: lesson.moduleId,
    moduleId: lesson.moduleId,
    isPreview: Boolean(lesson.isPreview),
    isRequired: Boolean(lesson.isRequired),
    resources: parseJSON(lesson.resources, []),
    completions,
    schoolId: lesson.schoolId,
    createdAt: lesson.createdAt,
    updatedAt: lesson.updatedAt,
  };
}

function normalizeModuleRow(module, lessonsByModule = {}, completionsByLesson = {}) {
  const lessons = (lessonsByModule[module.id] || [])
    .map((lesson) => normalizeLessonRow(lesson, completionsByLesson))
    .sort((a, b) => a.sequence - b.sequence);

  return {
    _id: module.id,
    id: module.id,
    title: module.title,
    description: module.description || "",
    sequence: module.sequence,
    course: module.courseId,
    courseId: module.courseId,
    lessons,
    duration: module.duration || 0,
    isRequired: Boolean(module.isRequired),
    schoolId: module.schoolId,
    createdAt: module.createdAt,
    updatedAt: module.updatedAt,
  };
}

function normalizeCourseRow(course, context = {}) {
  const {
    modulesByCourse = {},
    lessonsByModule = {},
    completionsByLesson = {},
    subjectById = {},
    teacherById = {},
    classLevelById = {},
  } = context;

  const classLevelIds = toIdArray(course.classLevels);
  const classLevels = classLevelIds
    .map((id) => classLevelById[id])
    .filter(Boolean)
    .map(normalizeClassLevelRow);

  const modules = (modulesByCourse[course.id] || [])
    .map((module) => normalizeModuleRow(module, lessonsByModule, completionsByLesson))
    .sort((a, b) => a.sequence - b.sequence);

  return {
    _id: course.id,
    id: course.id,
    title: course.title,
    description: course.description || "",
    thumbnail: course.thumbnail || null,
    category: course.category || "",
    difficulty: course.difficulty || "beginner",
    subject: normalizeSubjectRow(subjectById[course.subjectId]),
    classLevels,
    instructor: normalizeTeacherRow(teacherById[course.instructorId]),
    modules,
    estimatedHours: asFloat(course.estimatedHours, 0),
    prerequisites: toIdArray(course.prerequisites),
    tags: toStringArray(course.tags),
    status: course.status || "draft",
    publishedAt: course.publishedAt || null,
    enrolledStudents: [],
    settings: {
      allowEnrollment: Boolean(course.allowEnrollment),
      requireCompletion: Boolean(course.requireCompletion),
      showProgress: Boolean(course.showProgress),
      certificate: Boolean(course.certificate),
    },
    schoolId: course.schoolId,
    createdBy: course.createdBy,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}

async function hydrateCourses(prisma, courses = [], options = {}) {
  if (!Array.isArray(courses) || courses.length === 0) return [];

  const includeCompletions = Boolean(options.includeCompletions);
  const courseIds = courses.map((course) => course.id);

  const modules = await prisma.courseModule.findMany({
    where: { courseId: { in: courseIds } },
    orderBy: [{ sequence: "asc" }, { createdAt: "asc" }],
  });

  const moduleIds = modules.map((module) => module.id);
  const lessons = moduleIds.length
    ? await prisma.courseLesson.findMany({
        where: { moduleId: { in: moduleIds } },
        orderBy: [{ sequence: "asc" }, { createdAt: "asc" }],
      })
    : [];

  const lessonIds = lessons.map((lesson) => lesson.id);
  const completions = includeCompletions && lessonIds.length
    ? await prisma.courseLessonCompletion.findMany({
        where: { lessonId: { in: lessonIds } },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  const subjectIds = [...new Set(courses.map((course) => course.subjectId).filter(Boolean))];
  const teacherIds = [...new Set(courses.map((course) => course.instructorId).filter(Boolean))];
  const classLevelIds = [
    ...new Set(
      courses
        .flatMap((course) => toIdArray(course.classLevels))
        .filter(Boolean)
    ),
  ];

  const [subjects, teachers, classLevels] = await Promise.all([
    subjectIds.length
      ? prisma.subject.findMany({ where: { id: { in: subjectIds } }, select: { id: true, name: true } })
      : [],
    teacherIds.length
      ? prisma.teacher.findMany({
          where: { id: { in: teacherIds } },
          select: { id: true, name: true, firstName: true, lastName: true, email: true },
        })
      : [],
    classLevelIds.length
      ? prisma.classLevel.findMany({ where: { id: { in: classLevelIds } }, select: { id: true, name: true, section: true } })
      : [],
  ]);

  const modulesByCourse = {};
  for (const module of modules) {
    if (!modulesByCourse[module.courseId]) modulesByCourse[module.courseId] = [];
    modulesByCourse[module.courseId].push(module);
  }

  const lessonsByModule = {};
  for (const lesson of lessons) {
    if (!lessonsByModule[lesson.moduleId]) lessonsByModule[lesson.moduleId] = [];
    lessonsByModule[lesson.moduleId].push(lesson);
  }

  const completionsByLesson = {};
  for (const completion of completions) {
    if (!completionsByLesson[completion.lessonId]) completionsByLesson[completion.lessonId] = [];
    completionsByLesson[completion.lessonId].push(normalizeCompletionRow(completion));
  }

  const subjectById = subjects.reduce((acc, subject) => {
    acc[subject.id] = subject;
    return acc;
  }, {});

  const teacherById = teachers.reduce((acc, teacher) => {
    acc[teacher.id] = teacher;
    return acc;
  }, {});

  const classLevelById = classLevels.reduce((acc, classLevel) => {
    acc[classLevel.id] = classLevel;
    return acc;
  }, {});

  return courses.map((course) =>
    normalizeCourseRow(course, {
      modulesByCourse,
      lessonsByModule,
      completionsByLesson,
      subjectById,
      teacherById,
      classLevelById,
    })
  );
}

function buildCourseCreateData(data = {}, schoolId, createdBy) {
  const statusValues = ["draft", "published", "archived"];
  const difficultyValues = ["beginner", "intermediate", "advanced"];
  const status = statusValues.includes(data.status) ? data.status : "draft";
  const difficulty = difficultyValues.includes(data.difficulty) ? data.difficulty : "beginner";

  const settings = data.settings || {};
  return {
    title: data.title,
    description: data.description || null,
    thumbnail: data.thumbnail || null,
    category: data.category || null,
    difficulty,
    subjectId: toNullableId(data.subject),
    classLevels: JSON.stringify(toIdArray(data.classLevels)),
    instructorId: toNullableId(data.instructor),
    estimatedHours: asFloat(data.estimatedHours, 0),
    prerequisites: JSON.stringify(toIdArray(data.prerequisites)),
    tags: JSON.stringify(toStringArray(data.tags)),
    status,
    publishedAt: status === "published" ? new Date() : null,
    allowEnrollment:
      data.allowEnrollment != null ? Boolean(data.allowEnrollment) : settings.allowEnrollment != null ? Boolean(settings.allowEnrollment) : true,
    requireCompletion:
      data.requireCompletion != null ? Boolean(data.requireCompletion) : settings.requireCompletion != null ? Boolean(settings.requireCompletion) : false,
    showProgress:
      data.showProgress != null ? Boolean(data.showProgress) : settings.showProgress != null ? Boolean(settings.showProgress) : true,
    certificate:
      data.certificate != null ? Boolean(data.certificate) : settings.certificate != null ? Boolean(settings.certificate) : false,
    schoolId: String(schoolId),
    createdBy: String(createdBy),
  };
}

// ============ COURSE SERVICES ============

exports.createCourseService = async (data, userId, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, "failed", "Database unavailable");
  if (!data?.title) return responseStatus(res, 400, "failed", "Course title is required");

  const admin = await prisma.admin.findUnique({
    where: { id: String(userId) },
    select: { id: true, schoolId: true },
  });

  if (!admin) return responseStatus(res, 401, "failed", "Admin not found");
  if (!admin.schoolId) return responseStatus(res, 400, "failed", "No school associated with this admin");

  const created = await prisma.course.create({
    data: buildCourseCreateData(data, admin.schoolId, userId),
  });

  const [hydrated] = await hydrateCourses(prisma, [created]);
  return responseStatus(res, 201, "success", hydrated);
};

exports.getAllCoursesService = async (schoolId, filters = {}) => {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Database unavailable");

  const where = {};
  if (schoolId) where.schoolId = String(schoolId);
  if (filters.status) where.status = String(filters.status);
  if (filters.category) where.category = String(filters.category);
  if (filters.difficulty) where.difficulty = String(filters.difficulty);

  const courses = await prisma.course.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return await hydrateCourses(prisma, courses);
};

exports.getCourseService = async (id) => {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Database unavailable");

  const course = await prisma.course.findUnique({
    where: { id: String(id) },
  });
  if (!course) return null;

  const [hydrated] = await hydrateCourses(prisma, [course], { includeCompletions: true });
  return hydrated || null;
};

exports.updateCourseService = async (data, id, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, "failed", "Database unavailable");

  const current = await prisma.course.findUnique({ where: { id: String(id) } });
  if (!current) return responseStatus(res, 404, "failed", "Course not found");

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail || null;
  if (data.category !== undefined) updateData.category = data.category || null;
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty || "beginner";
  if (data.subject !== undefined) updateData.subjectId = toNullableId(data.subject);
  if (data.classLevels !== undefined) updateData.classLevels = JSON.stringify(toIdArray(data.classLevels));
  if (data.instructor !== undefined) updateData.instructorId = toNullableId(data.instructor);
  if (data.estimatedHours !== undefined) updateData.estimatedHours = asFloat(data.estimatedHours, 0);
  if (data.prerequisites !== undefined) updateData.prerequisites = JSON.stringify(toIdArray(data.prerequisites));
  if (data.tags !== undefined) updateData.tags = JSON.stringify(toStringArray(data.tags));

  if (data.status !== undefined) {
    updateData.status = data.status;
    if (String(data.status) === "published" && !current.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  if (data.settings !== undefined || data.allowEnrollment !== undefined || data.requireCompletion !== undefined || data.showProgress !== undefined || data.certificate !== undefined) {
    const settings = data.settings || {};
    if (data.allowEnrollment !== undefined || settings.allowEnrollment !== undefined) {
      updateData.allowEnrollment = data.allowEnrollment !== undefined ? Boolean(data.allowEnrollment) : Boolean(settings.allowEnrollment);
    }
    if (data.requireCompletion !== undefined || settings.requireCompletion !== undefined) {
      updateData.requireCompletion = data.requireCompletion !== undefined ? Boolean(data.requireCompletion) : Boolean(settings.requireCompletion);
    }
    if (data.showProgress !== undefined || settings.showProgress !== undefined) {
      updateData.showProgress = data.showProgress !== undefined ? Boolean(data.showProgress) : Boolean(settings.showProgress);
    }
    if (data.certificate !== undefined || settings.certificate !== undefined) {
      updateData.certificate = data.certificate !== undefined ? Boolean(data.certificate) : Boolean(settings.certificate);
    }
  }

  const updated = await prisma.course.update({
    where: { id: String(id) },
    data: updateData,
  });

  const [hydrated] = await hydrateCourses(prisma, [updated]);
  return responseStatus(res, 200, "success", hydrated);
};

exports.deleteCourseService = async (id, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, "failed", "Database unavailable");

  const course = await prisma.course.findUnique({ where: { id: String(id) } });
  if (!course) return responseStatus(res, 404, "failed", "Course not found");

  await prisma.$transaction(async (tx) => {
    const modules = await tx.courseModule.findMany({
      where: { courseId: String(id) },
      select: { id: true },
    });
    const moduleIds = modules.map((module) => module.id);

    if (moduleIds.length > 0) {
      const lessons = await tx.courseLesson.findMany({
        where: { moduleId: { in: moduleIds } },
        select: { id: true },
      });
      const lessonIds = lessons.map((lesson) => lesson.id);

      if (lessonIds.length > 0) {
        await tx.courseLessonCompletion.deleteMany({ where: { lessonId: { in: lessonIds } } });
        await tx.courseLesson.deleteMany({ where: { id: { in: lessonIds } } });
      }

      await tx.courseModule.deleteMany({ where: { id: { in: moduleIds } } });
    }

    await tx.course.delete({ where: { id: String(id) } });
  });

  return responseStatus(res, 200, "success", { message: "Course deleted successfully" });
};

exports.publishCourseService = async (id, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, "failed", "Database unavailable");

  const course = await prisma.course.findUnique({ where: { id: String(id) } });
  if (!course) return responseStatus(res, 404, "failed", "Course not found");

  const updated = await prisma.course.update({
    where: { id: String(id) },
    data: {
      status: "published",
      publishedAt: new Date(),
    },
  });

  const [hydrated] = await hydrateCourses(prisma, [updated]);
  return responseStatus(res, 200, "success", hydrated);
};

// ============ MODULE SERVICES ============

exports.createModuleService = async (data, courseId, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, "failed", "Database unavailable");

  const course = await prisma.course.findUnique({ where: { id: String(courseId) } });
  if (!course) return responseStatus(res, 404, "failed", "Course not found");

  const moduleCount = await prisma.courseModule.count({ where: { courseId: String(courseId) } });
  const sequence = data?.sequence != null ? Math.max(1, asInt(data.sequence, 1)) : moduleCount + 1;

  const created = await prisma.courseModule.create({
    data: {
      title: data?.title || "New Module",
      description: data?.description || null,
      sequence,
      courseId: String(courseId),
      duration: 0,
      isRequired: data?.isRequired !== false,
      schoolId: course.schoolId,
    },
  });

  return responseStatus(res, 201, "success", normalizeModuleRow(created, {}, {}));
};

exports.updateModuleService = async (data, id, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, "failed", "Database unavailable");

  const existing = await prisma.courseModule.findUnique({ where: { id: String(id) } });
  if (!existing) return responseStatus(res, 404, "failed", "Module not found");

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.sequence !== undefined) updateData.sequence = Math.max(1, asInt(data.sequence, existing.sequence));
  if (data.isRequired !== undefined) updateData.isRequired = Boolean(data.isRequired);

  const updated = await prisma.courseModule.update({
    where: { id: String(id) },
    data: updateData,
  });

  const lessons = await prisma.courseLesson.findMany({
    where: { moduleId: updated.id },
    orderBy: [{ sequence: "asc" }, { createdAt: "asc" }],
  });

  return responseStatus(res, 200, "success", normalizeModuleRow(updated, { [updated.id]: lessons }, {}));
};

exports.deleteModuleService = async (id, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, "failed", "Database unavailable");

  const module = await prisma.courseModule.findUnique({ where: { id: String(id) } });
  if (!module) return responseStatus(res, 404, "failed", "Module not found");

  await prisma.$transaction(async (tx) => {
    const lessons = await tx.courseLesson.findMany({
      where: { moduleId: String(id) },
      select: { id: true },
    });
    const lessonIds = lessons.map((lesson) => lesson.id);

    if (lessonIds.length > 0) {
      await tx.courseLessonCompletion.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await tx.courseLesson.deleteMany({ where: { id: { in: lessonIds } } });
    }

    await tx.courseModule.delete({ where: { id: String(id) } });
  });

  return responseStatus(res, 200, "success", { message: "Module deleted successfully" });
};

// ============ LESSON SERVICES ============

exports.createLessonService = async (data, moduleId, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, "failed", "Database unavailable");

  const module = await prisma.courseModule.findUnique({ where: { id: String(moduleId) } });
  if (!module) return responseStatus(res, 404, "failed", "Module not found");

  const lessonCount = await prisma.courseLesson.count({ where: { moduleId: String(moduleId) } });
  const sequence = data?.sequence != null ? Math.max(1, asInt(data.sequence, 1)) : lessonCount + 1;
  const duration = Math.max(0, asInt(data?.duration, 0));

  const created = await prisma.$transaction(async (tx) => {
    const lesson = await tx.courseLesson.create({
      data: {
        title: data?.title || "New Lesson",
        description: data?.description || null,
        sequence,
        type: data?.type || "video",
        content: JSON.stringify(data?.content || {}),
        duration,
        moduleId: String(moduleId),
        isPreview: Boolean(data?.isPreview),
        isRequired: data?.isRequired !== false,
        resources: JSON.stringify(Array.isArray(data?.resources) ? data.resources : []),
        schoolId: module.schoolId,
      },
    });

    await tx.courseModule.update({
      where: { id: String(moduleId) },
      data: { duration: { increment: duration } },
    });

    return lesson;
  });

  return responseStatus(res, 201, "success", normalizeLessonRow(created, {}));
};

exports.updateLessonService = async (data, id, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, "failed", "Database unavailable");

  const existing = await prisma.courseLesson.findUnique({ where: { id: String(id) } });
  if (!existing) return responseStatus(res, 404, "failed", "Lesson not found");

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.sequence !== undefined) updateData.sequence = Math.max(1, asInt(data.sequence, existing.sequence));
  if (data.type !== undefined) updateData.type = data.type || existing.type;
  if (data.content !== undefined) updateData.content = JSON.stringify(data.content || {});
  if (data.isPreview !== undefined) updateData.isPreview = Boolean(data.isPreview);
  if (data.isRequired !== undefined) updateData.isRequired = Boolean(data.isRequired);
  if (data.resources !== undefined) updateData.resources = JSON.stringify(Array.isArray(data.resources) ? data.resources : []);

  const nextDuration = data.duration !== undefined ? Math.max(0, asInt(data.duration, existing.duration || 0)) : existing.duration || 0;
  updateData.duration = nextDuration;
  const durationDelta = nextDuration - (existing.duration || 0);

  const updated = await prisma.$transaction(async (tx) => {
    const lesson = await tx.courseLesson.update({
      where: { id: String(id) },
      data: updateData,
    });

    if (durationDelta !== 0) {
      await tx.courseModule.update({
        where: { id: lesson.moduleId },
        data: { duration: { increment: durationDelta } },
      });
    }

    return lesson;
  });

  const completions = await prisma.courseLessonCompletion.findMany({
    where: { lessonId: updated.id },
    orderBy: { updatedAt: "desc" },
  });
  const completionMap = {
    [updated.id]: completions.map(normalizeCompletionRow),
  };

  return responseStatus(res, 200, "success", normalizeLessonRow(updated, completionMap));
};

exports.deleteLessonService = async (id, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, "failed", "Database unavailable");

  const lesson = await prisma.courseLesson.findUnique({ where: { id: String(id) } });
  if (!lesson) return responseStatus(res, 404, "failed", "Lesson not found");

  await prisma.$transaction(async (tx) => {
    await tx.courseLessonCompletion.deleteMany({ where: { lessonId: String(id) } });
    await tx.courseLesson.delete({ where: { id: String(id) } });
    if (lesson.duration) {
      await tx.courseModule.update({
        where: { id: lesson.moduleId },
        data: {
          duration: { decrement: Math.max(0, lesson.duration) },
        },
      });
    }
  });

  return responseStatus(res, 200, "success", { message: "Lesson deleted successfully" });
};

exports.markLessonCompleteService = async (lessonId, studentId, watchTime, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, "failed", "Database unavailable");

  const lesson = await prisma.courseLesson.findUnique({ where: { id: String(lessonId) } });
  if (!lesson) return responseStatus(res, 404, "failed", "Lesson not found");

  const completion = await prisma.courseLessonCompletion.upsert({
    where: {
      lessonId_studentId: {
        lessonId: String(lessonId),
        studentId: String(studentId),
      },
    },
    update: {
      completedAt: new Date(),
      watchTime: watchTime != null ? Math.max(0, asInt(watchTime, 0)) : undefined,
    },
    create: {
      lessonId: String(lessonId),
      studentId: String(studentId),
      completedAt: new Date(),
      watchTime: watchTime != null ? Math.max(0, asInt(watchTime, 0)) : 0,
      schoolId: lesson.schoolId,
    },
  });

  return responseStatus(res, 200, "success", {
    message: "Lesson marked as complete",
    completion: normalizeCompletionRow(completion),
  });
};
