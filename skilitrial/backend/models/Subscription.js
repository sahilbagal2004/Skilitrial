const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({

  userId: String,
  plan: String,
  price: Number,
  startDate: Date,
  endDate: Date,
  paymentId: String

});

module.exports = mongoose.model("Subscription", subscriptionSchema);