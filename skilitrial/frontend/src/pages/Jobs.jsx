import { useEffect, useState } from "react";
import axios from "axios";
import "./Jobs.css";
import { useNavigate } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API}/api/jobs`);
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, [API, navigate]);

  const handleApply = (jobId) => {
    alert(`Applied for Job ID: ${jobId}`);
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h2>All Jobs</h2>

        <input
          type="text"
          placeholder="Search jobs..."
          className="jobs-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="jobs-list">
        {filteredJobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="job-card-new">
              <div className="job-info">
                <h4>{job.title}</h4>
                <p className="job-company">{job.company}</p>
                <span className="job-type-badge">{job.type}</span>
              </div>

              <button
                className="apply-btn-new"
                onClick={() => handleApply(job._id)}
              >
                Apply Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Jobs;