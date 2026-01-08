const responseStatus = require("../../handlers/responseStatus.handler.js");

function notSupported(res, action = "This action") {
  return responseStatus(res, 501, false, null, `${action} is not supported in Prisma mode yet.`);
}

async function createRoleService(_roleData, _userId, res) {
  return notSupported(res, "Role creation");
}

async function getRolesService(_schoolId) {
  // Controller wraps this with responseStatus already.
  return [];
}

async function getRoleService(_roleId) {
  return null;
}

async function updateRoleService(_roleId, _roleData, _userId, res) {
  return notSupported(res, "Role update");
}

async function deleteRoleService(_roleId, _userId, res) {
  return notSupported(res, "Role deletion");
}

async function assignRoleService(_teacherId, _roleId, _userId, res) {
  return notSupported(res, "Role assignment");
}

async function getPermissionsService() {
  // Frontend expects an object map of categories.
  return {};
}

module.exports = {
  createRoleService,
  getRolesService,
  getRoleService,
  updateRoleService,
  deleteRoleService,
  assignRoleService,
  getPermissionsService,
};
