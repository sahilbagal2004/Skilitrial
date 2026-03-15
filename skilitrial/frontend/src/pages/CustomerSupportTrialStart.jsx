import "./CustomerSupportTrialStart.css";
import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

function CustomerSupportTrialStart() {
  const [response, setResponse] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "";

  const handleSubmit = async () => {
    if (!response.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const appId = searchParams.get("appId");
      await axios.post(
        `${API}/api/trials/complete-trial`,
        { applicationId: appId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Response submitted successfully! You can now check your dashboard.");
      navigate("/dashboard");
    } catch (err) {
      alert("Error submitting trial.");
    }
  };

  return (
    <div className="trial-page">
      <div className="trial-card">

        <h1>Customer Support Trial</h1>

        <div className="scenario-box">
          A customer is angry because their order was delayed by 5 days.
          They are demanding a refund and threatening to leave a bad review.
          Respond professionally.
        </div>

        <textarea
          className="response-input"
          placeholder="Write your professional response here..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Response
        </button>

      </div>
    </div>
  );
}

export default CustomerSupportTrialStart;