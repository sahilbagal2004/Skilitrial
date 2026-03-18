import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

/* ================= CREATE ORDER ================= */

router.post("/create-order", async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      return res.status(500).json({ message: "Razorpay credentials not configured on server" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    });

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {
    console.error("Razorpay create-order error:", err);
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
});

/* ================= VERIFY PAYMENT ================= */

router.post("/verify-payment", (req, res) => {
  if (!process.env.RAZORPAY_SECRET) {
    return res.status(500).json({ success: false, message: "Razorpay secret not configured on server" });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Signature mismatch" });
  }
});

export default router;