import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./RecruiterApplicants.css";
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

const STATUS_OPTIONS = ["applied", "shortlisted", "rejected"];

function RecruiterApplicants() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const API       = import.meta.env.VITE_API_URL;
  const token     = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [user, setUser]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs/my-applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.log("Failed to fetch applicants:", err);
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
      } catch {}
    };
    fetchAll();
    fetchApplicants();
  }, [token, navigate, API]);

  const updateStatus = async (appId, newStatus) => {
    try {
      await axios.put(
        `${API}/api/jobs/application/${appId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setApplications(apps => apps.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
      
      showToast(`Status updated to ${newStatus}`);
    } catch (error) {
      showToast("Failed to update status", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const initials = user?.name?.charAt(0).toUpperCase() ?? "R";

  return (
    <div className="ra-root">
      {/* Ambient glow */}
      <div className="ra-ambient" aria-hidden />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`ra-toast ${toast.type}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            {toast.type === "success" ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M4.5 7.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M7.5 4.5v3M7.5 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="ra-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ══ SIDEBAR ══ */}
      <aside className={`ra-sidebar ${sidebarOpen ? "open" : ""}`}>
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
      <main className="ra-main">
        {/* Topbar */}
        <div className="ra-topbar">
          <button className="topbar-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>

          <div className="ra-topbar-title">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <circle cx="6" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M1 15c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M13 8v5M10.5 10.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Applicants
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-user-info">
              <span className="topbar-greeting">Welcome back,</span>
              <span className="topbar-name">{user?.name ?? "Recruiter"}</span>
            </div>
          </div>
        </div>

        <div className="ra-body">
          <div className="ra-header-row">
            <div>
              <h1 className="ra-page-title">Candidate Applications</h1>
              <p className="ra-page-subtitle">Review and manage candidates across all your job postings.</p>
            </div>
          </div>

          <motion.div
            className="ra-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="ra-card-header">
              <h3>All Applicants</h3>
              <span className="panel-count">{applications.length}</span>
            </div>

            {loading ? (
              <div className="ra-empty">
                <span className="ra-spinner" />
                <p>Loading applicants...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="ra-empty">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.2" opacity=".25"/>
                  <path d="M14 14l8 8M22 14l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".35"/>
                </svg>
                <p>No applications yet.</p>
                <span>Applications will appear here once candidates apply to your jobs.</span>
              </div>
            ) : (
              <div className="ra-app-list">
                <AnimatePresence>
                  {applications.map((app, i) => (
                    <motion.div
                      key={app._id}
                      className="ra-app-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: i * 0.04, duration: 0.28 }}
                    >
                      <div className="ra-ac-left">
                        <div className="ra-ac-avatar">
                          {app.candidate?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="ra-ac-info">
                          <h4>{app.candidate?.name || "Unknown Candidate"}</h4>
                          <p className="ra-ac-email">{app.candidate?.email}</p>
                          <p className="ra-ac-job">
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                              <path d="M4 3V2.5a3 3 0 016 0V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                            {app.job?.title} at {app.job?.company}
                          </p>
                        </div>
                      </div>

                      <div className="ra-ac-right">
                        <div className="ra-status-wrapper">
                          <span className={`ra-status-badge ${app.status?.toLowerCase() || 'applied'}`}>
                            {app.status || 'applied'}
                          </span>
                          
                          <select 
                            className="ra-status-select"
                            value={app.status || 'applied'}
                            onChange={(e) => updateStatus(app._id, e.target.value)}
                          >
                            <option value="applied">Applied</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        
                        <div className="ra-date">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </div>
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

export default RecruiterApplicants;
