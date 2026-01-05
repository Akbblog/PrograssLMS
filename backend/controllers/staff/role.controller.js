const responseStatus = require("../../handlers/responseStatus.handler.js");
const {
    createRoleService,
    getRolesService,
    getRoleService,
    updateRoleService,
    deleteRoleService,
    assignRoleService,
    getPermissionsService,
} = require("../../services/staff/role.service");

/**
 * @desc Create Role
 * @route POST /api/v1/roles
 * @access Private (Admin only)
 */
exports.createRoleController = async (req, res) => {
    try {
        await createRoleService(req.body, req.userId, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get All Roles
 * @route GET /api/v1/roles
 * @access Private (Admin only)
 */
exports.getRolesController = async (req, res) => {
    try {
        const result = await getRolesService(req.schoolId);
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get Single Role
 * @route GET /api/v1/roles/:id
 * @access Private (Admin only)
 */
exports.getRoleController = async (req, res) => {
    try {
        const result = await getRoleService(req.params.id);
        if (!result) {
            return responseStatus(res, 404, "failed", "Role not found");
        }
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Update Role
 * @route PUT /api/v1/roles/:id
 * @access Private (Admin only)
 */
exports.updateRoleController = async (req, res) => {
    try {
        await updateRoleService(req.params.id, req.body, req.userId, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Delete Role
 * @route DELETE /api/v1/roles/:id
 * @access Private (Admin only)
 */
exports.deleteRoleController = async (req, res) => {
    try {
        await deleteRoleService(req.params.id, req.userId, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Assign Role to Teacher
 * @route POST /api/v1/roles/:id/assign
 * @access Private (Admin only)
 */
exports.assignRoleController = async (req, res) => {
    try {
        await assignRoleService(req.body.teacherId, req.params.id, req.userId, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get All Available Permissions
 * @route GET /api/v1/permissions
 * @access Private (Admin only)
 */
exports.getPermissionsController = async (req, res) => {
    try {
        const result = await getPermissionsService();
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};
