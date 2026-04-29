const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const Deal = require("../models/Deal")
const AppError = require("../utils/AppError");

// Create Lead
exports.createLead = async (req, res, next) => {
  try {
    const newLead = new Lead({
      ...req.body,
      createdBy: req.user.id
    });

    const saved = await newLead.save();
    res.status(201).json(saved);

  } catch (err) {
    next(err);
  }
};

// Get All Leads
exports.getAllLeads = async (req, res, next) => {
  try {
    let leads;

    if (req.user.role === "admin") {
      leads = await Lead.find({
        status: { $ne: "converted" }
      });
    } else {
      leads = await Lead.find({ 
        createdBy: req.user.id,
        status: { $ne: "converted" }
     });
   }

    res.status(200).json(leads);

  } catch (err) {
    next(err);
  }
};


// Get Lead By ID
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead)
      throw new AppError("Lead not found", 404, "E002");

    if (req.user.role !== "admin" && lead.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.status(200).json(lead);

  } catch (err) {
    next(err);
  }
};


//  Update Lead
exports.updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    if (!lead)
      throw new AppError("Lead not found", 404, "E002");

    if (req.user.role !== "admin" && lead.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    
    res.status(200).json({ message: "Lead updated", lead: updatedLead });

  } catch (err) {
    next(err);
  }
};


// Delete Lead
exports.deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    if (!lead)
      throw new AppError("Lead not found", 404, "E002");

    //  لا نحذف lead متحول
    if (lead.status === "converted") {
      return res.status(400).json({ error: "Cannot delete converted lead" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can delete leads" });
    }

    await Lead.findByIdAndDelete(id);

    res.status(200).json({ message: "Lead deleted successfully" });

  } catch (err) {
    next(err);
  }
};

exports.convertLeadToCustomerAndCreateDeal = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(new AppError("Lead not found", 404, "E002"));

    if (lead.status === "converted") {
      return res.status(400).json({ error: "Lead already converted" });
    }

    //  إنشاء أو جلب Customer
    let customer = await Customer.findOne({ email: lead.email });

    if (!customer) {
      customer = await Customer.create({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        lead: lead._id,
        createdBy: req.user.id
      });
    }

    //  إنشاء Deal 
    const deal = await Deal.create({
      title: `${lead.name} Deal`,
      lead: lead._id,          
      customer: customer._id,
      value: req.body.value || 0, 
      status: "pending",
      createdBy: req.user.id    
    });

    //  تحديث Lead
    lead.status = "converted";
    await lead.save();

    res.status(201).json({
      message: "Lead converted to Customer & Deal",
      customer,
      deal
    });

  } catch (err) {
    console.error(err); 
    next(err);
  }
};