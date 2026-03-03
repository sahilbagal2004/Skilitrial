import { useState, useEffect } from "react";
import "./OfficeAdminTrial.css";

function OfficeAdminTrial() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [started]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // ================= BEFORE START =================
  if (!started) {
    return (
      <div className="trial-container">
        <div className="trial-card">
          <h1>Office Admin Task</h1>
          <p className="subtitle">
            Demonstrate Excel skills and workflow efficiency.
          </p>

          <ul>
            <li>Create formatted Excel sheet</li>
            <li>Use SUM, IF, VLOOKUP</li>
            <li>Organize data properly</li>
            <li>Submit clean output</li>
          </ul>

          <button
            className="start-btn"
            onClick={() => setStarted(true)}
          >
            Start Trial
          </button>
        </div>
      </div>
    );
  }

  // ================= AFTER START =================
  return (
    <div className="trial-container">
      <div className="trial-card">
        <div className="trial-header">
          <h1>Office Admin Practical Task</h1>
          <div className="timer-badge">
            ⏳ {formatTime()}
          </div>
        </div>

        <p className="subtitle">
          Create an Excel sheet containing the following:
        </p>

        <ul>
          <li>Employee Name</li>
          <li>Department</li>
          <li>Salary</li>
          <li>Bonus (10% of Salary)</li>
          <li>Total Salary (Salary + Bonus)</li>
        </ul>

        <div className="upload-section">
          <label>Upload Excel File:</label>
          <input type="file" accept=".xlsx,.xls" />
        </div>

        <button className="submit-btn">
          Submit Trial
        </button>
      </div>
    </div>
  );
}

export default OfficeAdminTrial;