const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  getAllUsers,
  deleteUser,
  createUser,
  updateUser
} = require("../controllers/user.controller");

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);
router.post("/", verifyToken, authorizeRoles("admin"), createUser);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);
router.put("/:id", verifyToken, updateUser);

module.exports = router;