import { useState } from "react";
import "./Subscription.css";

const API = "https://skilitrial-backend.onrender.com";

function Subscription() {

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= APPLY COUPON ================= */

  const applyCoupon = () => {
    if (coupon === "SKILL10") {
      setDiscount(10);
      alert("Coupon Applied 🎉 10% Discount");
    } else {
      alert("Invalid Coupon");
    }
  };

  /* ================= PAYMENT ================= */

  const handlePayment = async (price) => {

    const finalPrice = price - (price * discount / 100);

    try {

      setLoading(true);

      /* Create Razorpay order from backend */

      const res = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: finalPrice })
      });

      if (!res.ok) {
        throw new Error("Order creation failed");
      }

      const order = await res.json();

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: "rzp_test_SPEDgGnU1O1PfT",

        amount: order.amount,
        currency: "INR",
        name: "Skilitrial",
        description: "Subscription Payment",
        order_id: order.id,

        handler: async function (response) {

          try {

            const verify = await fetch(`${API}/api/payment/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(response)
            });

            const result = await verify.json();

            if (result.success) {
              setSuccess(true);

              setTimeout(() => {
                setSuccess(false);
              }, 3000);

            } else {
              alert("Payment verification failed");
            }

          } catch (err) {
            console.error(err);
            alert("Verification error");
          }

        },

        theme: {
          color: "#4f46e5"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {

      console.error(err);
      alert("Payment request failed. Check backend server.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-page">

      <div className="subscription-header">
        <h1>Choose Your Plan</h1>
        <p>Upgrade your account to unlock premium features.</p>
      </div>

      {/* ================= COUPON ================= */}

      <div className="coupon-box">

        <input
          type="text"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />

        <button onClick={applyCoupon}>
          Apply
        </button>

      </div>

      <div className="plans-container">

        {/* FREE PLAN */}

        <div className="plan-card">

          <h2>Free</h2>

          <p className="price">
            ₹0<span>/month</span>
          </p>

          <ul className="features">
            <li>✔ Limited Skill Trials</li>
            <li>✔ Basic Job Listings</li>
            <li>✔ Community Support</li>
            <li>✔ Profile Creation</li>
          </ul>

          <button className="plan-btn current">
            Current Plan
          </button>

        </div>

        {/* PRO PLAN */}

        <div className="plan-card popular">

          <div className="badge">
            Most Popular
          </div>

          <h2>Pro</h2>

          <p className="price">
            ₹{499 - (499 * discount / 100)}
            <span>/month</span>
          </p>

          <ul className="features">
            <li>✔ Unlimited Skill Trials</li>
            <li>✔ Priority Job Matching</li>
            <li>✔ AI Resume Review</li>
            <li>✔ Interview Preparation</li>
            <li>✔ Premium Support</li>
          </ul>

          <button
            className="plan-btn buy"
            disabled={loading}
            onClick={() => handlePayment(499)}
          >
            {loading ? "Processing..." : "Buy Plan"}
          </button>

        </div>

        {/* ENTERPRISE */}

        <div className="plan-card">

          <h2>Enterprise</h2>

          <p className="price">
            ₹{999 - (999 * discount / 100)}
            <span>/month</span>
          </p>

          <ul className="features">
            <li>✔ Everything in Pro</li>
            <li>✔ Recruiter Connect</li>
            <li>✔ Advanced Analytics</li>
            <li>✔ Dedicated Support</li>
            <li>✔ Hiring Insights</li>
          </ul>

          <button
            className="plan-btn buy"
            disabled={loading}
            onClick={() => handlePayment(999)}
          >
            {loading ? "Processing..." : "Buy Plan"}
          </button>

        </div>

      </div>

      {/* ================= SUCCESS POPUP ================= */}

      {success && (
        <div className="payment-success">
          🎉 Payment Successful! Subscription Activated.
        </div>
      )}

    </div>
  );
}

export default Subscription;