const jwt = require("jsonwebtoken");
const User = require("../models/User");

const AppError = require("../utils/AppError");//bonus


exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ 
      username, 
      email, 
      password
     });
    const savedUser = await newUser.save();

    const { password: pwd, ...others } = savedUser._doc;
    res.status(201).json(others);

  } catch (err) {
    next(err) ;
 }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      throw new AppError("User not found", 404, "E001");

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      throw new AppError("Wrong password", 400, "E002");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 86400000
    });

    res.status(200).json({ message: "Login successful" });

  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};
