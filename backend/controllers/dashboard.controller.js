const User = require("../models/User");
const Customer = require("../models/Customer");
const Deal = require("../models/Deal");
const Lead = require("../models/Lead");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const user = req.user; // جاي من verifyToken
    const monthNames = [
      "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    if (user.role === "admin") {
      // Monthly Aggregation
      const monthlyStatsRaw = await Deal.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            deals: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "won"] }, "$value", 0]
              }
            }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      const monthlyStats = monthlyStatsRaw.map(item => ({
        month: monthNames[item._id],
        deals: item.deals,
        revenue: item.revenue
      }));

      // General Counts
      const totalUsers = await User.countDocuments();
      const totalCustomers = await Customer.countDocuments();
      const totalDeals = await Deal.countDocuments();
      const totalLeads = await Lead.countDocuments();

      // Deals Status Aggregation
      const dealStats = await Deal.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalValue: {
              $sum: {
                $cond: [{ $eq: ["$status", "won"] }, "$value", 0]
              }
            }
          }
        }
      ]);

      const wonDeals = dealStats.find(d => d._id === "won")?.count || 0;
      const lostDeals = dealStats.find(d => d._id === "lost")?.count || 0;
      const pendingDeals = dealStats.find(d => d._id === "pending")?.count || 0;
      const totalRevenue = dealStats.find(d => d._id === "won")?.totalValue || 0;

      const conversionRate = totalLeads
        ? Number(((wonDeals / totalLeads) * 100).toFixed(2))
        : 0;

      return res.status(200).json({
        success: true,
        role: user.role,
        totalUsers,
        totalCustomers,
        totalDeals,
        totalLeads,
        wonDeals,
        lostDeals,
        pendingDeals,
        totalRevenue,
        conversionRate,
        monthlyStats
      });
    }

    if (user.role === "sales") {
      // Deals, Customers, Leads for this sales rep
      const myDeals = await Deal.find({ salesRep: user.id });
      const myCustomers = await Customer.find({ assignedTo: user.id });
      const myLeads = await Lead.find({ assignedTo: user.id });

      // Monthly Aggregation for sales rep only
      const monthlyStatsRaw = await Deal.aggregate([
        { $match: { salesRep: user.id } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            deals: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "won"] }, "$value", 0]
              }
            }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      const monthlyStats = monthlyStatsRaw.map(item => ({
        month: monthNames[item._id],
        deals: item.deals,
        revenue: item.revenue
      }));

      const wonDeals = myDeals.filter(d => d.status === "won").length;
      const lostDeals = myDeals.filter(d => d.status === "lost").length;
      const pendingDeals = myDeals.filter(d => d.status === "pending").length;
      const totalRevenue = myDeals
        .filter(d => d.status === "won")
        .reduce((acc, d) => acc + d.value, 0);

      const conversionRate = myLeads.length
        ? Number(((wonDeals / myLeads.length) * 100).toFixed(2))
        : 0;

      return res.status(200).json({
        success: true,
        role: user.role,
        totalDeals: myDeals.length,
        totalCustomers: myCustomers.length,
        totalLeads: myLeads.length,
        wonDeals,
        lostDeals,
        pendingDeals,
        totalRevenue,
        conversionRate,
        monthlyStats
      });
    }

    // إذا الدور غير admin أو sales
    return res.status(403).json({ message: "Not authorized" });

  } catch (err) {
    next(err);
  }
};