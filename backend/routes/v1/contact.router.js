const express = require('express');
const router = express.Router();
const { createContact } = require('../../controllers/contact.controller');

// POST /api/v1/contact
router.post('/', createContact);

module.exports = router;
