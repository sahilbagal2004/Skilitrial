import "./OfficeAdminTrial.css";
import { Link } from "react-router-dom";

function OfficeAdminTrial() {
  return (
    <div className="office-trial-page">
      <div className="office-trial-container">

        <h1>Office Admin Task</h1>

        <p className="trial-description">
          Demonstrate Excel skills, organization ability, and workflow efficiency.
        </p>

        <div className="trial-box">
          <h3>📝 Task Requirements</h3>
          <ul>
            <li>Create a formatted Excel sheet.</li>
            <li>Use formulas (SUM, IF, VLOOKUP).</li>
            <li>Organize data properly.</li>
            <li>Submit clean and structured output.</li>
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

export default OfficeAdminTrial;