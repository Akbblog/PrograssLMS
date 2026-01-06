const AllocationService = require('../../services/transport/allocation.service');

exports.createAllocation = AllocationService.createAllocation;
exports.getAllocations = AllocationService.getAllocations;
exports.updateAllocation = AllocationService.updateAllocation;
exports.deleteAllocation = AllocationService.deleteAllocation;
exports.getStudentAllocation = AllocationService.getStudentAllocation;
exports.getRouteAllocations = AllocationService.getRouteAllocations;