const User = require("../models/User");
const Customer = require("../models/Customer");
const Deal = require("../models/Deal");

exports.getDashboardStats = async (req, res, next) => {
  try {
    // عد المستخدمين
    const totalUsers = await User.countDocuments();
    const totalCustomers = await Customer.countDocuments();//countdoc use to calcolate the number of 
    const totalDeals = await Deal.countDocuments();

    // عد الصفقات حسب الحاله
    const wonDeals = await Deal.countDocuments({ status: "won" });
    const lostDeals = await Deal.countDocuments({ status: "lost" });
    const pendingDeals = await Deal.countDocuments({ status: "pending" });

    // إجمالي الإيرادات للصفقات يلي نجحو 
    const revenueData = await Deal.aggregate([
      { $match: { status: "won" } },
      { $group: { _id: null, total: { $sum: "$value" } } }
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    // Response
    res.status(200).json({
      success: true,
      totalUsers,
      totalCustomers,
      totalDeals,
      wonDeals,
      lostDeals,
      pendingDeals,
      totalRevenue
    });

  } catch (err) {
    console.error("Dashboard Error:", err); // حيظهر هون لو في خطا 
    next(err);
  }
};