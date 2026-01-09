const responseStatus = require("../../handlers/responseStatus.handler.js");
const { getPrismaOrThrow, ensureOnce, exec, query, uuid } = require("../prisma/raw");

async function ensureRoleTables(prisma) {
  await ensureOnce("role_tables_v1", async () => {
    await exec(
      prisma,
      `CREATE TABLE IF NOT EXISTS staff_roles (
        id VARCHAR(36) PRIMARY KEY,
        schoolId VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        color VARCHAR(32) NULL,
        permissions JSON NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'custom',
        isDeletable TINYINT(1) NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_role_name (schoolId, name),
        INDEX idx_school (schoolId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    );

    await exec(
      prisma,
      `CREATE TABLE IF NOT EXISTS teacher_role_assignments (
        id VARCHAR(36) PRIMARY KEY,
        schoolId VARCHAR(36) NOT NULL,
        teacherId VARCHAR(36) NOT NULL,
        roleId VARCHAR(36) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_teacher (schoolId, teacherId),
        INDEX idx_role (schoolId, roleId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    );
  });
}

async function getAdminSchoolId(prisma, adminId) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId }, select: { schoolId: true } });
  return admin?.schoolId || null;
}

async function createRoleService(roleData, userId, res) {
  try {
    const prisma = getPrismaOrThrow();
    await ensureRoleTables(prisma);

    const schoolId = await getAdminSchoolId(prisma, userId);
    if (!schoolId) return responseStatus(res, 403, "failed", "Access denied");

    const name = (roleData?.name || "").toString().trim();
    if (!name) return responseStatus(res, 400, "failed", "Role name is required");

    const roleId = uuid();
    const description = roleData?.description || null;
    const color = roleData?.color || "#6366f1";
    const permissions = roleData?.permissions || {};

    await exec(
      prisma,
      `INSERT INTO staff_roles (id, schoolId, name, description, color, permissions, type, isDeletable)
       VALUES (?, ?, ?, ?, ?, ?, 'custom', 1)`,
      roleId,
      schoolId,
      name,
      description,
      color,
      JSON.stringify(permissions)
    );

    return responseStatus(res, 201, "success", {
      _id: roleId,
      name,
      description,
      color,
      permissions,
      usersCount: 0,
      type: "custom",
      isDeletable: true,
    });
  } catch (error) {
    console.error("[Prisma role] createRoleService error:", error);
    return responseStatus(res, 400, "failed", error.message);
  }
}

async function getRolesService(schoolId) {
  const prisma = getPrismaOrThrow();
  await ensureRoleTables(prisma);

  const rows = await query(
    prisma,
    `SELECT r.*, COALESCE(cnt.usersCount, 0) AS usersCount
     FROM staff_roles r
     LEFT JOIN (
       SELECT roleId, COUNT(*) AS usersCount
       FROM teacher_role_assignments
       WHERE schoolId = ?
       GROUP BY roleId
     ) cnt ON cnt.roleId = r.id
     WHERE r.schoolId = ?
     ORDER BY r.createdAt DESC`,
    schoolId,
    schoolId
  );

  return rows.map((r) => ({
    _id: r.id,
    name: r.name,
    description: r.description || "",
    color: r.color || "#6366f1",
    permissions: r.permissions ? JSON.parse(r.permissions) : {},
    usersCount: Number(r.usersCount || 0),
    type: r.type === "system" ? "system" : "custom",
    isDeletable: !!r.isDeletable,
  }));
}

async function getRoleService(roleId) {
  const prisma = getPrismaOrThrow();
  await ensureRoleTables(prisma);
  const [r] = await query(prisma, `SELECT * FROM staff_roles WHERE id = ? LIMIT 1`, roleId);
  if (!r) return null;
  return {
    _id: r.id,
    name: r.name,
    description: r.description || "",
    color: r.color || "#6366f1",
    permissions: r.permissions ? JSON.parse(r.permissions) : {},
    type: r.type === "system" ? "system" : "custom",
    isDeletable: !!r.isDeletable,
  };
}

async function updateRoleService(roleId, roleData, userId, res) {
  try {
    const prisma = getPrismaOrThrow();
    await ensureRoleTables(prisma);

    const schoolId = await getAdminSchoolId(prisma, userId);
    if (!schoolId) return responseStatus(res, 403, "failed", "Access denied");

    const [existing] = await query(
      prisma,
      `SELECT * FROM staff_roles WHERE id = ? AND schoolId = ? LIMIT 1`,
      roleId,
      schoolId
    );
    if (!existing) return responseStatus(res, 404, "failed", "Role not found");

    const name = roleData?.name ? roleData.name.toString().trim() : existing.name;
    const description = roleData?.description !== undefined ? roleData.description : existing.description;
    const color = roleData?.color !== undefined ? roleData.color : existing.color;
    const permissions = roleData?.permissions !== undefined ? roleData.permissions : (existing.permissions ? JSON.parse(existing.permissions) : {});

    await exec(
      prisma,
      `UPDATE staff_roles SET name = ?, description = ?, color = ?, permissions = ? WHERE id = ? AND schoolId = ?`,
      name,
      description,
      color,
      JSON.stringify(permissions),
      roleId,
      schoolId
    );

    return responseStatus(res, 200, "success", {
      _id: roleId,
      name,
      description: description || "",
      color: color || "#6366f1",
      permissions,
    });
  } catch (error) {
    console.error("[Prisma role] updateRoleService error:", error);
    return responseStatus(res, 400, "failed", error.message);
  }
}

