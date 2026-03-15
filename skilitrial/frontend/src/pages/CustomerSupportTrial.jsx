import "./CustomerSupportTrial.css";
import { motion } from "framer-motion";
import { Headphones, CheckCircle, Clock, Star, MessageCircle, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function CustomerSupportTrial() {
  const navigate = useNavigate();

  return (
    <div className="cst-page">
      {/* Ambient background */}
      <div className="cst-ambient">
        <div className="cst-glow-1"></div>
        <div className="cst-glow-2"></div>
      </div>

      <div className="cst-container">
        <motion.div
          className="cst-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="cst-icon-wrapper">
            <Headphones className="cst-hero-icon" />
          </div>
          <h1>Customer Support Assessment</h1>
          <p className="cst-subtitle">
            Show us how you handle real-world customer situations. We evaluate your communication, empathy, and problem-solving under pressure.
          </p>
        </motion.div>

        <motion.div
          className="cst-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="cst-card">
            <div className="cst-card-header">
              <Clock className="cst-card-icon text-blue" />
              <h3>Time Limit</h3>
            </div>
            <p>You have <strong>15 minutes</strong> to draft and submit a professional customer response.</p>
          </div>

          <div className="cst-card">
            <div className="cst-card-header">
              <Star className="cst-card-icon text-yellow" />
              <h3>Evaluation Criteria</h3>
            </div>
            <p>Tone, empathy, clarity, conflict resolution, and retention strategy.</p>
          </div>
        </motion.div>

        <motion.div
          className="cst-requirements"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3><MessageCircle className="inline-icon" /> What You'll Need to Do</h3>
          <ul className="cst-req-list">
            <li>
              <CheckCircle className="req-icon" />
              <span>Read the customer's complaint scenario carefully.</span>
            </li>
            <li>
              <CheckCircle className="req-icon" />
              <span>Introduce yourself and acknowledge their frustration with empathy.</span>
            </li>
            <li>
              <CheckCircle className="req-icon" />
              <span>Provide a clear resolution or next steps for the customer.</span>
            </li>
            <li>
              <CheckCircle className="req-icon" />
              <span>Retain the customer's trust with a confident, professional tone.</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="cst-actions"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link to="/dashboard" className="cst-btn-secondary">
            Cancel
          </Link>
          <button
            className="cst-btn-primary"
            onClick={() => navigate("/trial/customer-support/start")}
          >
            Begin Assessment <ArrowRight className="btn-icon-right" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default CustomerSupportTrial;