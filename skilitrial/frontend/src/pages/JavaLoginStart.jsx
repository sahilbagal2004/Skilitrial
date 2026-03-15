import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Timer, Send, Code, AlertCircle, Loader2 } from "lucide-react";
import "./JavaLoginStart.css";

function JavaLoginStart() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "";

  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only parse appId so that user doesn't just hit this directly easily without intention
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      // set text to include tab
      setCode(code.substring(0, start) + "    " + code.substring(end));
      // put cursor right after the tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const appId = searchParams.get("appId");
      
      // Post to our endpoint
      await axios.post(
        `${API}/api/trials/complete-trial`,
        { applicationId: appId, submission: code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Trial submitted successfully! You can now check your dashboard.");
      navigate("/dashboard");
    } catch (err) {
      alert("Error submitting trial.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="jls-page">
      <div className="jls-navbar">
        <div className="jls-nav-left">
          <Code className="jls-nav-icon" />
          <span className="jls-title">Java Authentication Implementation</span>
        </div>
        <div className="jls-nav-right">
          <div className={`jls-timer ${timeLeft < 300 ? "danger" : ""}`}>
            <Timer className="timer-icon" />
            <span>{formatTime()}</span>
          </div>
          <button 
            className="jls-submit-top" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
            {isSubmitting ? "Submitting..." : "Submit Task"}
          </button>
        </div>
      </div>

      <div className="jls-layout">
        {/* Left Side: Instructions */}
        <div className="jls-sidebar">
          <div className="jls-panel-header">
            <h3>Instructions</h3>
          </div>
          <div className="jls-panel-content">
            <p className="jls-context">
              Write a complete Java class for a <code>AuthController</code> using Spring Boot or standard Java Servlets.
            </p>
            
            <div className="jls-task-box">
              <h4>Task Checklist</h4>
              <ul>
                <li><code>POST /api/register</code> endpoint</li>
                <li><code>POST /api/login</code> endpoint</li>
                <li>Email syntax validation validator</li>
                <li>Password hashing method inside the registration</li>
                <li>Token/Cookie response logic for login</li>
              </ul>
            </div>

            <div className="jls-alert box-info">
              <AlertCircle size={18} className="alert-icon"/>
              <p>Do not worry about precise imports. Focus on the core logic and object orientation.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Code Editor Area */}
        <div className="jls-editor-area">
          <div className="jls-editor-header">
            <div className="tabs">
              <div className="tab active">AuthController.java</div>
            </div>
            <div className="jls-lang-badge">Java</div>
          </div>
          
          <div className="jls-editor-container">
            <textarea
              className="jls-code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              placeholder="// Write your Java code here...&#10;public class AuthController {&#10;    &#10;}"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JavaLoginStart;