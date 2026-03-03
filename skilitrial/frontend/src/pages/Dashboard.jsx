import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate, useLocation } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const profileRes = await axios.get(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileRes.data);

        const jobsRes = await axios.get(`${API}/api/jobs`);
        setJobs(jobsRes.data);

        const appRes = await axios.get(
          `${API}/api/applications/my-applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const appliedIds = appRes.data.map((app) =>
          app.job?._id ? app.job._id : app.job
        );
        setAppliedJobs(appliedIds);

      } catch (err) {
        console.log(err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, API]);

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${API}/api/applications/apply`,
        { jobId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppliedJobs((prev) => [...prev, jobId]);

    } catch (err) {
      alert("Already Applied");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div>
          <h2 className="logo">Skilitrial</h2>
          <ul>
            <li className={location.pathname === "/dashboard" ? "active" : ""}>
              Dashboard
            </li>
            <li>Skill Trials</li>
            <li>Jobs</li>
            <li>Reports</li>
          </ul>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main">

        <div className="topbar">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <div className="user-info">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span>
              Welcome, <strong>{user?.name}</strong>
            </span>
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <span>Total Jobs</span>
            <h2>{jobs.length}</h2>
          </div>

          <div className="stat-card">
            <span>Applied Jobs</span>
            <h2>{appliedJobs.length}</h2>
          </div>

          <div className="stat-card">
            <span>Status</span>
            <h2 className="status-active">Active</h2>
          </div>
        </div>

        <div className="content">
          <div className="left-panel">
            <h3>Available Jobs</h3>

            {filteredJobs.length === 0 ? (
              <p>No jobs found.</p>
            ) : (
              filteredJobs.map((job) => (
                <div key={job._id} className="job-card">

                  <div className="job-header">

                    <img
                      src={
                        job.companyLogo ||
                        `https://logo.clearbit.com/${job.company?.toLowerCase().replace(/\s/g, "")}.com`
                      }
                      alt={job.company}
                      className="company-logo"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50";
                      }}
                    />

                    <div>
                      <h4>{job.title}</h4>
                      <p>{job.company} • {job.location}</p>
                    </div>

                  </div>

                  <div className="job-details">
                    <p>💰 {job.salary || "Not Disclosed"}</p>
                    <p>{job.type}</p>
                    <p>👥 {job.applicantsCount || 0} Applicants</p>
                  </div>

                  <div className="job-actions">
                    <button
                      className={`apply-btn ${
                        appliedJobs.includes(job._id) ? "applied" : ""
                      }`}
                      onClick={() => handleApply(job._id)}
                      disabled={appliedJobs.includes(job._id)}
                    >
                      {appliedJobs.includes(job._id)
                        ? "Applied"
                        : "Apply Now"}
                    </button>

                    {job.applicationLink && (
                      <a
                        href={job.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        Apply on Company Website
                      </a>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

          <div className="right-panel">
            <h3>Your Profile</h3>
            <div className="profile-box">
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;