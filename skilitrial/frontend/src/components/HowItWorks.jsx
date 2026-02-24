import "./HowItWorks.css";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HowItWorks() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percent);
          },
        }
      );

      alert("Uploaded successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };
  return (
  <section id="how-it-works" className="how-section">
    <h2 className="how-title">How It Works</h2>

    <div className="how-container">

      {/* 1️⃣ Upload Card */}
      <motion.div
        className="how-card"
        whileHover={{ y: -10 }}
        onClick={handleFileClick}
      >
        <div className="icon-circle">📱</div>
        <h3>Record Your Trial</h3>
        <p>Upload your real skill performance.</p>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="video/*,audio/*"
          onChange={handleFileChange}
        />

        {preview && (
          <video
            src={preview}
            controls
            width="100%"
            style={{ marginTop: "15px", borderRadius: "10px" }}
          />
        )}

        {progress > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <span className="hover-arrow">→</span>
      </motion.div>

      {/* 2️⃣ Verified Badge */}
      <motion.div
        className="how-card"
        whileHover={{ y: -10 }}
        onClick={() => navigate("/dashboard")}
      >
        <div className="icon-circle">🛡️</div>
        <h3>Get Verified Badge</h3>
        <p>Receive verified recognition after expert evaluation.</p>
        <span className="hover-arrow">→</span>
      </motion.div>

      {/* 3️⃣ Get Hired Faster */}
      <motion.div
        className="how-card"
        whileHover={{ y: -10 }}
        onClick={() => navigate("/register")}
      >
        <div className="icon-circle">🤝</div>
        <h3>Get Hired Faster</h3>
        <p>Employers discover and hire based on proven ability.</p>
        <span className="hover-arrow">→</span>
      </motion.div>

    </div>
  </section>
);
}

export default HowItWorks;