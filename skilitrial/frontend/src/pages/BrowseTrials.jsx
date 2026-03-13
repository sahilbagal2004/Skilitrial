import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "./BrowseTrials.css";

const TRIALS = [
  {
    id: "java-login",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="2" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 8h8M7 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="15" cy="15" r="3.5" fill="var(--bg-3)" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M14 15l1 1 1.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    category: "Backend",
    title: "Java Login System",
    desc: "Build a complete authentication flow with JWT tokens in Android Studio.",
    duration: "45 min",
    difficulty: "Medium",
    to: "/java-login-trial",
  },
  {
    id: "react-dashboard",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="2" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 7h18" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 11h4M6 14h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <rect x="14" y="10" width="4" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M7 19h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 16v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    category: "Frontend",
    title: "React Dashboard UI",
    desc: "Create a responsive admin dashboard with charts, tables and live data.",
    duration: "60 min",
    difficulty: "Easy",
    to: "/react-dashboard-trial",
  },
  {
    id: "customer-support",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 14a7 7 0 1114 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="2" y="13" width="3.5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="16.5" y="13" width="3.5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M11 18v2M8 20h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    category: "Communication",
    title: "Customer Support Simulation",
    desc: "Handle escalations, refund requests and real customer scenarios live.",
    duration: "20 min",
    difficulty: "Easy",
    to: "/customer-support-trial",
  },
  {
    id: "office-admin",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 8h16M8 3v5M14 3v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M7 13h2M7 16h4M13 13h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    category: "Operations",
    title: "Office Admin Task",
    desc: "Demonstrate Excel, workflow management and organisational skills.",
    duration: "40 min",
    difficulty: "Easy",
    to: "/office-admin-trial",
  },
  {
    id: "node-api",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3L4 7v8l7 4 7-4V7L11 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M4 7l7 4m0 0l7-4m-7 4v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    category: "Backend",
    title: "Node.js REST API",
    desc: "Build a fully documented REST API with Express, validation and auth middleware.",
    duration: "75 min",
    difficulty: "Hard",
    to: "/node-api-trial",
  },
  {
    id: "data-analysis",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 17l4-5 4 3 4-7 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 3v16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    category: "Data",
    title: "Data Analysis with Python",
    desc: "Clean, analyse and visualise a real dataset using Pandas and Matplotlib.",
    duration: "90 min",
    difficulty: "Medium",
    to: "/data-analysis-trial",
  },
];

const JOBS = [
  { id: 1, title: "Frontend Developer", type: "Full Time", location: "Remote", match: "React Dashboard" },
  { id: 2, title: "Customer Support Executive", type: "Full Time", location: "Pune", match: "Support Simulation" },
  { id: 3, title: "Backend Engineer", type: "Contract", location: "Bangalore", match: "Java / Node" },
  { id: 4, title: "Data Analyst", type: "Full Time", location: "Hybrid", match: "Data Analysis" },
];

const CATEGORIES = ["All", "Backend", "Frontend", "Communication", "Operations", "Data"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

const DIFF_STYLES = {
  Easy:   { color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)" },
  Medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)" },
  Hard:   { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
};

export default function BrowseTrials() {
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = TRIALS.filter((t) => {
    const matchCat  = category   === "All" || t.category   === category;
    const matchDiff = difficulty === "All" || t.difficulty === difficulty;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchDiff && matchSearch;
  });

  return (
    <div className="bt-root">
      {/* Background */}
      <div className="bt-bg" aria-hidden="true">
        <div className="bt-glow-1" /><div className="bt-glow-2" /><div className="bt-grid" />
      </div>

      <div className="bt-page">
        {/* Header */}
        <motion.div className="bt-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="bt-eyebrow">Explore</span>
          <h1>Browse Skill Trials</h1>
          <p>Practice real-world scenarios, earn verified badges, and get discovered by top employers.</p>
        </motion.div>

        {/* Search */}
        <motion.div className="bt-search-wrap" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="bt-search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search trials by name or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="bt-search-clear" onClick={() => setSearch("")} aria-label="Clear">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div className="bt-filters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }}>
          <div className="filter-group">
            <span className="filter-label">Category</span>
            <div className="filter-pills">
              {CATEGORIES.map((c) => (
                <button key={c} className={`filter-pill ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Difficulty</span>
            <div className="filter-pills">
              {DIFFICULTIES.map((d) => (
                <button key={d} className={`filter-pill ${difficulty === d ? "active" : ""}`} onClick={() => setDifficulty(d)}>{d}</button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Layout */}
        <div className="bt-layout">
          {/* Trials */}
          <div className="bt-trials-col">
            <div className="bt-results-bar">
              <span>{filtered.length} trial{filtered.length !== 1 ? "s" : ""} found</span>
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  className="bt-empty"
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                    <path d="M13 20h14M20 13v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.4"/>
                  </svg>
                  <p>No trials match your filters.</p>
                  <button onClick={() => { setCategory("All"); setDifficulty("All"); setSearch(""); }}>Clear filters</button>
                </motion.div>
              ) : (
                filtered.map((trial, i) => {
                  const diff = DIFF_STYLES[trial.difficulty];
                  return (
                    <motion.div
                      key={trial.id}
                      className="bt-trial-card"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                    >
                      <div className="btc-icon-wrap">{trial.icon}</div>

                      <div className="btc-content">
                        <div className="btc-top">
                          <span className="btc-category">{trial.category}</span>
                          <span className="btc-duration">
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                              <path d="M5.5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                            {trial.duration}
                          </span>
                        </div>
                        <h3>{trial.title}</h3>
                        <p>{trial.desc}</p>
                        <span
                          className="btc-diff"
                          style={{ color: diff.color, background: diff.bg, borderColor: diff.border }}
                        >
                          {trial.difficulty}
                        </span>
                      </div>

                      <Link to={trial.to} className="bt-start-btn">
                        Start
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Jobs panel */}
          <div className="bt-jobs-col">
            <div className="bt-jobs-header">
              <div className="bt-jobs-icon">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <rect x="1" y="4" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M5 4V3a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M1 8h13" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
              </div>
              <h2>Open Roles</h2>
            </div>

            <div className="bt-jobs-list">
              {JOBS.map((job, i) => (
                <motion.div
                  key={job.id}
                  className="bt-job-card"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                >
                  <div className="bjc-info">
                    <h4>{job.title}</h4>
                    <div className="bjc-meta">
                      <span>{job.type}</span>
                      <span className="bjc-dot" />
                      <span>{job.location}</span>
                    </div>
                    <span className="bjc-match">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1"/>
                        <path d="M3 5l1.5 1.5 2.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Matches: {job.match}
                    </span>
                  </div>
                  <button className="bt-apply-btn">Apply</button>
                </motion.div>
              ))}
            </div>

            {/* CTA nudge */}
            <div className="bt-jobs-cta">
              <p>Complete a trial to unlock direct employer outreach.</p>
              <Link to="/register" className="bt-jobs-cta-link">
                Get Started
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}