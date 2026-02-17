const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../../middlewares/isLoggedIn');
const isAdmin = require('../../../middlewares/isAdmin');
const { hasPermission } = require('../../../middlewares/permissions');

const {
  listCardTemplates,
  getCardTemplate,
  createCardTemplate,
  updateCardTemplate,
  deleteCardTemplate,
  activateCardTemplate,
  getAvailableFields,
  ensureDefaultTemplate,
} = require('../../../controllers/admin/cardTemplates.controller');

const auth = [isLoggedIn, isAdmin, hasPermission('manageStudents')];

// Card Template CRUD
router.get('/admin/card-templates', ...auth, listCardTemplates);
router.get('/admin/card-templates/available-fields/:entityType', ...auth, getAvailableFields);
router.post('/admin/card-templates/ensure-default', ...auth, ensureDefaultTemplate);
router.get('/admin/card-templates/:id', ...auth, getCardTemplate);
router.post('/admin/card-templates', ...auth, createCardTemplate);
router.patch('/admin/card-templates/:id', ...auth, updateCardTemplate);
router.delete('/admin/card-templates/:id', ...auth, deleteCardTemplate);
router.post('/admin/card-templates/:id/activate', ...auth, activateCardTemplate);

module.exports = router;
