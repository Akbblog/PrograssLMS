const express = require("express");
const roleRouter = express.Router();

// Middleware
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdmin = require("../../../middlewares/isAdmin");

// Controllers
const {
    createRoleController,
    getRolesController,
    getRoleController,
    updateRoleController,
    deleteRoleController,
    assignRoleController,
    getPermissionsController,
} = require("../../../controllers/staff/role.controller");

// ============ ROLE ROUTES ============

// Get all available permissions
roleRouter
    .route("/permissions")
    .get(isLoggedIn, isAdmin, getPermissionsController);

// Get all roles / Create new role
roleRouter
    .route("/roles")
    .get(isLoggedIn, isAdmin, getRolesController)
    .post(isLoggedIn, isAdmin, createRoleController);

// Get single role / Update role / Delete role
roleRouter
    .route("/roles/:id")
    .get(isLoggedIn, isAdmin, getRoleController)
    .put(isLoggedIn, isAdmin, updateRoleController)
    .delete(isLoggedIn, isAdmin, deleteRoleController);

// Assign role to teacher
roleRouter
    .route("/roles/:id/assign")
    .post(isLoggedIn, isAdmin, assignRoleController);

module.exports = roleRouter;
