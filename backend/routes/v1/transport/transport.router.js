const express = require('express');
const vehicleController = require('../../../controllers/transport/vehicle.controller');
const routeController = require('../../../controllers/transport/route.controller');
const allocationController = require('../../../controllers/transport/allocation.controller');
const attendanceController = require('../../../controllers/transport/driverAttendance.controller');
const isLoggedIn = require('../../../middlewares/isLoggedIn');
const isAdmin = require('../../../middlewares/isAdmin');
const isAdminOrTeacher = require('../../../middlewares/isAdminOrTeacher');

const router = express.Router();

// Vehicles
router.get('/vehicles', isLoggedIn, vehicleController.getVehicles);
router.post('/vehicles', isLoggedIn, isAdmin, vehicleController.createVehicle);
router.put('/vehicles/:id', isLoggedIn, isAdmin, vehicleController.updateVehicle);
router.delete('/vehicles/:id', isLoggedIn, isAdmin, vehicleController.deleteVehicle);

// Routes
router.get('/routes', isLoggedIn, routeController.getRoutes);
router.post('/routes', isLoggedIn, isAdmin, routeController.createRoute);
router.put('/routes/:id', isLoggedIn, isAdmin, routeController.updateRoute);
router.delete('/routes/:id', isLoggedIn, isAdmin, routeController.deleteRoute);

// Allocations
router.get('/allocations', isLoggedIn, allocationController.getAllocations);
router.post('/allocations', isLoggedIn, isAdmin, allocationController.createAllocation);
router.put('/allocations/:id', isLoggedIn, isAdmin, allocationController.updateAllocation);
router.delete('/allocations/:id', isLoggedIn, isAdmin, allocationController.deleteAllocation);
router.get('/allocations/student/:id', isLoggedIn, allocationController.getStudentAllocation);
router.get('/allocations/route/:id', isLoggedIn, allocationController.getRouteAllocations);

// Driver Attendance
router.get('/driver-attendance', isLoggedIn, attendanceController.getAttendance);
router.post('/driver-attendance', isLoggedIn, isAdminOrTeacher, attendanceController.markAttendance);
router.get('/stats', isLoggedIn, attendanceController.getStats);

module.exports = router;
