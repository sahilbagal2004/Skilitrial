import "./CustomerSupportTrialStart.css";
import { useState } from "react";

function CustomerSupportTrialStart() {
  const [response, setResponse] = useState("");

  const handleSubmit = () => {
    alert("Response submitted!");
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