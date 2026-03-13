import "./HowItWorks.css";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const steps = [
  {
    number: "01",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="14" cy="14" r="4" fill="currentColor"/>
        <path d="M14 4v2M14 22v2M4 14h2M22 14h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: "Record Your Trial",
    desc: "Upload a short video demonstrating your real skills. No resume fluff — just proof of what you can do.",
    cta: "Upload Video",
    upload: true,
  },
  {
    number: "02",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3l2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L14 17.1l-5.6 2.9 1.1-6.1L5 9.5l6.2-.9L14 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Get Verified",
    desc: "Experts review your submission and award a verified badge that proves your competency to employers.",
    cta: "View Dashboard",
    nav: "/dashboard",
  },
  {
    number: "03",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M9 13l4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 24C8.48 24 4 19.52 4 14S8.48 4 14 4s10 4.48 10 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M20 20h4M22 18v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: "Get Hired Faster",
    desc: "Top employers browse verified talent and reach out directly — no middlemen, no guesswork.",
    cta: "Create Account",
    nav: "/register",
  },
];

function HowItWorks() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setProgress(0);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        onUploadProgress: (event) => {
          setProgress(Math.round((event.loaded * 100) / event.total));
        },
      });
      alert("Uploaded successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCardClick = (step) => {
    if (step.upload) fileInputRef.current?.click();
    else if (step.nav) navigate(step.nav);
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <section id="how-it-works" className="hiw-section">
      {/* Background decoration */}
      <div className="hiw-bg-grid" aria-hidden="true" />

      <div className="hiw-inner">
        {/* Header */}
        <div className="hiw-header">
          <span className="hiw-label">The Process</span>
          <h2 className="hiw-title">How It Works</h2>
          <p className="hiw-subtitle">
            Three steps from skill to hired — no gatekeeping, no guesswork.
          </p>
        </div>

        {/* Cards */}
        <motion.div
          className="hiw-cards"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="hiw-card"
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              onClick={() => handleCardClick(step)}
              role={step.upload || step.nav ? "button" : undefined}
              tabIndex={step.upload || step.nav ? 0 : undefined}
            >
              {/* Step number */}
              <div className="hiw-step-num">{step.number}</div>

              {/* Connector line (between cards) */}
              {i < steps.length - 1 && (
                <div className="hiw-connector" aria-hidden="true">
                  <div className="connector-line" />
                  <svg className="connector-arrow" width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path d="M1 1l6 5-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className="hiw-icon">{step.icon}</div>

              {/* Text */}
              <h3 className="hiw-card-title">{step.title}</h3>
              <p className="hiw-card-desc">{step.desc}</p>

              {/* Upload preview */}
              {step.upload && preview && (
                <div className="hiw-preview">
                  <video src={preview} controls />
                  {progress > 0 && progress < 100 && (
                    <div className="hiw-progress">
                      <div className="hiw-progress-track">
                        <motion.div
                          className="hiw-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="hiw-progress-label">{progress}%</span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="hiw-card-cta">
                {step.upload ? (
                  <>
                    <span>
                      {uploading ? "Uploading…" : preview ? "Replace Video" : step.cta}
                    </span>
                    <input
                      type="file"
                      ref={step.upload ? fileInputRef : undefined}
                      style={{ display: "none" }}
                      accept="video/*,audio/*"
                      onChange={handleFileChange}
                    />
                  </>
                ) : (
                  <span>{step.cta}</span>
                )}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;