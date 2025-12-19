/**
 * Super Admin Middleware
 * Checks if user has super admin role
 * Super admins can manage all schools/tenants
 */
const isSuperAdmin = (req, res, next) => {
    try {
        // Check if user role is super_admin
        if (req.userRole !== "super_admin") {
            return res.status(403).json({
                status: "failed",
                message: "Access denied. Super admin only.",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Authorization check failed",
            error: error.message,
        });
    }
};

module.exports = isSuperAdmin;
