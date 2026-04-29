const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/verifyToken");
// const authorizeRoles = require("../middleware/authorizeRoles");
const { getDashboardStats } = require("../controllers/dashboard.controller");


router.get("/", authMiddleware, getDashboardStats);


module.exports = router;