import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./RecruiterMyJobs.css";
import logo from "../assets/logo.svg";

const NAV_ITEMS = [
  {
    path: "/recruiter-dashboard",
    label: "Dashboard",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="1" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    path: "/recruiter-jobs",
    label: "My Jobs",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <rect x="1" y="5" width="15" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 5V4a3.5 3.5 0 017 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M1 9h15" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    path: "/recruiter-applicants",
    label: "Applicants",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="6" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M1 15c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M13 8v5M10.5 10.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function RecruiterMyJobs() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const API       = import.meta.env.VITE_API_URL;
  const token     = localStorage.getItem("token");

  const [jobs, setJobs]               = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const fetchAll = async () => {
      try {
        const profileRes = await axios.get(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
    fetchJobs();
  }, [token, navigate, API]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const initials = user?.name?.charAt(0).toUpperCase() ?? "R";

  return (
    <div className="rmj-root">
      {/* Ambient glow */}
      <div className="rmj-ambient" aria-hidden />

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="rmj-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ══ SIDEBAR ══ */}
      <aside className={`rmj-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <Link to="/" className="sidebar-logo">
            <img src={logo} alt="Skilitrial" />
          </Link>

          <nav className="sidebar-nav">
            <p className="sidebar-nav-label">Recruiter</p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                className={`sidebar-nav-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user?.name ?? "Recruiter"}</p>
              <p className="sidebar-user-role">Recruiter</p>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M5.5 7.5h8M10.5 5l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 2H3a1 1 0 00-1 1v9a1 1 0 001 1h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="rmj-main">
        {/* Topbar */}
        <div className="rmj-topbar">
          <button className="topbar-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>

          <div className="rmj-topbar-title">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <rect x="1" y="5" width="15" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M5 5V4a3.5 3.5 0 017 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M1 9h15" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            My Jobs
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-user-info">
              <span className="topbar-greeting">Welcome back,</span>
              <span className="topbar-name">{user?.name ?? "Recruiter"}</span>
            </div>
          </div>
        </div>

        <div className="rmj-body">
          <div className="rmj-header-row">
            <div>
              <h1 className="rmj-page-title">Jobs you've posted</h1>
              <p className="rmj-page-subtitle">Manage and track your active job listings.</p>
            </div>
            <button className="rmj-add-btn" onClick={() => navigate("/recruiter-dashboard")}>
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1v13M1 7.5h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Post New Job
            </button>
          </div>

          <motion.div
            className="rmj-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rmj-card-header">
              <h3>All Listings</h3>
              <span className="panel-count">{jobs.length}</span>
            </div>

            {loading ? (
               <div className="rmj-empty">
                 <span className="rmj-spinner" />
                 <p>Loading jobs...</p>
               </div>
            ) : jobs.length === 0 ? (
              <div className="rmj-empty">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.2" opacity=".25"/>
                  <path d="M12 18h12M18 12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".35"/>
                </svg>
                <p>No jobs posted yet.</p>
                <span>Head over to the Dashboard to create your first listing.</span>
              </div>
            ) : (
              <div className="rmj-job-list">
                <AnimatePresence>
                  {jobs.map((job, i) => (
                    <motion.div
                      key={job._id}
                      className="rmj-job-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: i * 0.04, duration: 0.28 }}
                    >
                      <div className="rmj-jc-left">
                        <div className="rmj-jc-logo">
                          {job.company?.charAt(0).toUpperCase()}
                        </div>
                        <div className="rmj-jc-info">
                          <h4>{job.title}</h4>
                          <p>{job.company}{job.location ? ` · ${job.location}` : ""}</p>
                          <div className="rmj-jc-meta-mobile">
                            {job.salary && <span className="rmj-jc-salary">{job.salary}</span>}
                            <span className={`rmj-jc-type ${job.type?.toLowerCase()}`}>{job.type}</span>
                            <span className="rmj-jc-applicants">
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M1 10c0-2.5 2-4.5 4.5-4.5S10 7.5 10 10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                              {job.applicantsCount || 0} Applicants
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="rmj-jc-right">
                        <div className="rmj-jc-meta-desktop">
                          {job.salary && <span className="rmj-jc-salary">{job.salary}</span>}
                          <span className={`rmj-jc-type ${job.type?.toLowerCase()}`}>{job.type}</span>
                          <span className="rmj-jc-applicants">
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M1 10c0-2.5 2-4.5 4.5-4.5S10 7.5 10 10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                            {job.applicantsCount || 0} Applicants
                          </span>
                        </div>
                        <button className="rmj-action-btn" onClick={() => navigate(`/recruiter-jobs/${job._id}`)}>
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default RecruiterMyJobs;
