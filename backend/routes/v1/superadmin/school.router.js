const express = require("express");
const {
    createSchoolController,
    getAllSchoolsController,
    getSchoolController,
    updateSchoolController,
    updateSubscriptionController,
    toggleSchoolStatusController,
    getAnalyticsController,
    deleteSchoolController,
} = require("../../../controllers/superadmin/school.controller");

const { superAdminLoginController } = require("../../../controllers/superadmin/auth.controller");

const superAdminRouter = express.Router();

//middleware
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isSuperAdmin = require("../../../middlewares/isSuperAdmin");
const { validateBody } = require("../../../middlewares/validateRequest");

// Public route - Login (no auth needed) - MUST be before middleware
superAdminRouter.post("/login", superAdminLoginController);

// Protected routes - require super admin access
superAdminRouter.use(isLoggedIn, isSuperAdmin);

// Create new school/tenant
// Validation for create school payload
const createSchoolSchema = {
    name: { type: "string", required: true },
    email: { type: "email", required: true },
    phone: { type: "string", required: false },
    adminName: { type: "string", required: true },
    adminEmail: { type: "email", required: true },
    adminPassword: { type: "string", required: true },
};
superAdminRouter.route("/schools").post(validateBody(createSchoolSchema), createSchoolController);

// Update school payload validation (partial allowed)
const updateSchoolSchema = {
    name: { type: "string", required: false },
    phone: { type: "string", required: false },
    address: { type: "object", required: false },
    primaryAdmin: { type: "string", required: false },
    primaryColor: { type: "string", required: false },
    secondaryColor: { type: "string", required: false },
    features: { type: "object", required: false },
    isActive: { type: "boolean", required: false },
};

// Subscription update validation
const updateSubscriptionSchema = {
    plan: { type: "string", required: false },
    status: { type: "string", required: false },
    endDate: { type: "string", required: false },
};

// Toggle status validation
const toggleStatusSchema = {
    isSuspended: { type: "boolean", required: true },
    suspensionReason: { type: "string", required: false },
};

// Apply validation to update/subscription/status routes
superAdminRouter.route("/schools/:id").put(validateBody(updateSchoolSchema), updateSchoolController);

// Update subscription
superAdminRouter
    .route("/schools/:id/subscription")
    .put(validateBody(updateSubscriptionSchema), updateSubscriptionController);

// Suspend/Activate school
superAdminRouter
    .route("/schools/:id/status")
    .put(validateBody(toggleStatusSchema), toggleSchoolStatusController);

// Get all schools
superAdminRouter.route("/schools").get(getAllSchoolsController);

// Get single school
superAdminRouter.route("/schools/:id").get(getSchoolController);

// Update school details
superAdminRouter.route("/schools/:id").put(updateSchoolController);

// Update subscription
superAdminRouter
    .route("/schools/:id/subscription")
    .put(updateSubscriptionController);

// Suspend/Activate school
superAdminRouter
    .route("/schools/:id/status")
    .put(toggleSchoolStatusController);

// Get global analytics
superAdminRouter.route("/analytics").get(getAnalyticsController);

// Delete school permanently
superAdminRouter.route("/schools/:id").delete(deleteSchoolController);

module.exports = superAdminRouter;

