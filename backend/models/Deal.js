const mongoose = require("mongoose");


const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },

  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
     required: false
  },

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
  },

  value: { type: Number, required: true },

  status: {
    type: String,
    enum: ["pending", "won", "lost"],
    default: "pending"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
     required: true
  },
  
}, { timestamps: true });

module.exports = mongoose.model("Deal", dealSchema);