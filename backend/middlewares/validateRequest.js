// Lightweight request body validator
// Schema format:
// { fieldName: { type: 'string'|'number'|'boolean'|'object'|'email', required: true } }

const responseStatus = require("../handlers/responseStatus.handler.js");

const typeCheckers = {
  string: (v) => typeof v === "string",
  number: (v) => typeof v === "number" && !isNaN(v),
  boolean: (v) => typeof v === "boolean",
  object: (v) => v && typeof v === "object" && !Array.isArray(v),
  array: (v) => Array.isArray(v),
  email: (v) => typeof v === "string" && /^\S+@\S+\.\S+$/.test(v),
};

const validateBody = (schema) => (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = [];
    for (const [key, rule] of Object.entries(schema)) {
      const val = body[key];
      if (rule.required && (val === undefined || val === null || val === "")) {
        errors.push(`${key} is required`);
        continue;
      }
      if (val !== undefined && rule.type) {
        const checker = typeCheckers[rule.type];
        if (checker) {
          if (!checker(val)) errors.push(`${key} should be of type ${rule.type}`);
        }
      }
    }

    if (errors.length) return responseStatus(res, 400, "failed", errors.join(", "));
    next();
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

module.exports = { validateBody };
