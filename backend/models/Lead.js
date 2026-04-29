const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  company: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  isConverted: {
  type: Boolean,
  default: false,
},
  status: {
  type: String,
  enum: ["new", "contacted", "qualified", "converted"],
  default: "new"
},
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);