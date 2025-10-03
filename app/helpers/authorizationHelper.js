const jwt = require("jsonwebtoken");

// Verify JWT
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.user = decoded; // store user payload (username, role, etc.)
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}

// Role checker
function authorizeRoles(...roles) {
  return (req, res, next) => {
    console.log(req.decoded.userrole);
    if (!roles.includes(req.decoded.userrole)) {
      return res.status(403).send({ success: false, id: 102, msg: 'Unauthorizatied access.' });
    }
    next();
  };
}

module.exports = { authenticate, authorizeRoles };