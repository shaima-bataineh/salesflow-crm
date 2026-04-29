const User = require("../models/User");

const AppError = require("../utils/AppError");

exports.getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Access denied" });

    const users = await User.find().select("-password");
    res.status(200).json(users);

  } catch (err) {
    next(err);
  }
};

const bcrypt = require("bcryptjs");

exports.createUser = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Access denied" });

    const { username, email, password, role } = req.body;

    // تحقق إذا المستخدم موجود
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "The user already exists" });

    // إذا ما حدد الـ role، خليه sales
    const newUser = new User({
      username,
      email,
      password, // pre-save hook رح يشفرها
      role: role || "sales"
    });

    await newUser.save();

    // ما نرسل كلمة المرور للـ frontend
    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    res.status(201).json({ message: "User added", user: userToReturn });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // فقط الـ admin أو صاحب الحساب نفسه يمكنه التعديل
    const { id } = req.params;

   if (req.user.role !== "admin" &&req.user.id !== id)  
   return res.status(403).json({ error: "Access denied" });

    const { username, email, password, role } = req.body;

    const updateData = { username, email };
    
    // إذا فيه كلمة مرور جديدة، شيفريها
    if (password) {
      const bcrypt = require("bcryptjs");
      updateData.password = await bcrypt.hash(password, 10);
    }

    // إذا admin يقدر يغير الرول
    if (req.user.role === "admin" && role) {
      updateData.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { returnDocument: "after" }).select("-password");

    if (!updatedUser) 
       throw new AppError("User not found", 404, "E001");// bonus

    res.status(200).json({ message: "User has been modified", user: updatedUser });

  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {

    //  return res.status(200).json(req.user.role)

  try {
        const { id } = req.params;
        const user = await User.findById(id);
    if (!user) 
      throw next(new AppError("User not found", 404, "E003"));

// if not admin prevent delete
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Access denied: only admin can delete" });
    if (req.user.id === id)
  return res.status(400).json({ error: "Admin cannot delete himself" });

    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json(
      {message:"User deleted",
        user:deletedUser, //recive all the data 
      });

  } catch (err) {
    next(err);
  }
};
