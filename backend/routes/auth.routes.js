const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");


//=== REGISTER ==
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password,role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = await User.create({ 
      username,
       email,
      password,
    role: role || "sales" 
  });

    // إنشاء توكن JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    next(err); 
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    const { password: pwd, ...others } = user._doc;

    res.status(200).json({
      message: "Login successful",
      user: others
    });
  }   catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======= LOGOUT =======
router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "No token found" });
    }

    // نفك التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // نجيب المستخدم من الداتا بيس
    const user = await User.findById(decoded.id).select("-password");

    // نمسح الكوكي
    res.clearCookie("token");

    res.status(200).json({
      message: "Logged out successfully",
      user: user
    });

  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
});
module.exports = router;
