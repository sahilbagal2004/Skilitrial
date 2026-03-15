import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, Clock, UploadCloud, CheckCircle, Loader2, PlayCircle, ArrowRight, X } from "lucide-react";
import "./OfficeAdminTrial.css";

function OfficeAdminTrial() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "";

  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(l => l - 1), 1000);
    return () => clearTimeout(timer);
  }, [started, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && !isSubmitting && file) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitting, file]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || isSubmitting) return;
    setIsSubmitting(true);
    try {
      // In a real scenario, we'd probably upload the file to S3 via /api/upload first
      // and pass the URL to complete-trial. For this MVP logic, we just pass the file name or complete it.
      const token = localStorage.getItem("token");
      const appId = searchParams.get("appId");
      await axios.post(
        `${API}/api/trials/complete-trial`,
        { applicationId: appId, fileName: file.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Excel sheet submitted! Returning to dashboard.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error submitting trial.");
      setIsSubmitting(false);
    }
  };

  // ================= BEFORE START =================
  if (!started) {
    return (
      <div className="oat-page">
        <div className="oat-ambient">
          <div className="oat-glow-green"></div>
        </div>
        
        <motion.div 
          className="oat-intro-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="oat-icon-stage">
            <FileSpreadsheet className="oat-stage-icon" />
          </div>
          <h1>Office Administrator Assessment</h1>
          <p className="oat-subtitle">
            This module evaluates your proficiency in spreadsheet management, data formatting, and basic formulas.
          </p>

          <div className="oat-specs">
            <div className="oat-spec-item">
              <Clock className="spec-icon" />
              <div>
                <strong>30 Minutes</strong>
                <span>Strict time limit</span>
              </div>
            </div>
            <div className="oat-spec-item">
              <FileSpreadsheet className="spec-icon" />
              <div>
                <strong>.XLSX / .CSV</strong>
                <span>File upload required</span>
              </div>
            </div>
          </div>

          <div className="oat-guidelines">
            <h3>What to expect:</h3>
            <ul>
              <li><CheckCircle className="check-icon" /> Create a formatted dataset from scratch.</li>
              <li><CheckCircle className="check-icon" /> Utilize standard formulas (SUM, percentages).</li>
              <li><CheckCircle className="check-icon" /> Submit a clean, organized final output.</li>
            </ul>
          </div>

          <button className="oat-start-btn" onClick={() => setStarted(true)}>
            <PlayCircle size={20} /> Begin Assessment
          </button>
        </motion.div>
      </div>
    );
  }

  // ================= AFTER START =================
  return (
    <div className="oat-page started">
      <div className="oat-topbar">
        <div className="oat-top-left">
          <FileSpreadsheet className="oat-brand-icon" />
          <span className="oat-brand-text">Practical Task: Payroll Data</span>
        </div>
        <div className={`oat-timer ${timeLeft < 300 ? 'danger' : ''}`}>
          <Clock size={16} />
          {formatTime()}
        </div>
      </div>

      <div className="oat-workspace">
        <motion.div 
          className="oat-instructions"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2>Task Instructions</h2>
          <p className="oat-context">
            Please open Excel, Google Sheets, or equivalent software and create a new spreadsheet matching the criteria below.
          </p>

          <div className="oat-task-block">
            <h3>1. Data Columns</h3>
            <p>Create a table with exactly these 5 columns:</p>
            <div className="oat-col-pills">
              <span>Employee Name</span>
              <span>Department</span>
              <span>Base Salary</span>
              <span>Bonus (10%)</span>
              <span>Total Pay</span>
            </div>
          </div>

          <div className="oat-task-block">
            <h3>2. Requirements</h3>
            <ul className="oat-reqs">
              <li>Populate the table with <strong>5 fictitious employees</strong> across at least 2 departments.</li>
              <li>Base salaries must range between $40,000 and $90,000.</li>
              <li>The <strong>Bonus (10%)</strong> column must use a formula calculating 10% of the Base Salary.</li>
              <li>The <strong>Total Pay</strong> column must use a formula summing Base Salary and Bonus.</li>
              <li>Format all currency columns cleanly (e.g. $45,000.00).</li>
            </ul>
          </div>

        </motion.div>

        <motion.div 
          className="oat-submission"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="oat-upload-box">
            <h3>Submit Your Work</h3>
            <p>Upload your completed spreadsheet here.</p>

            <div 
              className={`oat-dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div 
                    key="empty"
                    className="oat-drop-empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <UploadCloud className="upload-icon" />
                    <p>Drag & drop your file or <span>browse</span></p>
                    <span className="file-hint">Accepts .xlsx, .xls, .csv</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="filled"
                    className="oat-file-preview"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  >
                    <FileSpreadsheet className="file-icon-large" />
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button 
                      className="oat-remove-file"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".xlsx,.xls,.csv" 
                style={{ display: "none" }} 
              />
            </div>

            <button 
              className="oat-final-submit"
              disabled={!file || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <><Loader2 className="spin" size={18} /> Submitting...</>
              ) : (
                <>Complete Assessment <ArrowRight size={18} /></>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OfficeAdminTrial;