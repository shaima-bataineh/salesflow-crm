const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/authorizeRoles");
const { validateCreateLead, validateUpdateLead } = require("../validation/leadValidation");
const verifyToken = require("../middleware/verifyToken");

const {
    createLead,
    getAllLeads,
    getLeadById,
    updateLead,
    deleteLead,
    convertLeadToCustomerAndCreateDeal,
} = require("../controllers/lead.controller");

// creat lead (Admin + Sales)
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "sales"),
  validateCreateLead,
  createLead
);

// get all leads (Admin + Sales)
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "sales"),
  getAllLeads
);

// get one lead (Admin + Sales)
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "sales"),
  getLeadById
);

// update lead (Admin + Sales)
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "sales"),
  validateUpdateLead,
  updateLead
);

// delete lead (Admin فقط)
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteLead
);

// convert lead to deal (Admin فقط)
router.post(
  "/:id/convert",
  verifyToken,
  authorizeRoles("admin"),
  convertLeadToCustomerAndCreateDeal
);
module.exports = router;



