const responseStatus = require("../../handlers/responseStatus.handler.js");
const { hashPassword, isPassMatched } = require("../../handlers/passHash.handler.js");
const generateToken = require("../../utils/tokenGenerator.js");

/**
 * Super Admin Login Service
 * @param {Object} data - Login credentials
 * @param {string} data.email - Super admin email
 * @param {string} data.password - Super admin password
 * @returns {Object} - Token and user data
 */
exports.superAdminLoginService = async (data, res) => {
  try {
    const { email, password } = data;

    // For now, use hardcoded superadmin credentials from env (normalize email)
    // In production, store this in database
    // Defaults match DEMO_CREDENTIALS.md; override via env in production.
    const SUPERADMIN_EMAIL = (process.env.SUPERADMIN_EMAIL || "SA@progresslms.com").toLowerCase();
    const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || "Superpass";
    const SUPERADMIN_NAME = "System Administrator";

    // Normalize incoming email for comparison
    const incomingEmail = (email || "").toLowerCase();

    // Verify credentials
    if (incomingEmail !== SUPERADMIN_EMAIL || password !== SUPERADMIN_PASSWORD) {
      return responseStatus(res, 401, "failed", "Invalid login credentials");
    }

    // Generate token
    // Use a valid static ObjectId for superadmin to avoid CastError in Mongoose
    const SUPERADMIN_ID = "5f8d0d55b54764421b7156c9";

    const token = generateToken(
      SUPERADMIN_ID,
      "super_admin",
      null // No school ID for superadmin
    );

    const result = {
      _id: SUPERADMIN_ID,
      name: SUPERADMIN_NAME,
      email: SUPERADMIN_EMAIL,
      role: "super_admin",
    };

    // Send response with proper format for frontend
    return res.status(200).json({
      status: "success",
      data: result,
      token,
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};
