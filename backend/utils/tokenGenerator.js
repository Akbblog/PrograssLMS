const jwt = require("jsonwebtoken");

const generateToken = (id, role, schoolId) => {
  const payload = {
    _id: id,
    role: role || "admin",
  };

  // Add schoolId if provided (not needed for super_admin)
  if (schoolId) {
    payload.schoolId = schoolId;
  }

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "6d" });
};

module.exports = generateToken;
