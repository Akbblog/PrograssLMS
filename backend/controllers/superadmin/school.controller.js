const schoolService = require("../../services/superadmin/school.service");

/**
 * @desc    Create a new school/tenant (Super Admin only)
 * @route   POST /api/v1/superadmin/schools
 * @access  Super Admin
 */
exports.createSchoolController = async (req, res) => {
    try {
        await schoolService.createSchool(req.body, req.userId, res);
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};

/**
 * @desc    Get all schools/tenants
 * @route   GET /api/v1/superadmin/schools
 * @access  Super Admin
 */
exports.getAllSchoolsController = async (req, res) => {
    try {
        await schoolService.getAllSchools(res);
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};

/**
 * @desc    Get single school details
 * @route   GET /api/v1/superadmin/schools/:id
 * @access  Super Admin
 */
exports.getSchoolController = async (req, res) => {
    try {
        await schoolService.getSchoolById(req.params.id, res);
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};

/**
 * @desc    Update school details
 * @route   PUT /api/v1/superadmin/schools/:id
 * @access  Super Admin
 */
exports.updateSchoolController = async (req, res) => {
    try {
        await schoolService.updateSchool(req.params.id, req.body, res);
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};

/**
 * @desc    Update school subscription
 * @route   PUT /api/v1/superadmin/schools/:id/subscription
 * @access  Super Admin
 */
exports.updateSubscriptionController = async (req, res) => {
    try {
        await schoolService.updateSubscription(req.params.id, req.body, res);
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};

/**
 * @desc    Suspend/Activate school
 * @route   PUT /api/v1/superadmin/schools/:id/status
 * @access  Super Admin
 */
exports.toggleSchoolStatusController = async (req, res) => {
    try {
        await schoolService.toggleStatus(req.params.id, req.body, res);
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};

/**
 * @desc    Get global analytics
 * @route   GET /api/v1/superadmin/analytics
 * @access  Super Admin
 */
exports.getAnalyticsController = async (req, res) => {
    try {
        await schoolService.analytics(res);
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};

/**
 * @desc    Delete school permanently
 * @route   DELETE /api/v1/superadmin/schools/:id
 * @access  Super Admin
 */
exports.deleteSchoolController = async (req, res) => {
    try {
        await schoolService.deleteSchool(req.params.id, res);
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};
