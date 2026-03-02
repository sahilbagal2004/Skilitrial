import { useState } from "react";
import "./TrialStart.css";

function CustomerSupportTrialStart() {
  const [response, setResponse] = useState("");

  const handleSubmit = () => {
    if (!response.trim()) {
      alert("Please write your response.");
      return;
    }

    alert("Trial Submitted Successfully ✅");
    setResponse("");
  };

  return (
    <div className="trial-container">
      <h2>Customer Support Trial</h2>

      <div className="scenario-box">
        <p>
          A customer is angry because their order was delayed by 5 days.
          They are demanding a refund and threatening to leave a bad review.
          Respond professionally.
        </p>
      </div>

      <textarea
        placeholder="Write your professional response here..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        className="trial-textarea"
      />

      <button className="submit-btn" onClick={handleSubmit}>
        Submit Response
      </button>
    </div>
  );
}

export default CustomerSupportTrialStart;