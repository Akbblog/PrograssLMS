const Role = require("../../models/Staff/Role.model");
const Admin = require("../../models/Staff/admin.model");
const Teacher = require("../../models/Staff/teachers.model");
const responseStatus = require("../../handlers/responseStatus.handler");

/**
 * Create Role Service
 */
exports.createRoleService = async (data, adminId, res) => {
    try {
        // Get admin's schoolId
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return responseStatus(res, 401, "failed", "Admin not found");
        }

        const { name, description, color, permissions } = data;

        // Check if role with this name already exists
        const existingRole = await Role.findOne({ name, schoolId: admin.schoolId });
        if (existingRole) {
            return responseStatus(res, 400, "failed", "Role with this name already exists");
        }

        // Create role
        const role = await Role.create({
            name,
            description,
            color: color || "#6366f1",
            permissions: permissions || {},
            schoolId: admin.schoolId,
            createdBy: adminId,
            type: "custom",
        });

        return responseStatus(res, 201, "success", role);
    } catch (error) {
        console.error("createRoleService error:", error);
        return responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * Get All Roles Service
 */
exports.getRolesService = async (schoolId) => {
    const roles = await Role.find({ schoolId, isActive: true })
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

    // Count users for each role
    const rolesWithCount = await Promise.all(roles.map(async (role) => {
        const usersCount = await Teacher.countDocuments({ roleId: role._id, schoolId });
        return {
            ...role.toObject(),
            usersCount,
        };
    }));

    return rolesWithCount;
};

/**
 * Get Single Role Service
 */
exports.getRoleService = async (roleId) => {
    const role = await Role.findById(roleId).populate("createdBy", "name");
    return role;
};

/**
 * Update Role Service
 */
exports.updateRoleService = async (roleId, data, adminId, res) => {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return responseStatus(res, 401, "failed", "Admin not found");
        }

        const role = await Role.findById(roleId);
        if (!role) {
            return responseStatus(res, 404, "failed", "Role not found");
        }

        // Check school ownership
        if (role.schoolId.toString() !== admin.schoolId.toString()) {
            return responseStatus(res, 403, "failed", "Access denied");
        }

        const { name, description, color, permissions } = data;

        // Check if name is unique (excluding current role)
        if (name && name !== role.name) {
            const existingRole = await Role.findOne({
                name,
                schoolId: admin.schoolId,
                _id: { $ne: roleId }
            });
            if (existingRole) {
                return responseStatus(res, 400, "failed", "Role with this name already exists");
            }
        }

        // Update role
        if (name) role.name = name;
        if (description !== undefined) role.description = description;
        if (color) role.color = color;
        if (permissions) role.permissions = permissions;

        await role.save();

        return responseStatus(res, 200, "success", role);
    } catch (error) {
        console.error("updateRoleService error:", error);
        return responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * Delete Role Service
 */
exports.deleteRoleService = async (roleId, adminId, res) => {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return responseStatus(res, 401, "failed", "Admin not found");
        }

        const role = await Role.findById(roleId);
        if (!role) {
            return responseStatus(res, 404, "failed", "Role not found");
        }

        // Check school ownership
        if (role.schoolId.toString() !== admin.schoolId.toString()) {
            return responseStatus(res, 403, "failed", "Access denied");
        }

        // Check if role is deletable
        if (!role.isDeletable) {
            return responseStatus(res, 400, "failed", "This is a system role and cannot be deleted");
        }

        // Check if any teachers are using this role
        const teachersUsingRole = await Teacher.countDocuments({ roleId: role._id });
        if (teachersUsingRole > 0) {
            return responseStatus(res, 400, "failed", `Cannot delete role. ${teachersUsingRole} teacher(s) are still assigned to this role.`);
        }

        // Delete role
        await Role.findByIdAndDelete(roleId);

        return responseStatus(res, 200, "success", { message: "Role deleted successfully" });
    } catch (error) {
        console.error("deleteRoleService error:", error);
        return responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * Assign Role to Teacher Service
 */
exports.assignRoleService = async (teacherId, roleId, adminId, res) => {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return responseStatus(res, 401, "failed", "Admin not found");
        }

        const role = await Role.findById(roleId);
        if (!role) {
            return responseStatus(res, 404, "failed", "Role not found");
        }

        // Check school ownership
        if (role.schoolId.toString() !== admin.schoolId.toString()) {
            return responseStatus(res, 403, "failed", "Access denied");
        }

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return responseStatus(res, 404, "failed", "Teacher not found");
        }

        // Check teacher belongs to same school
        if (teacher.schoolId.toString() !== admin.schoolId.toString()) {
            return responseStatus(res, 403, "failed", "Access denied");
        }

        // Assign role
        teacher.roleId = roleId;
        await teacher.save();

        return responseStatus(res, 200, "success", teacher);
    } catch (error) {
        console.error("assignRoleService error:", error);
        return responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * Get Permissions for a Role
 */
exports.getPermissionsService = async () => {
    // Define all available permissions
    const permissions = {
        dashboard: {
            label: "Dashboard",
            permissions: [
                { key: "viewDashboard", label: "View Dashboard", description: "Access the main dashboard" },
            ]
        },
        teachers: {
            label: "Teachers",
            permissions: [
                { key: "viewTeachers", label: "View Teachers", description: "View teacher list and profiles" },
                { key: "addTeachers", label: "Add Teachers", description: "Create new teachers" },
                { key: "editTeachers", label: "Edit Teachers", description: "Modify teacher information" },
                { key: "deleteTeachers", label: "Delete Teachers", description: "Remove teachers" },
            ]
        },
        students: {
            label: "Students",
            permissions: [
                { key: "viewStudents", label: "View Students", description: "View student list and profiles" },
                { key: "addStudents", label: "Add Students", description: "Create new students" },
                { key: "editStudents", label: "Edit Students", description: "Modify student information" },
                { key: "deleteStudents", label: "Delete Students", description: "Remove students" },
            ]
        },
        classes: {
            label: "Classes",
            permissions: [
                { key: "viewClasses", label: "View Classes", description: "View class information" },
                { key: "manageClasses", label: "Manage Classes", description: "Create and modify classes" },
            ]
        },
        attendance: {
            label: "Attendance",
            permissions: [
                { key: "viewAttendance", label: "View Attendance", description: "View attendance records" },
                { key: "takeAttendance", label: "Take Attendance", description: "Mark student attendance" },
                { key: "editAttendance", label: "Edit Attendance", description: "Modify attendance records" },
            ]
        },
        communication: {
            label: "Communication",
            permissions: [
                { key: "accessCommunication", label: "Access Communication", description: "Access messaging system" },
                { key: "createGroups", label: "Create Groups", description: "Create chat groups" },
                { key: "manageGroups", label: "Manage Groups", description: "Delete groups and messages" },
                { key: "sendPrivateMessages", label: "Send Private Messages", description: "Send direct messages" },
            ]
        },
        assessments: {
            label: "Assessments",
            permissions: [
                { key: "viewAssessments", label: "View Assessments", description: "View assessments" },
                { key: "createAssessments", label: "Create Assessments", description: "Create new assessments" },
                { key: "gradeAssessments", label: "Grade Assessments", description: "Grade student submissions" },
            ]
        },
        courses: {
            label: "Courses",
            permissions: [
                { key: "viewCourses", label: "View Courses", description: "View course content" },
                { key: "createCourses", label: "Create Courses", description: "Create new courses" },
                { key: "manageCourses", label: "Manage Courses", description: "Edit and delete courses" },
            ]
        },
        reports: {
            label: "Reports",
            permissions: [
                { key: "viewReports", label: "View Reports", description: "Access system reports" },
                { key: "exportReports", label: "Export Reports", description: "Export data and reports" },
            ]
        },
        settings: {
            label: "Settings",
            permissions: [
                { key: "manageSchoolSettings", label: "Manage Settings", description: "Modify school settings" },
                { key: "manageRoles", label: "Manage Roles", description: "Create and modify roles" },
            ]
        },
    };

    return permissions;
};
