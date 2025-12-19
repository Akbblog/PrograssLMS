const responseStatus = require("../../handlers/responseStatus.handler");
const { superAdminLoginService } = require("../../services/superadmin/auth.service");

/**
 * @desc Super Admin Login
 * @route POST /api/v1/superadmin/login
 * @access Public
 */
exports.superAdminLoginController = async (req, res) => {
  try {
    await superAdminLoginService(req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};
