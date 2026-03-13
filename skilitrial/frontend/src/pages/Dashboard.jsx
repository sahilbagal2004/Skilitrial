import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.svg";

const NAV_ITEMS = [
  {
    path: "/dashboard",
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
    path: "/skill-trials",
    label: "Skill Trials",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M8.5 2l2 4 4.5.65-3.25 3.17.77 4.48L8.5 12.1l-4.02 2.2.77-4.48L2 6.65 6.5 6z"
          stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    path: "/jobs",
    label: "Jobs",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <rect x="1" y="5" width="15" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 5V4a3.5 3.5 0 017 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M1 9h15" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    path: "/reports",
    label: "Reports",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M2 13l3.5-4.5 3 2.5 3.5-6 3 4" stroke="currentColor" strokeWidth="1.4"
          strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 2v13h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const STATS_CONFIG = [
  {
    key: "totalJobs",
    label: "Total Jobs",
    color: "#7c6fff",
    icon: (
      <svg width="19" height="19" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="5" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 5V4a4 4 0 018 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M1 10h16" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    key: "applied",
    label: "Applied",
    color: "#34d399",
    icon: (
      <svg width="19" height="19" viewBox="0 0 18 18" fill="none">
        <path d="M3 9l4 4 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    key: "status",
    label: "Profile Status",
    color: "#b39dff",
    icon: (
      <svg width="19" height="19" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "pending",
    label: "Pending Review",
    color: "#fbbf24",
    icon: (
      <svg width="19" height="19" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M9 5v4.5l3 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function Dashboard() {
  const [user, setUser]             = useState(null);
  const [jobs, setJobs]             = useState([]);
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applyingId, setApplyingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const API       = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      try {
        const [profileRes, jobsRes, appRes] = await Promise.all([
          axios.get(`${API}/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/api/jobs`),
          axios.get(`${API}/api/applications/my-applications`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUser(profileRes.data);
        setJobs(jobsRes.data);
        setAppliedJobs(appRes.data.map((app) => app.job?._id ?? app.job));
      } catch {
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
    setApplyingId(jobId);
    try {
      await axios.post(
        `${API}/api/applications/apply`,
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppliedJobs((prev) => [...prev, jobId]);
    } catch { /* already applied */ }
    finally { setApplyingId(null); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.company?.toLowerCase().includes(search.toLowerCase())
  );

  const initials = user?.name?.charAt(0).toUpperCase() ?? "?";

  const statValues = {
    totalJobs: jobs.length,
    applied:   appliedJobs.length,
    status:    "Active",
    pending:   appliedJobs.length > 0 ? appliedJobs.length : "—",
  };

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  return (
    <div className="dash-root">

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="dash-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ══ SIDEBAR ══ */}
      <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">

          <Link to="/" className="sidebar-logo">
            <img src={logo} alt="Skilitrial" />
          </Link>

          <nav className="sidebar-nav">
            <p className="sidebar-nav-label">Menu</p>
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
              <p className="sidebar-user-name">{user?.name}</p>
              <p className="sidebar-user-role">{user?.role}</p>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M5.5 7.5h8M10.5 5l3 2.5-3 2.5"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 2H3a1 1 0 00-1 1v9a1 1 0 001 1h5"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="dash-main">

        {/* Topbar */}
        <div className="dash-topbar">
          <button
            className="topbar-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>

          <div className="topbar-search">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search jobs by title or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="topbar-clear" onClick={() => setSearch("")}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-user-info">
              <span className="topbar-greeting">Welcome back,</span>
              <span className="topbar-name">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="dash-stats">
          {STATS_CONFIG.map((s, i) => (
            <motion.div
              key={s.key}
              className="dash-stat-card"
              style={{ "--blob": s.color }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.4,0,0.2,1] }}
            >
              <div
                className="stat-icon"
                style={{
                  color: s.color,
                  background: `${s.color}1a`,
                  borderColor: `${s.color}30`,
                }}
              >
                {s.icon}
              </div>
              <div className="stat-info">
                <span className="stat-label">{s.label}</span>
                <span className="stat-value" style={{ color: s.color }}>
                  {statValues[s.key]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="dash-content">

          {/* ── Jobs panel ── */}
          <div className="dash-jobs-panel">
            <div className="panel-header">
              <h3>Available Jobs</h3>
              <span className="panel-count">{filteredJobs.length}</span>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="dash-empty">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                  <circle cx="19" cy="19" r="17" stroke="currentColor" strokeWidth="1.2" opacity=".3"/>
                  <path d="M13 19h12M19 13v12" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" opacity=".4"/>
                </svg>
                <p>No jobs found{search ? ` for "${search}"` : ""}.</p>
                {search && <button onClick={() => setSearch("")}>Clear search</button>}
              </div>
            ) : (
              <div className="dash-job-list">
                {filteredJobs.map((job, i) => {
                  const isApplied  = appliedJobs.includes(job._id);
                  const isApplying = applyingId === job._id;
                  return (
                    <motion.div
                      key={job._id}
                      className="dash-job-card"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.32, ease: [0.4,0,0.2,1] }}
                    >
                      {/* Header */}
                      <div className="djc-header">
                        <div className="djc-logo-wrap">
                          <img
                            src={
                              job.companyLogo ||
                              `https://logo.clearbit.com/${job.company?.toLowerCase().replace(/\s/g, "")}.com`
                            }
                            alt={job.company}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div className="djc-logo-fallback">
                            {job.company?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="djc-title-block">
                          <h4>{job.title}</h4>
                          <p>{job.company} · {job.location}</p>
                        </div>
                        {isApplied && <span className="djc-applied-badge">Applied</span>}
                      </div>

                      {/* Tags */}
                      <div className="djc-tags">
                        {job.salary && <span className="djc-tag">💰 {job.salary}</span>}
                        {job.type   && <span className="djc-tag">{job.type}</span>}
                        <span className="djc-tag">👥 {job.applicantsCount || 0} applicants</span>
                      </div>

                      {/* Actions */}
                      <div className="djc-actions">
                        <button
                          className={`djc-apply-btn ${isApplied ? "applied" : ""}`}
                          onClick={() => !isApplied && handleApply(job._id)}
                          disabled={isApplied || isApplying}
                        >
                          {isApplying ? (
                            <><span className="btn-spinner" /> Applying…</>
                          ) : isApplied ? (
                            <>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Applied
                            </>
                          ) : (
                            <>
                              Apply Now
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </>
                          )}
                        </button>
                        {job.applicationLink && (
                          <a
                            href={job.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="djc-ext-link"
                          >
                            Company site
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <path d="M2 9L9 2M5 2h4v4" stroke="currentColor" strokeWidth="1.4"
                                strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Profile panel ── */}
          <div className="dash-profile-panel">
            <div className="panel-header">
              <h3>Your Profile</h3>
              <button className="panel-edit-btn" onClick={() => navigate("/profile")}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M8.5 2.5l2 2L3.5 11H1.5v-2L8.5 2.5z"
                    stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
                Edit
              </button>
            </div>

            <div className="dpp-body">
              <div className="dpp-avatar">{initials}</div>
              <h4 className="dpp-name">{user?.name}</h4>
              <span className="dpp-role-badge">{user?.role}</span>

              <div className="dpp-details">
                <div className="dpp-row">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <rect x="1" y="2.5" width="11" height="8" rx="1.5"
                      stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M1 5l5.5 3.5L12 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span>{user?.email}</span>
                </div>
                {user?.location && (
                  <div className="dpp-row">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M6.5 1a4 4 0 014 4c0 3-4 7-4 7S2.5 8 2.5 5a4 4 0 014-4z"
                        stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    <span>{user.location}</span>
                  </div>
                )}
              </div>

              {user?.skills?.length > 0 && (
                <div className="dpp-skills">
                  {user.skills.slice(0, 5).map((s, i) => (
                    <span key={i} className="dpp-skill">{s}</span>
                  ))}
                  {user.skills.length > 5 && (
                    <span className="dpp-skill dpp-skill-more">+{user.skills.length - 5}</span>
                  )}
                </div>
              )}

              <button className="dpp-view-btn" onClick={() => navigate("/profile")}>
                View Full Profile
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;