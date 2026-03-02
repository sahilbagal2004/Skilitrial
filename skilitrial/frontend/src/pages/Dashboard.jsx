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
        // PROFILE
        const profileRes = await axios.get(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileRes.data);

        // JOBS
        const jobsRes = await axios.get(`${API}/api/jobs`);
        setJobs(jobsRes.data);

        // FETCH APPLIED JOBS
        const appRes = await axios.get(
          `${API}/api/applications/my-applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const appliedIds = appRes.data.map((app) => app.job);
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

  // APPLY FUNCTION
  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${API}/api/applications/apply`,  // ✅ CORRECT ROUTE
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
    job.title.toLowerCase().includes(search.toLowerCase())
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

      {/* SIDEBAR */}
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
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span>
              Welcome, <strong>{user?.name}</strong>
            </span>
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
            <h2>{appliedJobs.length}</h2>
          </div>

          <div className="stat-card">
            <span>Status</span>
            <h2 className="status-active">Active</h2>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">

          <div className="left-panel">
            <h3>Available Jobs</h3>

            {filteredJobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-info">
                  <h4>{job.title}</h4>
                  <p>{job.company}</p>
                  <span className="job-type">{job.type}</span>
                </div>

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
              </div>
            ))}
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