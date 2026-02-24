import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const API = import.meta.env.VITE_API_URL;

      const profileRes = await axios.get(
        `${API}/api/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(profileRes.data);

      setJobs([
        { id: 1, title: "Frontend Developer", company: "Google" },
        { id: 2, title: "Backend Developer", company: "Amazon" },
        { id: 3, title: "Data Analyst", company: "TCS" }
      ]);

    } catch (err) {
      console.log("Dashboard Error:", err.response?.data);

      // Only logout if token is invalid (401)
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  fetchData();
}, [navigate]);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Skilitrial</h2>
        <ul>
          <li>Dashboard</li>
          <li>Skill Trials</li>
          <li>Jobs</li>
          <li>Reports</li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="user-info">
            👤 {user.name}
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="content">

          {/* LEFT PANEL */}
          <div className="left-panel">
            <h3>Available Jobs</h3>

            {filteredJobs.map(job => (
              <div key={job.id} className="job-card">
                <h4>{job.title}</h4>
                <p>{job.company}</p>
                <button>Apply</button>
              </div>
            ))}
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <h3>Your Profile</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
