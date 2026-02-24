import "./HowItWorks.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function HowItWorks() {
  const navigate = useNavigate();

  return (
    <section className="how-section">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="how-title"
      >
        How It Works
      </motion.h2>

      <div className="how-container">
        <motion.div
          className="how-card"
          whileHover={{ y: -10 }}
          onClick={() => navigate("/browse-trials")}
        >
          <div className="icon-circle">📱</div>
          <h3>Record Your Trial</h3>
          <p>
            Complete a short task and upload your real skill performance.
          </p>
          <span className="hover-arrow">→</span>
        </motion.div>

        <motion.div
          className="how-card"
          whileHover={{ y: -10 }}
          onClick={() => navigate("/dashboard")}
        >
          <div className="icon-circle">🛡️</div>
          <h3>Get Verified Badge</h3>
          <p>
            Receive verified recognition after expert evaluation.
          </p>
          <span className="hover-arrow">→</span>
        </motion.div>

        <motion.div
          className="how-card"
          whileHover={{ y: -10 }}
          onClick={() => navigate("/register")}

        >
          <div className="icon-circle">🤝</div>
          <h3>Get Hired Faster</h3>
          <p>
            Employers discover and hire based on proven ability.
          </p>
          <span className="hover-arrow">→</span>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;