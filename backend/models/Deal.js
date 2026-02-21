const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  customer: {
   type: mongoose.Schema.Types.ObjectId,
  ref: "Customer",
  required: true
  },
  value: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "won", "lost"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Deal", dealSchema);
