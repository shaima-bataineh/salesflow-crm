const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { validateCreateUser } = require("../validation/userValidation");
const { createUserByAdmin , login, logout } = require("../controllers/auth.controller");
const verifyToken = require("../middleware/verifyToken");
const authorizeRoles = require("../middleware/authorizeRoles"); 

router.post(
  "/admin/create-user",
  verifyToken,
  // authorizeRoles("admin"),
  validateCreateUser,
createUserByAdmin 
);

// LOGIN
router.post(
  "/login",
  login
);

// LOGOUT
router.post(
  "/logout",
  logout
);

// GET CURRENT USER
router.get("/me", async (req, res) => {

  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);

  } catch {
     res.status(401).json({
      message: "Invalid token"
    });

  }

});

module.exports = router;

