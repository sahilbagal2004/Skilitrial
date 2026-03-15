import { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
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

function Reports() {
  const [jobs, setJobs]               = useState([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const API       = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    const fetchData = async () => {
      try {
        const [profileRes, jobsRes, appRes] = await Promise.all([
          axios.get(`${API}/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/api/jobs`),
          axios.get(`${API}/api/applications/my-applications`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUser(profileRes.data);
        setJobs(jobsRes.data);
        setAppliedCount(appRes.data.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const initials = user?.name?.charAt(0).toUpperCase() ?? "?";

  const applyRate  = jobs.length > 0 ? Math.round((appliedCount / jobs.length) * 100) : 0;
  const remaining  = jobs.length - appliedCount;

  const stats = [
    {
      label: "Total Jobs",
      value: jobs.length,
      color: "#7c6fff",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="1" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M6 6V5a4 4 0 018 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M1 11h18" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
      ),
    },
    {
      label: "Applied",
      value: appliedCount,
      color: "#34d399",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "Remaining",
      value: remaining < 0 ? 0 : remaining,
      color: "#fbbf24",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M10 6v4.5l3 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: "Apply Rate",
      value: `${applyRate}%`,
      color: "#38bdf8",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 15l4.5-5.5 3.5 3 4.5-7 3.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 3v14h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="rp-loading">
        <div className="rp-spinner" />
        <span>Loading reports…</span>
      </div>
    );
  }

  return (
    <div className="rp-root">

      {/* ══ SIDEBAR ══ */}
      {sidebarOpen && (
        <div className="rp-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`rp-sidebar ${sidebarOpen ? "open" : ""}`}>
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
      <main className="rp-main">

        {/* Topbar */}
        <div className="rp-topbar">
          <button
            className="topbar-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>

          <div className="rp-topbar-title">
            <svg width="16" height="16" viewBox="0 0 17 17" fill="none">
              <path d="M2 13l3.5-4.5 3 2.5 3.5-6 3 4" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 2v13h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Reports & Analytics
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-user-info">
              <span className="topbar-greeting">Welcome back,</span>
              <span className="topbar-name">{user?.name}</span>
            </div>
          </div>
        </div>

        <div className="rp-body">

          {/* ── Stat cards ── */}
          <div className="rp-stats">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="rp-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <div
                  className="rp-stat-icon"
                  style={{ color: s.color, background: `${s.color}1a`, borderColor: `${s.color}30` }}
                >
                  {s.icon}
                </div>
                <div className="rp-stat-info">
                  <span className="rp-stat-label">{s.label}</span>
                  <span className="rp-stat-value" style={{ color: s.color }}>{s.value}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Bottom grid ── */}
          <div className="rp-grid">

            {/* Performance summary */}
            <motion.div
              className="rp-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
            >
              <div className="rp-card-header">
                <h3>Performance Summary</h3>
              </div>

              <p className="rp-summary-text">
                You've applied to <strong style={{ color: "#34d399" }}>{appliedCount}</strong> out of{" "}
                <strong style={{ color: "#7c6fff" }}>{jobs.length}</strong> available jobs — an apply rate of{" "}
                <strong style={{ color: "#38bdf8" }}>{applyRate}%</strong>.
                {remaining > 0 && (
                  <> There {remaining === 1 ? "is" : "are"} still{" "}
                  <strong style={{ color: "#fbbf24" }}>{remaining}</strong> job{remaining !== 1 ? "s" : ""} you haven't applied to yet.</>
                )}
              </p>

              {/* Apply rate bar */}
              <div className="rp-rate-wrap">
                <div className="rp-rate-meta">
                  <span>Apply progress</span>
                  <span style={{ color: "#38bdf8", fontWeight: 600 }}>{applyRate}%</span>
                </div>
                <div className="rp-rate-track">
                  <motion.div
                    className="rp-rate-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${applyRate}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </div>

              {/* Mini breakdown */}
              <div className="rp-breakdown">
                <div className="rp-breakdown-item">
                  <span className="rp-bd-dot" style={{ background: "#34d399" }} />
                  <span className="rp-bd-label">Applied</span>
                  <span className="rp-bd-val">{appliedCount}</span>
                </div>
                <div className="rp-breakdown-item">
                  <span className="rp-bd-dot" style={{ background: "#fbbf24" }} />
                  <span className="rp-bd-label">Not yet applied</span>
                  <span className="rp-bd-val">{remaining < 0 ? 0 : remaining}</span>
                </div>
                <div className="rp-breakdown-item">
                  <span className="rp-bd-dot" style={{ background: "#7c6fff" }} />
                  <span className="rp-bd-label">Total listings</span>
                  <span className="rp-bd-val">{jobs.length}</span>
                </div>
              </div>
            </motion.div>

            {/* Activity panel */}
            <motion.div
              className="rp-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.4 }}
            >
              <div className="rp-card-header">
                <h3>Activity Overview</h3>
              </div>

              <div className="rp-activity-list">
                {[
                  { label: "Profile Status",  value: "Active",            color: "#34d399" },
                  { label: "Jobs Applied",    value: appliedCount,         color: "#7c6fff" },
                  { label: "Jobs Available",  value: jobs.length,          color: "#38bdf8" },
                  { label: "Pending Reviews", value: appliedCount || "—",  color: "#fbbf24" },
                  { label: "Shortlisted",     value: "—",                  color: "#fb7185" },
                ].map((row) => (
                  <div key={row.label} className="rp-activity-row">
                    <span className="rp-act-label">{row.label}</span>
                    <span className="rp-act-value" style={{ color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="rp-cta">
                <button onClick={() => navigate("/dashboard")}>
                  Browse Jobs
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="outline" onClick={() => navigate("/profile")}>
                  Edit Profile
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Reports;