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
    console.log('[SuperAdmin Login] Incoming email:', email, 'Password length:', password?.length);

    // For now, use hardcoded superadmin credentials from env (normalize email)
    // In production, store this in database
    // Defaults match DEMO_CREDENTIALS.md; override via env in production.
    const SUPERADMIN_EMAIL = (process.env.SUPERADMIN_EMAIL || "SA@progresslms.com").toLowerCase();
    const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || "Superpass";
    const SUPERADMIN_NAME = "System Administrator";
    console.log('[SuperAdmin Login] Expected email:', SUPERADMIN_EMAIL);

    // Normalize incoming email for comparison
    const incomingEmail = (email || "").toLowerCase();
    console.log('[SuperAdmin Login] Normalized incoming:', incomingEmail, 'vs expected:', SUPERADMIN_EMAIL);

    // Verify credentials via env first
    if (incomingEmail !== SUPERADMIN_EMAIL || password !== SUPERADMIN_PASSWORD) {
      console.log('[SuperAdmin Login] Env credentials did not match. Attempting DB-backed lookup...');

      // Try to validate against an Admin user in the DB (Prisma or Mongoose)
      try {
        const { getPrisma } = require("../../lib/prismaClient");
        const prisma = getPrisma();
        if (prisma && prisma.admin) {
          const user = await prisma.admin.findUnique({ where: { email: incomingEmail } });
          if (user) {
            const matched = await isPassMatched(password, user.password);
            if (matched) {
              // use DB user data for token
              const token = generateToken(user.id, user.role || 'super_admin', user.schoolId || null);
              return responseStatus(res, 200, 'success', { _id: user.id, name: user.name, email: user.email, role: user.role, token });
            }
          }
        }
      } catch (dbErr) {
        console.warn('[SuperAdmin Login] Prisma DB lookup failed:', dbErr.message);
      }

      // Fallback to Mongoose Admin lookup
      try {
        const Admin = require('../../models/Staff/admin.model');
        const mongoUser = await Admin.findOne({ email: incomingEmail }).lean();
        if (mongoUser) {
          const matched = await isPassMatched(password, mongoUser.password);
          if (matched) {
            const token = generateToken(mongoUser._id.toString(), mongoUser.role || 'super_admin', mongoUser.schoolId || null);
            return responseStatus(res, 200, 'success', { _id: mongoUser._id.toString(), name: mongoUser.name, email: mongoUser.email, role: mongoUser.role, token });
          }
        }
      } catch (mongoErr) {
        console.warn('[SuperAdmin Login] Mongoose lookup failed:', mongoErr.message);
      }

      console.log('[SuperAdmin Login] FAILED - No matching DB user found');
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
      token,
    };

    // Send response with proper format for frontend
    return responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};
