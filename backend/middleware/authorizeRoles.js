const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user.role) {
      return res.status(403).json({ error: "No role assigned" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Role ${req.user.role} is not allowed to access this resource`
      });
    }

    next();
  };
};

module.exports = authorizeRoles;