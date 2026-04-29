const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const { validateCreateCustomer, validateUpdateCustomer } = require("../validation/customerValidation");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customer.controller");

// CRUD كامل للعملاء
router.post("/", verifyToken, validateCreateCustomer, createCustomer);
router.get("/", verifyToken, getCustomers);
router.get("/:id", verifyToken, getCustomerById);
router.put("/:id", verifyToken, validateUpdateCustomer, updateCustomer);
router.delete("/:id", verifyToken, deleteCustomer);

module.exports = router;