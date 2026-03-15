import "./JavaLoginStart.css";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

function JavaLoginStart() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "";

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const appId = searchParams.get("appId");
      await axios.post(
        `${API}/api/trials/complete-trial`,
        { applicationId: appId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Trial submitted successfully! Returning to dashboard.");
      navigate("/dashboard");
    } catch (err) {
      alert("Error submitting trial.");
    }
  };
  return (
    <div className="start-page">
      <div className="start-container">
        <h2>🚀 Java Login Trial Started</h2>

        <p>
          Complete the authentication system using Java.
          You have 30 minutes to finish the task.
        </p>

        <textarea
          placeholder="Write your Java logic here..."
          className="code-box"
        />

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Trial
        </button>
      </div>
    </div>
  );
}

export default JavaLoginStart;