import "./HowItWorks.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

function HowItWorks() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      alert(`Selected file: ${file.name}`);
      // Later we can upload this to backend
    }
  };

  return (
    <section id="how-it-works" className="how-section">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="how-title"
      >
        How It Works
      </motion.h2>

      <div className="how-container">
        {/* 🔥 FIRST CARD - OPEN FILE PICKER */}
        <motion.div
          className="how-card"
          whileHover={{ y: -10 }}
          onClick={handleFileClick}
        >
          <div className="icon-circle">📱</div>
          <h3>Record Your Trial</h3>
          <p>
            Complete a short task and upload your real skill performance.
          </p>
          <span className="hover-arrow">→</span>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="video/*,audio/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </motion.div>

        {/* SECOND CARD */}
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

        {/* THIRD CARD */}
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