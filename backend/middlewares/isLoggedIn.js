const verifyToken = require("../utils/verifyToken");

const isLoggedIn = (req, res, next) => {
  // get token from header
  const headerObj = req.headers;
  const authorization = headerObj.authorization || headerObj.Authorization;

  if (!authorization) {
    return res.status(401).json({
      status: "failed",
      message: "No token provided",
    });
  }

  const parts = authorization.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(400).json({
      status: "failed",
      message: "Invalid token format",
    });
  }

  const token = parts[1];

  // verify token
  const verify = verifyToken(token);

  if (verify && verify._id) {
    // Attach convenient fields for downstream middlewares
    // Include both .id and ._id for compatibility with different controllers
    req.userAuth = {
      ...verify,
      id: verify._id,  // Some controllers use .id
      _id: verify._id  // Some controllers use ._id
    };
    req.userId = verify._id || verify.id;
    req.userRole = verify.role;
    req.schoolId = verify.schoolId || null;
    next();
  } else {
    res.status(401).json({
      status: "failed",
      message: "Invalid/expired token",
    });
  }
};
module.exports = isLoggedIn;
