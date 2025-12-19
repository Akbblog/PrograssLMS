const verifyToken = require("../utils/verifyToken");

/**
 * Tenant Isolation Middleware
 * Automatically adds schoolId to req object for data filtering
 * Ensures users can only access data from their school
 */
const tenantIsolation = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: "failed",
                message: "No token provided",
            });
        }

        // Verify token and get user data
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                status: "failed",
                message: "Invalid or expired token",
            });
        }

        // Extract schoolId from token
        // Note: Token must include schoolId when generated
        const schoolId = decoded.schoolId;

        if (!schoolId) {
            return res.status(403).json({
                status: "failed",
                message: "School ID not found in token. Multi-tenancy error.",
            });
        }

        // Attach schoolId to request for use in controllers
        req.schoolId = schoolId;
        req.userId = decoded._id;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Tenant isolation failed",
            error: error.message,
        });
    }
};

module.exports = tenantIsolation;
