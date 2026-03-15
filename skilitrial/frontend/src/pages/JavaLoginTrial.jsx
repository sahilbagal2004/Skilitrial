import { motion } from "framer-motion";
import { Coffee, CheckCircle, Clock, ShieldCheck, Code2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./JavaLoginTrial.css";

function JavaLoginTrial() {
  return (
    <div className="jlt-page">
      {/* Ambient background */}
      <div className="jlt-ambient">
        <div className="jlt-glow-1"></div>
        <div className="jlt-glow-2"></div>
      </div>

      <div className="jlt-container">
        <motion.div 
          className="jlt-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="jlt-icon-wrapper">
            <Coffee className="jlt-hero-icon" />
          </div>
          <h1>Java Authentication System</h1>
          <p className="jlt-subtitle">
            Demonstrate your backend engineering skills by building a secure, robust login and registration flow.
          </p>
        </motion.div>

        <motion.div 
          className="jlt-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="jlt-card">
            <div className="jlt-card-header">
              <Clock className="jlt-card-icon text-blue" />
              <h3>Time Limit</h3>
            </div>
            <p>You will have <strong>30 minutes</strong> to complete the implementation once started.</p>
          </div>

          <div className="jlt-card">
            <div className="jlt-card-header">
              <ShieldCheck className="jlt-card-icon text-green" />
              <h3>Evaluation Criteria</h3>
            </div>
            <p>Security practices, parameter validation, error handling, and code structure.</p>
          </div>
        </motion.div>

        <motion.div 
          className="jlt-requirements"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3><Code2 className="inline-icon" /> Technical Requirements</h3>
          <ul className="jlt-req-list">
            <li>
              <CheckCircle className="req-icon" />
              <span>Implement Registration and Login REST endpoints.</span>
            </li>
            <li>
              <CheckCircle className="req-icon" />
              <span>Validate email format and enforce password strength.</span>
            </li>
            <li>
              <CheckCircle className="req-icon" />
              <span>Securely hash passwords using BCrypt.</span>
            </li>
            <li>
              <CheckCircle className="req-icon" />
              <span>Return proper HTTP status codes matching outcomes.</span>
            </li>
          </ul>
        </motion.div>

        <motion.div 
          className="jlt-actions"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link to="/dashboard" className="jlt-btn-secondary">
            Cancel
          </Link>
          <Link to="/java-login-trial/start" className="jlt-btn-primary">
            Begin Assessment <ArrowRight className="btn-icon-right" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default JavaLoginTrial;