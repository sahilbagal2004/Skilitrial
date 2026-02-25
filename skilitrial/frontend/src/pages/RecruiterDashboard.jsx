import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    type: "Remote",
  });

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/jobs`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        type: "Remote",
      });

      fetchJobs();
    } catch (err) {
      alert("Failed to post job");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Skilitrial</h2>
        <nav>
          <p className="active">Dashboard</p>
          <p>My Jobs</p>
        </nav>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main */}
      <div className="main">

        {/* Topbar */}
        <div className="topbar">
          <h1>Recruiter Dashboard</h1>
          <span className="welcome">Welcome Back 👋</span>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <h3>{jobs.length}</h3>
            <p>Total Jobs Posted</p>
          </div>
          <div className="stat-card">
            <h3>0</h3>
            <p>Total Applicants</p>
          </div>
        </div>

        {/* Post Job */}
        <div className="glass-card">
          <h3>Post a New Job</h3>

          <form onSubmit={handleSubmit} className="form">
            <div className="grid">
              <input
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <input
                placeholder="Company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />

              <input
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />

              <input
                placeholder="Salary"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
              />
            </div>

            <textarea
              placeholder="Job Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>

            <button type="submit" className="primary">
              + Post Job
            </button>
          </form>
        </div>

        {/* Jobs */}
        <div className="glass-card">
          <h3>My Posted Jobs</h3>

          {jobs.length === 0 ? (
            <p className="empty">No jobs posted yet.</p>
          ) : (
            <div className="jobs">
              {jobs.map((job) => (
                <div key={job._id} className="job">
                  <h4>{job.title}</h4>
                  <p>{job.company}</p>
                  <span className="tag">{job.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default RecruiterDashboard;