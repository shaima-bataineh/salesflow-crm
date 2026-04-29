const { body, validationResult } = require("express-validator");

exports.validateCreateDeal = [
  body("lead").notEmpty().withMessage("Lead ID is required"),
  body("value").isNumeric().withMessage("Value must be a number"),
  body("status")
    .optional()
    .isIn(["pending", "won", "lost"])
    .withMessage("Status must be pending, won, or lost"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation عند تحديث Deal
exports.validateUpdateDeal = [
  body("value").optional().isNumeric().withMessage("Value must be a number"),
  body("status")
    .optional()
    .isIn(["pending", "won", "lost"])
    .withMessage("Status must be pending, won, or lost"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];