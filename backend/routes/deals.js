const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { validateCreateDeal,validateUpdateDeal } = require("../validation/dealValidation");

const {
  createDeal,
  getDeals,
  getDealById,
  updateDeal,
  deleteDeal
} = require("../controllers/deal.controller");

// CRUD كامل للصفقات
router.post("/", verifyToken ,validateCreateDeal, createDeal);
router.get("/", verifyToken, getDeals);
router.get("/:id", verifyToken, getDealById);
router.put("/:id", verifyToken,validateUpdateDeal, updateDeal);
router.delete("/:id", verifyToken, deleteDeal);

module.exports = router;