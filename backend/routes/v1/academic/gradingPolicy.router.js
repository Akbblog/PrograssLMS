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

router.use(isLoggedIn);
router.use(isAdmin); // Typically admin handles policies

router.post("/grading-policies", createGradingPolicy);
router.get("/grading-policies", getAllGradingPolicies);
router.get("/grading-policies/active", getActivePolicy);
router.patch("/grading-policies/:id", updateGradingPolicy);
router.delete("/grading-policies/:id", deleteGradingPolicy);

module.exports = router;
