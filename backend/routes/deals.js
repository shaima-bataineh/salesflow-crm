const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  createDeal,
  getDeals,
  getDealById,
  updateDeal,
  deleteDeal
} = require("../controllers/deal.controller");

// CRUD كامل للصفقات
router.post("/", verifyToken, createDeal);
router.get("/", verifyToken, getDeals);
router.get("/:id", verifyToken, getDealById);
router.put("/:id", verifyToken, updateDeal);
router.delete("/:id", verifyToken, deleteDeal);

module.exports = router;