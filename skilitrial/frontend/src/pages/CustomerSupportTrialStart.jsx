import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Send, AlertTriangle, User, Loader2, ArrowLeft } from "lucide-react";
import "./CustomerSupportTrialStart.css";

function CustomerSupportTrialStart() {
  const [response, setResponse] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API = import.meta.env.VITE_API_URL || "";

  const handleSubmit = async () => {
    if (!response.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const appId = searchParams.get("appId");
      await axios.post(
        `${API}/api/trials/complete-trial`,
        { applicationId: appId, response },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Response submitted successfully! You can now check your dashboard.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error submitting trial.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cs-trial-page">
      <div className="cs-ambient">
        <div className="cs-glow-1"></div>
        <div className="cs-glow-2"></div>
      </div>

      <div className="cs-container">
        
        <motion.div 
          className="cs-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button className="cs-back-btn" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={18} /> Cancel
          </button>
          <h2><MessageSquare className="inline-icon" /> Customer Support Scenario</h2>
          <div className="cs-badges">
            <span className="cs-badge critical">High Priority</span>
            <span className="cs-badge time-limit">Time Limit: 15m</span>
          </div>
        </motion.div>

        <motion.div 
          className="cs-content-grid"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          
          {/* Left panel: The Ticket */}
          <div className="cs-ticket-panel">
            <div className="ticket-header">
              <div class="ticket-user">
                <div className="ticket-avatar"><User size={20} /></div>
                <div>
                  <h4>Alex Johnson</h4>
                  <p>Customer since 2021</p>
                </div>
              </div>
              <span className="ticket-id">#TKM-8429</span>
            </div>
            
            <div className="ticket-body">
              <div className="ticket-subject">
                Subject: <span className="subject-text">Extremely disappointed - Order delayed AGAIN!</span>
              </div>
              <div className="ticket-message">
                "I am writing this because I am absolutely furious. My order (#ORD-9921) was supposed to arrive 5 days ago. This was a gift for my daughter's birthday which has now passed! 
                <br/><br/>
                No one reached out to tell me about any delays. I am demanding a full refund immediately and I will be leaving a terrible review on TrustPilot. What are you going to do about this?"
              </div>
            </div>

            <div className="ticket-footer">
              <AlertTriangle className="alert-icon" size={16} />
              <span>Goal: De-escalate the situation, offer appropriate compensation, and retain the customer.</span>
            </div>
          </div>

          {/* Right panel: Response Area */}
          <div className="cs-response-panel">
            <div className="response-header">
              <h3>Your Reply</h3>
            </div>
            
            <div className="response-editor">
              <textarea
                className="cs-textarea"
                placeholder="Draft your professional response here..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                spellCheck="false"
              />
            </div>
            
            <div className="response-actions">
              <span className="word-count">
                {response.trim().split(/\s+/).filter(w => w.length > 0).length} words
              </span>
              <button 
                className="cs-submit-btn" 
                onClick={handleSubmit}
                disabled={isSubmitting || response.trim().length < 10}
              >
                {isSubmitting ? (
                  <><Loader2 className="spin" size={18} /> Submitting...</>
                ) : (
                  <><Send size={18} /> Send Reply</>
                )}
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

export default CustomerSupportTrialStart;