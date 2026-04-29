const Deal = require("../models/Deal");
const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const AppError = require("../utils/AppError");// bonus


exports.createDeal = async (req, res, next) => {
  try {
    const newDeal = new Deal({
      ...req.body,
      createdBy: req.user.id
    });

    const saved = await newDeal.save();
    res.status(201).json(saved);

  } catch (err) {
    next(err);
  }
};

exports.getDeals = async (req, res, next) => {
  try {
    let deals;

    if (req.user.role === "admin") {
      deals = await Deal.find().populate("customer");
    } else {
      deals = await Deal.find({ createdBy: req.user.id });
    }

    res.status(200).json(deals);

  } catch (err) {
    next(err);
  }
};


exports.getDealById = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id).populate("customer");
    if (!deal) 
       throw new AppError("Deal not found", 404, "E001");

    if (req.user.role !== "admin" && deal.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.status(200).json(deal);
  } catch (err) {
    next(err);
  }
};

exports.updateDeal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findById(id);
    if (!deal) {
      throw new AppError("Deal not found", 404, "E001");
    }

    // Authorization
    if (req.user.role !== "admin" && deal.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // تحديث القيم
    deal.status = req.body.status ?? deal.status;
    deal.value = req.body.value ?? deal.value;

    // إذا الصفقة ربحت وما في customer
    if (deal.status === "won" && !deal.customer) {

      const lead = await Lead.findById(deal.lead);
      if (!lead) {
        throw new AppError("Lead not found", 404, "E002");
      }

      //  تحقق إذا Customer موجود مسبقاً بنفس الإيميل
      let customer = await Customer.findOne({ email: lead.email });

      if (!customer) {
        // إنشاء Customer جديد
        customer = await Customer.create({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          createdBy: deal.createdBy
        });
      }

      // ربط Deal بالـ Customer
      deal.customer = customer._id;

      // تحديث حالة Lead
      lead.status = "converted";
      await lead.save();
    }

    await deal.save();

    res.status(200).json({
      message: "Deal updated successfully",
      deal
    });

  } catch (err) {
    next(err);
  }
};

exports.deleteDeal = async (req, res,next) => {
  try {
    const { id } = req.params;

    // تحقق من صلاحية الـ ID
    if (!require("mongoose").Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid deal id" });
    }

    const deal = await Deal.findById(id);
    if (!deal) 
         throw new AppError("Deal not found", 404, "E001");// bonus

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied: only admin can delete" });
    }
     const deletedDeal = await Deal.findByIdAndDelete(id);

     res.status(200).json({ message: "Deal deleted", deal: deletedDeal });
  } catch (err) {
    next(err);
  }
};
