import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./RecruiterDashboard.css";
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

const JOB_TYPES = ["Remote", "Hybrid", "Onsite"];

const EMPTY_FORM = {
  title: "", company: "", location: "",
  salary: "", description: "", type: "Remote",
};

function RecruiterDashboard() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const API       = import.meta.env.VITE_API_URL;
  const token     = localStorage.getItem("token");

  const [jobs, setJobs]               = useState([]);
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [submitting, setSubmitting]   = useState(false);
  const [toast, setToast]             = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [charCount, setCharCount]     = useState(0);
  const [user, setUser]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

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
    fetchJobs();
  }, []);

  const handleChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (field === "description") setCharCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/jobs`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(EMPTY_FORM);
      setCharCount(0);
      fetchJobs();
      showToast("Job posted successfully!");
    } catch {
      showToast("Failed to post job. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const initials = user?.name?.charAt(0).toUpperCase() ?? "R";
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);

  return (
    <div className="rd-root">

      {/* Ambient glow */}
      <div className="rd-ambient" aria-hidden />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`rd-toast ${toast.type}`}
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
            className="rd-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ══ SIDEBAR ══ */}
      <aside className={`rd-sidebar ${sidebarOpen ? "open" : ""}`}>
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
      <main className="rd-main">

        {/* Topbar */}
        <div className="rd-topbar">
          <button className="topbar-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>

          <div className="rd-topbar-title">
            <svg width="16" height="16" viewBox="0 0 17 17" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <rect x="10" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <rect x="1" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            Recruiter Dashboard
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-user-info">
              <span className="topbar-greeting">Welcome back,</span>
              <span className="topbar-name">{user?.name ?? "Recruiter"}</span>
            </div>
          </div>
        </div>

        <div className="rd-body">

          {/* ── Stat cards ── */}
          <div className="rd-stats">
            {[
              {
                label: "Jobs Posted", value: jobs.length, color: "#7c6fff",
                icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="1" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M6 6V5a4 4 0 018 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M1 11h18" stroke="currentColor" strokeWidth="1.4"/></svg>,
              },
              {
                label: "Total Applicants", value: totalApplicants, color: "#34d399",
                icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1 18c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M16 10v6M13 13h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
              },
              {
                label: "Active Listings", value: jobs.filter(j => j.active !== false).length, color: "#fbbf24",
                icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 10l2.5 2.5 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
              },
              {
                label: "Job Types", value: [...new Set(jobs.map(j => j.type))].length || 0, color: "#38bdf8",
                icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 4h16M2 10h10M2 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="rd-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="stat-icon" style={{ color: s.color, background: `${s.color}1a`, borderColor: `${s.color}30` }}>
                  {s.icon}
                </div>
                <div className="stat-info">
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Content grid ── */}
          <div className="rd-grid">

            {/* Post Job form */}
            <motion.div
              className="rd-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
            >
              <div className="rd-card-header">
                <h3>Post a New Job</h3>
                <span className="rd-badge">New</span>
              </div>

              <form className="rd-form" onSubmit={handleSubmit}>

                {/* 2-col grid inputs */}
                <div className="rd-form-grid">
                  <div className="rd-field">
                    <label>Job Title</label>
                    <div className="rd-input-wrap">
                      <svg className="rd-input-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M4 3V2.5a3 3 0 016 0V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        <path d="M1 7h12" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                      <input
                        placeholder="e.g. Frontend Engineer"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="rd-field">
                    <label>Company</label>
                    <div className="rd-input-wrap">
                      <svg className="rd-input-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M4 4V3a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        <path d="M5 7h4M5 10h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      <input
                        placeholder="e.g. Acme Corp"
                        value={formData.company}
                        onChange={(e) => handleChange("company", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="rd-field">
                    <label>Location</label>
                    <div className="rd-input-wrap">
                      <svg className="rd-input-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1a4 4 0 014 4c0 3.5-4 8-4 8S3 8.5 3 5a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.2"/>
                        <circle cx="7" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.1"/>
                      </svg>
                      <input
                        placeholder="e.g. Mumbai, India"
                        value={formData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="rd-field">
                    <label>Salary</label>
                    <div className="rd-input-wrap">
                      <svg className="rd-input-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M7 4v6M5 5.5h3a1 1 0 010 2H6a1 1 0 000 2h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                      </svg>
                      <input
                        placeholder="e.g. ₹8–12 LPA"
                        value={formData.salary}
                        onChange={(e) => handleChange("salary", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="rd-field">
                  <label>Job Description</label>
                  <div className="rd-textarea-wrap">
                    <textarea
                      placeholder="Describe the role, responsibilities, and requirements…"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      rows={4}
                    />
                    <span className="rd-char-count">{charCount}</span>
                  </div>
                </div>

                {/* Job type pills */}
                <div className="rd-field">
                  <label>Job Type</label>
                  <div className="rd-type-pills">
                    {JOB_TYPES.map((t) => (
                      <button
                        key={t} type="button"
                        className={`rd-type-pill ${formData.type === t ? "active" : ""}`}
                        onClick={() => handleChange("type", t)}
                      >
                        {t === "Remote" && (
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M1 6.5h11M6.5 1a8 8 0 010 11M6.5 1a8 8 0 000 11" stroke="currentColor" strokeWidth="1.1"/>
                          </svg>
                        )}
                        {t === "Hybrid" && (
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <rect x="1" y="4" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                            <rect x="7" y="4" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M6 6.5h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        )}
                        {t === "Onsite" && (
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <rect x="2" y="5" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M4 5V4a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        )}
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="rd-submit" disabled={submitting}>
                  {submitting ? (
                    <><span className="rd-btn-spinner" /> Posting…</>
                  ) : (
                    <>
                      Post Job
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* My Jobs list */}
            <motion.div
              className="rd-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.4 }}
            >
              <div className="rd-card-header">
                <h3>My Posted Jobs</h3>
                <span className="panel-count">{jobs.length}</span>
              </div>

              {jobs.length === 0 ? (
                <div className="rd-empty">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.2" opacity=".25"/>
                    <path d="M12 18h12M18 12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".35"/>
                  </svg>
                  <p>No jobs posted yet.</p>
                  <span>Use the form to post your first job listing.</span>
                </div>
              ) : (
                <div className="rd-job-list">
                  <AnimatePresence>
                    {jobs.map((job, i) => (
                      <motion.div
                        key={job._id}
                        className="rd-job-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ delay: i * 0.04, duration: 0.28 }}
                      >
                        <div className="rd-jc-left">
                          <div className="rd-jc-logo">
                            {job.company?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4>{job.title}</h4>
                            <p>{job.company}{job.location ? ` · ${job.location}` : ""}</p>
                          </div>
                        </div>
                        <div className="rd-jc-right">
                          {job.salary && <span className="rd-jc-salary">{job.salary}</span>}
                          <span className={`rd-jc-type ${job.type?.toLowerCase()}`}>{job.type}</span>
                          <span className="rd-jc-applicants">
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <circle cx="5.5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.1"/>
                              <path d="M1 10c0-2.5 2-4.5 4.5-4.5S10 7.5 10 10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                            </svg>
                            {job.applicantsCount || 0}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default RecruiterDashboard;