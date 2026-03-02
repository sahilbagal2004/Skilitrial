import { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";
import { useNavigate } from "react-router-dom";

function Reports() {
  const [jobs, setJobs] = useState([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const jobsRes = await axios.get(`${API}/api/jobs`);
        setJobs(jobsRes.data);

        // Dummy applied count (connect backend later)
        setAppliedCount(2);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [API, navigate]);

  return (
    <div className="reports-container">
      <h2 className="reports-title">Reports & Analytics</h2>

      <div className="reports-stats">
        <div className="report-card">
          <span>Total Jobs</span>
          <h2>{jobs.length}</h2>
        </div>

        <div className="report-card">
          <span>Applied Jobs</span>
          <h2>{appliedCount}</h2>
        </div>

        <div className="report-card">
          <span>Status</span>
          <h2 className="report-active">Active</h2>
        </div>
      </div>

      <div className="summary-box">
        <h3>Performance Summary</h3>
        <p>
          You have applied to <strong>{appliedCount}</strong> jobs out of{" "}
          <strong>{jobs.length}</strong> available.
        </p>
      </div>
    </div>
  );
}

export default Reports;