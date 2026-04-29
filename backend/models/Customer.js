const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email:{ type: String, required:true, unique:true, lowercase:true, trim:true},
  phone: String,
  company: String,
  location: String,
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  // isDeleted: { type: Boolean, default: false },
  // deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
