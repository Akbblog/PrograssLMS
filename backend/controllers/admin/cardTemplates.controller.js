const responseStatus = require('../../handlers/responseStatus.handler');
const CardTemplate = require('../../models/Documents/CardTemplate.model');
const { DEFAULT_STUDENT_FIELDS } = require('../../services/documentGenerator/templates/StudentCardTemplate');
const { DEFAULT_STAFF_FIELDS } = require('../../services/documentGenerator/templates/StaffCardTemplate');

// GET /api/v1/admin/card-templates
exports.listCardTemplates = async (req, res) => {
  try {
    const schoolId = req.userAuth?.schoolId;
    if (!schoolId) return responseStatus(res, 400, 'failed', 'School context required');

    const { entityType } = req.query;
    const filter = { schoolId };
    if (entityType) filter.entityType = entityType;

    const templates = await CardTemplate.find(filter)
      .sort({ isActive: -1, updatedAt: -1 })
      .lean();

    return responseStatus(res, 200, 'success', templates);
  } catch (error) {
    return responseStatus(res, 500, 'failed', error.message);
  }
};

// GET /api/v1/admin/card-templates/:id
exports.getCardTemplate = async (req, res) => {
  try {
    const schoolId = req.userAuth?.schoolId;
    const template = await CardTemplate.findOne({ _id: req.params.id, schoolId }).lean();
    if (!template) return responseStatus(res, 404, 'failed', 'Template not found');
    return responseStatus(res, 200, 'success', template);
  } catch (error) {
    return responseStatus(res, 500, 'failed', error.message);
  }
};

// POST /api/v1/admin/card-templates
exports.createCardTemplate = async (req, res) => {
  try {
    const schoolId = req.userAuth?.schoolId;
    if (!schoolId) return responseStatus(res, 400, 'failed', 'School context required');

    const { name, entityType, layout, styling, fields, customText } = req.body;
    if (!name || !entityType) return responseStatus(res, 400, 'failed', 'Name and entityType are required');

    // Use defaults if no fields provided
    const defaultFields = entityType === 'student' ? DEFAULT_STUDENT_FIELDS : DEFAULT_STAFF_FIELDS;

    const template = await CardTemplate.create({
      schoolId,
      name,
      entityType,
      layout: layout || {},
      styling: styling || {},
      fields: fields || defaultFields,
      customText: customText || {},
      createdBy: req.userAuth?.id,
      version: 1,
      isActive: false,
    });

    return responseStatus(res, 201, 'success', template);
  } catch (error) {
    return responseStatus(res, 500, 'failed', error.message);
  }
};

// PATCH /api/v1/admin/card-templates/:id
exports.updateCardTemplate = async (req, res) => {
  try {
    const schoolId = req.userAuth?.schoolId;
    const { name, layout, styling, fields, customText } = req.body;

    const template = await CardTemplate.findOne({ _id: req.params.id, schoolId });
    if (!template) return responseStatus(res, 404, 'failed', 'Template not found');

    if (name !== undefined) template.name = name;
    if (layout !== undefined) template.layout = { ...template.layout.toObject?.() || template.layout, ...layout };
    if (styling !== undefined) template.styling = { ...template.styling.toObject?.() || template.styling, ...styling };
    if (fields !== undefined) template.fields = fields;
    if (customText !== undefined) template.customText = { ...template.customText.toObject?.() || template.customText, ...customText };

    // Increment version on significant changes
    if (layout || styling || fields) {
      template.version = (template.version || 1) + 1;
    }

    await template.save();
    return responseStatus(res, 200, 'success', template);
  } catch (error) {
    return responseStatus(res, 500, 'failed', error.message);
  }
};

// DELETE /api/v1/admin/card-templates/:id
exports.deleteCardTemplate = async (req, res) => {
  try {
    const schoolId = req.userAuth?.schoolId;
    const template = await CardTemplate.findOne({ _id: req.params.id, schoolId });
    if (!template) return responseStatus(res, 404, 'failed', 'Template not found');
    if (template.isActive) return responseStatus(res, 400, 'failed', 'Cannot delete the active template. Activate another template first.');

    await CardTemplate.deleteOne({ _id: req.params.id });
    return responseStatus(res, 200, 'success', 'Template deleted');
  } catch (error) {
    return responseStatus(res, 500, 'failed', error.message);
  }
};

// POST /api/v1/admin/card-templates/:id/activate
exports.activateCardTemplate = async (req, res) => {
  try {
    const schoolId = req.userAuth?.schoolId;
    const template = await CardTemplate.findOne({ _id: req.params.id, schoolId });
    if (!template) return responseStatus(res, 404, 'failed', 'Template not found');

    // Deactivate all other templates of the same type for this school
    await CardTemplate.updateMany(
      { schoolId, entityType: template.entityType, _id: { $ne: template._id } },
      { isActive: false }
    );

    template.isActive = true;
    await template.save();

    return responseStatus(res, 200, 'success', template);
  } catch (error) {
    return responseStatus(res, 500, 'failed', error.message);
  }
};

// GET /api/v1/admin/card-templates/available-fields/:entityType
exports.getAvailableFields = async (req, res) => {
  try {
    const { entityType } = req.params;
    const fields = entityType === 'teacher' ? DEFAULT_STAFF_FIELDS : DEFAULT_STUDENT_FIELDS;
    return responseStatus(res, 200, 'success', fields);
  } catch (error) {
    return responseStatus(res, 500, 'failed', error.message);
  }
};

// POST /api/v1/admin/card-templates/ensure-default
// Creates a default template for the school if none exists
exports.ensureDefaultTemplate = async (req, res) => {
  try {
    const schoolId = req.userAuth?.schoolId;
    if (!schoolId) return responseStatus(res, 400, 'failed', 'School context required');

    const results = [];

    for (const entityType of ['student', 'teacher']) {
      const existing = await CardTemplate.findOne({ schoolId, entityType });
      if (existing) {
        results.push({ entityType, status: 'exists', templateId: existing._id });
        continue;
      }

      const defaultFields = entityType === 'student' ? DEFAULT_STUDENT_FIELDS : DEFAULT_STAFF_FIELDS;
      const template = await CardTemplate.create({
        schoolId,
        name: `Default ${entityType === 'student' ? 'Student' : 'Teacher'} Card`,
        entityType,
        layout: {
          orientation: 'portrait',
          showQRCode: true,
          qrPosition: 'bottom-right',
          showPhoto: true,
          photoPosition: 'top-right',
          showSchoolLogo: true,
        },
        styling: {
          primaryColor: entityType === 'student' ? '#3B82F6' : '#1E40AF',
          secondaryColor: '#10B981',
          accentColor: '#F59E0B',
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
          borderColor: '#E5E7EB',
          borderWidth: 1,
          headerStyle: 'gradient',
        },
        fields: defaultFields,
        createdBy: req.userAuth?.id,
        version: 1,
        isActive: true,
      });

      results.push({ entityType, status: 'created', templateId: template._id });
    }

    return responseStatus(res, 200, 'success', results);
  } catch (error) {
    return responseStatus(res, 500, 'failed', error.message);
  }
};
