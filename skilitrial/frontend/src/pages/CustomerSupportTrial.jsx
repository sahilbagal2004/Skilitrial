import "./CustomerSupportTrial.css";
import { Link } from "react-router-dom";

function CustomerSupportTrial() {
  return (
    <div className="trial-page">

      <div className="trial-container">

        <h1>Customer Support Trial</h1>

        <p className="trial-description">
          Demonstrate your communication skills and ability to solve real
          customer problems professionally.
        </p>

        <div className="trial-box">
          <h3>📝 Task Instructions</h3>

          <ul>
            <li>Introduce yourself professionally.</li>
            <li>Handle an angry customer situation.</li>
            <li>Provide a clear solution.</li>
            <li>Keep tone polite and confident.</li>
          </ul>
        </div>

        <div className="trial-actions">
          <button className="start-btn">Start Trial</button>

          <Link to="/" className="back-btn">
            Go Back
          </Link>
        </div>

      </div>
    </div>
  );
}

export default CustomerSupportTrial;