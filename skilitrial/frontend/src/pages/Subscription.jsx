import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Subscription.css";

const API = "https://skilitrial-backend.onrender.com";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "/month",
    tag: null,
    desc: "Get started with the basics and explore what Skilitrial offers.",
    features: [
      "Limited Skill Trials",
      "Basic Job Listings",
      "Community Support",
      "Profile Creation",
    ],
    cta: "Current Plan",
    disabled: true,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    period: "/month",
    tag: "Most Popular",
    desc: "Everything you need to land your next role, faster.",
    features: [
      "Unlimited Skill Trials",
      "Priority Job Matching",
      "AI Resume Review",
      "Interview Preparation",
      "Premium Support",
    ],
    cta: "Get Pro",
    disabled: false,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 999,
    period: "/month",
    tag: null,
    desc: "Full-suite access for serious candidates and hiring teams.",
    features: [
      "Everything in Pro",
      "Recruiter Connect",
      "Advanced Analytics",
      "Dedicated Support",
      "Hiring Insights",
    ],
    cta: "Get Enterprise",
    disabled: false,
    popular: false,
  },
];

const VALID_COUPONS = { SKILL10: 10, TRIAL20: 20 };

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2" opacity="0.3"/>
      <path d="M4 7l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Subscription() {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState(null); // "success" | "error"
  const [couponMsg, setCouponMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(null); // plan id

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      const pct = VALID_COUPONS[code];
      setDiscount(pct);
      setCouponStatus("success");
      setCouponMsg(`${pct}% discount applied!`);
    } else {
      setDiscount(0);
      setCouponStatus("error");
      setCouponMsg("Invalid coupon code.");
    }
  };

  const discountedPrice = (base) =>
    base === 0 ? 0 : Math.round(base - (base * discount) / 100);

  const handlePayment = async (plan) => {
    if (plan.disabled) return;
    const finalPrice = discountedPrice(plan.price);
    try {
      setLoading(plan.id);
      const res = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalPrice }),
      });
      if (!res.ok) throw new Error("Order creation failed");
      const order = await res.json();
      if (!window.Razorpay) { alert("Razorpay SDK not loaded"); return; }
      const options = {
        key: "rzp_test_SPEDgGnU1O1PfT",
        amount: order.amount,
        currency: "INR",
        name: "Skilitrial",
        description: `${plan.name} Subscription`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verify = await fetch(`${API}/api/payment/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const result = await verify.json();
            if (result.success) {
              setSuccess(true);
              setTimeout(() => setSuccess(false), 4000);
            } else {
              alert("Payment verification failed");
            }
          } catch { alert("Verification error"); }
        },
        theme: { color: "#6c63ff" },
      };
      new window.Razorpay(options).open();
    } catch { alert("Payment request failed. Check backend server."); }
    finally { setLoading(null); }
  };

  return (
    <div className="sub-root">
      {/* Background */}
      <div className="sub-bg" aria-hidden="true">
        <div className="sub-glow-1" />
        <div className="sub-glow-2" />
        <div className="sub-grid" />
      </div>

      <div className="sub-page">
        {/* Header */}
        <motion.div
          className="sub-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="sub-eyebrow">Pricing</span>
          <h1>Choose Your Plan</h1>
          <p>Upgrade to unlock premium features and get hired faster.</p>
        </motion.div>

        {/* Coupon */}
        <motion.div
          className="sub-coupon"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={`coupon-input-wrap ${couponStatus ? `coupon-${couponStatus}` : ""}`}>
            <svg className="coupon-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M1 8.5L6.5 3l1.5 1.5-1 1L8.5 7l1-1L11 7.5 5.5 13 1 8.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              <circle cx="10.5" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            <input
              type="text"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => { setCoupon(e.target.value); setCouponStatus(null); setCouponMsg(""); }}
              onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
            />
            <button className="coupon-apply-btn" onClick={applyCoupon}>Apply</button>
          </div>
          <AnimatePresence>
            {couponMsg && (
              <motion.p
                className={`coupon-msg ${couponStatus}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {couponStatus === "success" ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M3.5 6.5l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M6.5 4v3M6.5 9v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                )}
                {couponMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Plans */}
        <div className="sub-plans">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              className={`plan-card ${plan.popular ? "plan-popular" : ""}`}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
            >
              {plan.tag && <div className="plan-tag">{plan.tag}</div>}

              <div className="plan-top">
                <div className="plan-name-row">
                  <span className="plan-name">{plan.name}</span>
                  {plan.popular && <div className="plan-glow-dot" />}
                </div>
                <p className="plan-desc">{plan.desc}</p>
              </div>

              <div className="plan-price-row">
                <span className="plan-currency">₹</span>
                <span className="plan-price">
                  {plan.price === 0 ? "0" : discountedPrice(plan.price)}
                </span>
                <span className="plan-period">{plan.period}</span>
                {discount > 0 && plan.price > 0 && (
                  <span className="plan-original">₹{plan.price}</span>
                )}
              </div>

              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`plan-btn ${plan.popular ? "plan-btn-primary" : "plan-btn-outline"} ${plan.disabled ? "plan-btn-current" : ""}`}
                disabled={plan.disabled || loading === plan.id}
                onClick={() => handlePayment(plan)}
              >
                {loading === plan.id ? (
                  <span className="btn-loading">
                    <span className="spinner" /> Processing…
                  </span>
                ) : plan.disabled ? (
                  plan.cta
                ) : (
                  <>
                    {plan.cta}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Trust line */}
        <motion.p
          className="sub-trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1L8 4.5l3.8.55-2.75 2.68.65 3.77L6.5 9.6l-3.4 1.9.65-3.77L1 5.05 4.8 4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
          Secure payments via Razorpay · Cancel anytime · No hidden fees
        </motion.p>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="sub-toast"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sub-toast-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1.4"/>
                <path d="M5 9l3 3 5-6" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="toast-title">Payment successful!</p>
              <p className="toast-sub">Your subscription is now active.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}