const express = require("express");
const router = express.Router();
const {
    createGradingPolicy,
    getAllGradingPolicies,
    getActivePolicy,
    updateGradingPolicy,
    deleteGradingPolicy
} = require("../../../controllers/academic/gradingPolicy.controller");
const isAdmin = require("../../../middlewares/isAdmin");
const isLoggedIn = require("../../../middlewares/isLoggedIn");

// NOTE: This router is mounted at '/' in routes/v1/index.js.
// Avoid router-wide auth middleware here, otherwise it intercepts *all* /api/v1 requests.
router.post("/grading-policies", isLoggedIn, isAdmin, createGradingPolicy);
router.get("/grading-policies", isLoggedIn, isAdmin, getAllGradingPolicies);
router.get("/grading-policies/active", isLoggedIn, isAdmin, getActivePolicy);
router.patch("/grading-policies/:id", isLoggedIn, isAdmin, updateGradingPolicy);
router.delete("/grading-policies/:id", isLoggedIn, isAdmin, deleteGradingPolicy);

module.exports = router;
