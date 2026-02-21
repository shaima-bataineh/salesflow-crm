const Customer = require("../models/Customer");

const AppError = require("../utils/AppError");// bonus 


exports.createCustomer = async (req, res, next) => {
  try {
    const newCustomer = new Customer({
      ...req.body,
      createdBy: req.user.id
    });

    const saved = await newCustomer.save();
    res.status(201).json(saved);

  } catch (err) {
    next(err);
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
    let customers;

    if (req.user.role === "admin") {
      customers = await Customer.find().populate("createdBy", "username");
    } else {
      customers = await Customer.find({ createdBy: req.user.id });
    }

    res.status(200).json(customers);

  } catch (err) {
    next(err);
  }
};

// update customer 

exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer)
      return res.status(404).json({ error: "Customer not found" });

    // فقط admin أو الشخص الذي أنشأ العميل يمكنه التعديل
    if (req.user.role !== "admin" && customer.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    res.status(200).json({ message: "Customer updated", customer: updatedCustomer });
  } catch (err) {
    next(err);
  }
};

// delete customer 

exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

     // تحقق من صلاحية الـ ID
    if (!require("mongoose").Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid deal id" });
    }
  
    // فقط admin أو الشخص الذي أنشأ العميل يمكنه الحذف
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied: only admin can delete" });
    }
     const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) 
       throw new AppError("Customer not found", 404, "E001");

    res.status(200).json({ message: "Customer deleted", customer: deletedCustomer });
  } catch (err) {
    next(err);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer)

     throw new AppError("Customer not found", 404, "E001");

    if (
      req.user.role !== "admin" &&
      customer.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.status(200).json(customer);

  } catch (err) {
    next(err);
  }
};
