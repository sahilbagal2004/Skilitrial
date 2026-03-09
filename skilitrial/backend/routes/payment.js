import express from "express";
import razorpay from "../config/razorpay.js";   // ✅ ADD HERE
import crypto from "crypto";

const router = express.Router();

/* ================= CREATE ORDER ================= */

router.post("/create-order", async (req, res) => {

  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt_" + Date.now()
  };

  try {

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Order creation failed"
    });

  }

});

/* ================= VERIFY PAYMENT ================= */

router.post("/verify-payment", (req, res) => {

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {

    res.json({
      success: true,
      message: "Payment verified"
    });

  } else {

    res.status(400).json({
      success: false,
      message: "Payment verification failed"
    });

  }

});

export default router;