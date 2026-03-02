import "./JavaLoginTrial.css";
import { Link } from "react-router-dom";

function JavaLoginTrial() {
  return (
    <div className="java-trial-page">
      <div className="java-trial-container">

        <h1>Java Login System Trial</h1>

        <p className="trial-description">
          Build a complete authentication flow using Java. This task evaluates
          your backend logic, validation skills, and secure coding practices.
        </p>

        <div className="trial-box">
          <h3>📝 Task Requirements</h3>

          <ul>
            <li>Create Login & Registration forms.</li>
            <li>Validate email & password properly.</li>
            <li>Implement password encryption.</li>
            <li>Handle incorrect login attempts.</li>
            <li>Show success & error messages properly.</li>
          </ul>
        </div>

        <div className="trial-actions">
          <Link to="/java-login-trial/start" className="start-btn">
            Start Trial
          </Link>

          <Link to="/" className="back-btn">
            Go Back
          </Link>
        </div>

      </div>
    </div>
  );
}

export default JavaLoginTrial;