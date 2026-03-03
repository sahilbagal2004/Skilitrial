import "./CustomerSupportTrial.css";
import { Link, useNavigate } from "react-router-dom";

function CustomerSupportTrial() {
  const navigate = useNavigate();

  return (
    <div className="trial-page">
      <div className="trial-card">

        <h1>Customer Support Trial</h1>

        <p className="trial-description">
          Demonstrate your communication skills and ability to solve
          real customer problems professionally.
        </p>

        <div className="instruction-box">
          <h3>📝 Task Instructions</h3>

          <ul>
            <li>Introduce yourself professionally.</li>
            <li>Handle an angry customer situation.</li>
            <li>Provide a clear solution.</li>
            <li>Keep tone polite and confident.</li>
          </ul>
        </div>

        <div className="button-group">
          <button
            className="start-btn"
            onClick={() => navigate("/trial/customer-support/start")}
          >
            Start Trial
          </button>

          <Link to="/" className="back-btn">
            Go Back
          </Link>
        </div>

      </div>
    </div>
  );
}

export default CustomerSupportTrial;