const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getAllUsers,
  deleteUser,
  createUser,
  updateUser
} = require("../controllers/user.controller");

router.get("/", verifyToken, getAllUsers);
router.post("/", verifyToken, createUser);   // إضافة مستخدم جديد
router.delete("/:id", verifyToken, deleteUser);
router.put("/:id", verifyToken, updateUser);  //  إضافة التعديل

module.exports = router;
