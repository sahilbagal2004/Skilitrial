import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BarChart3
} from "lucide-react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const API = import.meta.env.VITE_API_URL;

        const profileRes = await axios.get(
          `${API}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(profileRes.data);

        const jobsRes = await axios.get(`${API}/api/jobs`);
        setJobs(jobsRes.data);

      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [navigate]);

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <ul>
        <li className="active">
          <LayoutDashboard size={18} /> Dashboard
        </li>
        <li>
          <Briefcase size={18} /> Skill Trials
        </li>
        <li>
          <FileText size={18} /> Jobs
        </li>
        <li>
          <BarChart3 size={18} /> Reports
        </li>
      </ul>

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

        {/* CONTENT */}
        <div className="content">

          {/* LEFT PANEL */}
          <div className="left-panel">
            <h3>Available Jobs</h3>

            {filteredJobs.map(job => (
              <div key={job._id} className="job-card">
                <h4>{job.title}</h4>
                <p><strong>{job.company}</strong></p>
                <p>{job.location}</p>
                <p style={{ color: "#0a66c2", fontWeight: "600" }}>
                  {job.salary}
                </p>
                <a
  href={job.applyLink}
  target="_blank"
  rel="noopener noreferrer"
  className="apply-btn"
>
  Apply
</a>
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