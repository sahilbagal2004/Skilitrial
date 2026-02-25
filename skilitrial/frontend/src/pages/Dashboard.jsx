import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  // ================= FETCH PROFILE + JOBS =================
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

        // Fetch jobs from backend (if available)
        const jobsRes = await axios.get(`${API}/api/jobs`);
        setJobs(jobsRes.data);

      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate, API]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // ================= APPLY =================
  const handleApply = (jobId) => {
    alert(`Applied for Job ID: ${jobId}`);
    // Later connect backend: POST /api/apply
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <h2 className="logo">Skilitrial</h2>

          <ul>
            <li className="active">Dashboard</li>
            <li>Skill Trials</li>
            <li>Jobs</li>
            <li>Reports</li>
          </ul>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">

        {/* TOPBAR */}
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
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span>Welcome, <strong>{user.name}</strong></span>
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat-card">
            <span>Total Jobs</span>
            <h2>{jobs.length}</h2>
          </div>

          <div className="stat-card">
            <span>Applied Jobs</span>
            <h2>0</h2>
          </div>

          <div className="stat-card">
            <span>Status</span>
            <h2 className="status-active">Active</h2>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">

          {/* JOB LIST */}
          <div className="left-panel">
            <h3>Available Jobs</h3>

            {filteredJobs.map(job => (
              <div key={job._id} className="job-card">
                <div className="job-info">
                  <h4>{job.title}</h4>
                  <p>{job.company}</p>
                  <span className="job-type">{job.type}</span>
                </div>

                <button
                  className="apply-btn"
                  onClick={() => handleApply(job._id)}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>

          {/* PROFILE */}
          <div className="right-panel">
            <h3>Your Profile</h3>

            <div className="profile-box">
              <div className="profile-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="profile-details">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;