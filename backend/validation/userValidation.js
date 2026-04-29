const { body, validationResult } = require("express-validator");

// Validation عند إنشاء مستخدم جديد
exports.validateCreateUser = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
     .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
     .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
     .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
     .matches(/[0-9]/).withMessage("Password must contain at least one number")
     .matches(/[\W_]/).withMessage("Password must contain at least one special character"),

  body("role")
    .isIn(["admin", "sales"])
    .withMessage("Role must be either 'admin' or 'sales'"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

// Validation عند تحديث المستخدم
exports.validateUpdateUser = [
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["admin", "sales"]).withMessage("Role must be either 'admin' or 'sales'"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];