const express = require("express");
const feeController = require("../../../controllers/finance/fee.controller");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdmin = require("../../../middlewares/isAdmin");

const feeRouter = express.Router();

// Fee Structure Routes (Admin only)
feeRouter.post("/fees/structure", isLoggedIn, isAdmin, feeController.createFeeStructure);
feeRouter.get("/fees/structure", isLoggedIn, isAdmin, feeController.getFeeStructures);

// Fee Payment Routes
feeRouter.post("/fees/payment", isLoggedIn, isAdmin, feeController.recordPayment);
feeRouter.get("/fees/student/:studentId", isLoggedIn, feeController.getStudentPayments); // Admin or Student
feeRouter.get("/fees/due/:studentId", isLoggedIn, feeController.getDueFees); // Admin or Student

module.exports = feeRouter;
