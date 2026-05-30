const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");//bonus


exports.createUserByAdmin = async (req, res, next) => {
  try {
    // تحقق من إن المستخدم هو admin
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ username, email, password, role });
    const savedUser = await newUser.save();

    const { password: pwd, ...others } = savedUser._doc; // saveduser._doc
    res.status(201).json(others);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => { // next 
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
     // بخزن ال تةكين داخل كوكي في المتصفح بعد ما المستخدم يعمل تسجيل دخول
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict", // هاي حماية من الاتاك يعني الكوكي ما حتنبعث الا اذا الطلب جاي من الموقع نفسه
      secure: false, // send cookie if the site is http if was https should be true
      maxAge: 86400000 // expire in  mile secod
    });

    res.status(200).json({ 
      message: "Login successful" ,
      user: {
    id: user._id,
    role: user.role,
    username: user.username
  }
});

  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};