async function deleteRoleService(roleId, userId, res) {
  try {
    const prisma = getPrismaOrThrow();
    await ensureRoleTables(prisma);

    const schoolId = await getAdminSchoolId(prisma, userId);
    if (!schoolId) return responseStatus(res, 403, "failed", "Access denied");

    const [existing] = await query(
      prisma,
      `SELECT isDeletable FROM staff_roles WHERE id = ? AND schoolId = ? LIMIT 1`,
      roleId,
      schoolId
    );
    if (!existing) return responseStatus(res, 404, "failed", "Role not found");
    if (!existing.isDeletable) return responseStatus(res, 400, "failed", "Cannot delete system roles");

    await exec(prisma, `DELETE FROM teacher_role_assignments WHERE schoolId = ? AND roleId = ?`, schoolId, roleId);
    await exec(prisma, `DELETE FROM staff_roles WHERE id = ? AND schoolId = ?`, roleId, schoolId);

    return responseStatus(res, 200, "success", { message: "Role deleted successfully" });
  } catch (error) {
    console.error("[Prisma role] deleteRoleService error:", error);
    return responseStatus(res, 400, "failed", error.message);
  }
}

async function assignRoleService(teacherId, roleId, userId, res) {
  try {
    const prisma = getPrismaOrThrow();
    await ensureRoleTables(prisma);

    const schoolId = await getAdminSchoolId(prisma, userId);
    if (!schoolId) return responseStatus(res, 403, "failed", "Access denied");

    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId }, select: { id: true, schoolId: true } });
    if (!teacher) return responseStatus(res, 404, "failed", "Teacher not found");
    if (teacher.schoolId !== schoolId) return responseStatus(res, 403, "failed", "Access denied");

    const [role] = await query(prisma, `SELECT id FROM staff_roles WHERE id = ? AND schoolId = ? LIMIT 1`, roleId, schoolId);
    if (!role) return responseStatus(res, 404, "failed", "Role not found");

    await exec(
      prisma,
      `INSERT INTO teacher_role_assignments (id, schoolId, teacherId, roleId)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE roleId = VALUES(roleId)`,
      uuid(),
      schoolId,
      teacherId,
      roleId
    );

    return responseStatus(res, 200, "success", { teacherId, roleId });
  } catch (error) {
    console.error("[Prisma role] assignRoleService error:", error);
    return responseStatus(res, 400, "failed", error.message);
  }
}

async function getPermissionsService() {
  // Keep identical shape to mongoose implementation
  return {
    dashboard: {
      label: "Dashboard",
      permissions: [
        { key: "viewDashboard", label: "View Dashboard", description: "Access the main dashboard" },
      ],
    },
    teachers: {
      label: "Teachers",
      permissions: [
        { key: "viewTeachers", label: "View Teachers", description: "View teacher list and profiles" },
        { key: "addTeachers", label: "Add Teachers", description: "Create new teachers" },
        { key: "editTeachers", label: "Edit Teachers", description: "Modify teacher information" },
        { key: "deleteTeachers", label: "Delete Teachers", description: "Remove teachers" },
      ],
    },
    students: {
      label: "Students",
      permissions: [
        { key: "viewStudents", label: "View Students", description: "View student list and profiles" },
        { key: "addStudents", label: "Add Students", description: "Create new students" },
        { key: "editStudents", label: "Edit Students", description: "Modify student information" },
        { key: "deleteStudents", label: "Delete Students", description: "Remove students" },
      ],
    },
    classes: {
      label: "Classes",
      permissions: [
        { key: "viewClasses", label: "View Classes", description: "View class information" },
        { key: "manageClasses", label: "Manage Classes", description: "Create and modify classes" },
      ],
    },
    attendance: {
      label: "Attendance",
      permissions: [
        { key: "viewAttendance", label: "View Attendance", description: "View attendance records" },
        { key: "takeAttendance", label: "Take Attendance", description: "Mark student attendance" },
        { key: "editAttendance", label: "Edit Attendance", description: "Modify attendance records" },
      ],
    },
    communication: {
      label: "Communication",
      permissions: [
        { key: "accessCommunication", label: "Access Communication", description: "Access messaging system" },
        { key: "createGroups", label: "Create Groups", description: "Create chat groups" },
        { key: "manageGroups", label: "Manage Groups", description: "Delete groups and messages" },
        { key: "sendPrivateMessages", label: "Send Private Messages", description: "Send direct messages" },
      ],
    },
    assessments: {
      label: "Assessments",
      permissions: [
        { key: "viewAssessments", label: "View Assessments", description: "View assessments" },
        { key: "createAssessments", label: "Create Assessments", description: "Create new assessments" },
        { key: "gradeAssessments", label: "Grade Assessments", description: "Grade student submissions" },
      ],
    },
    courses: {
      label: "Courses",
      permissions: [
        { key: "viewCourses", label: "View Courses", description: "View course content" },
        { key: "createCourses", label: "Create Courses", description: "Create new courses" },
        { key: "manageCourses", label: "Manage Courses", description: "Edit and delete courses" },
      ],
    },
    reports: {
      label: "Reports",
      permissions: [
        { key: "viewReports", label: "View Reports", description: "Access system reports" },
        { key: "exportReports", label: "Export Reports", description: "Export data and reports" },
      ],
    },
    settings: {
      label: "Settings",
      permissions: [
        { key: "manageSchoolSettings", label: "Manage Settings", description: "Modify school settings" },
        { key: "manageRoles", label: "Manage Roles", description: "Create and modify roles" },
      ],
    },
  };
}

module.exports = {
  createRoleService,
  getRolesService,
  getRoleService,
  updateRoleService,
  deleteRoleService,
  assignRoleService,
  getPermissionsService,
};
