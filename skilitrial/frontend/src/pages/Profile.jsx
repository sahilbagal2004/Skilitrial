import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const API = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner" />
        <span>Loading profile…</span>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  return (
    <div className="profile-root">
      {/* Background */}
      <div className="profile-bg" aria-hidden="true">
        <div className="profile-glow-1" />
        <div className="profile-glow-2" />
        <div className="profile-grid" />
      </div>

      <div className="profile-page">

        {/* ── Hero Card ── */}
        <motion.div
          className="profile-hero"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="profile-cover-strip" />

          <div className="profile-hero-body">
            {/* Avatar */}
            <div className="profile-avatar-wrap">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="profile-avatar" />
              ) : (
                <div className="profile-avatar-initials">{initials}</div>
              )}
              <div className="avatar-status" title="Online" />
            </div>

            {/* Identity */}
            <div className="profile-identity">
              <div className="profile-name-row">
                <h1>{user.name}</h1>
                {user.verified && (
                  <span className="verified-badge" title="Skill Verified">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="profile-headline">
                {user.headline || "Add your professional headline"}
              </p>
              <div className="profile-meta">
                {user.location && (
                  <span className="meta-item">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1a4 4 0 014 4c0 3-4 8-4 8S3 8 3 5a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.4"/>
                      <circle cx="7" cy="5" r="1.2" fill="currentColor"/>
                    </svg>
                    {user.location}
                  </span>
                )}
                {user.email && (
                  <span className="meta-item">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M1 5l6 4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    {user.email}
                  </span>
                )}
              </div>
            </div>

            {/* Edit */}
            <button className="edit-btn">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Stats row */}
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-val">{user.skills?.length || 0}</span>
              <span className="stat-key">Skills</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-val">{user.experience?.length || 0}</span>
              <span className="stat-key">Roles</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-val">{user.trialsCompleted || 0}</span>
              <span className="stat-key">Trials Done</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-val">{user.profileViews || "—"}</span>
              <span className="stat-key">Profile Views</span>
            </div>
          </div>
        </motion.div>

        {/* ── Content Grid ── */}
        <div className="profile-grid-layout">

          {/* About */}
          <motion.div className="pcard" custom={0} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="pcard-header">
              <div className="pcard-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <h2>About</h2>
            </div>
            <p className="pcard-body-text">
              {user.bio || "Tell recruiters about yourself — add a compelling bio to stand out."}
            </p>
          </motion.div>

          {/* Skills */}
          <motion.div className="pcard" custom={1} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="pcard-header">
              <div className="pcard-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2l1.8 3.6L14 6.5l-3 2.9.7 4.1L8 11.4l-3.7 2.1.7-4.1L2 6.5l4.2-.9L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Skills</h2>
              <span className="pcard-count">{user.skills?.length || 0}</span>
            </div>
            <div className="skills-grid">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))
              ) : (
                <p className="empty-state">No skills added yet.</p>
              )}
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div className="pcard pcard-full" custom={2} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="pcard-header">
              <div className="pcard-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M2 9h12" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
              </div>
              <h2>Experience</h2>
              <span className="pcard-count">{user.experience?.length || 0}</span>
            </div>

            {user.experience && user.experience.length > 0 ? (
              <div className="experience-list">
                {user.experience.map((exp, i) => (
                  <div key={i} className="exp-item">
                    <div className="exp-dot-col">
                      <div className="exp-dot" />
                      {i < user.experience.length - 1 && <div className="exp-line" />}
                    </div>
                    <div className="exp-content">
                      <div className="exp-header">
                        <div>
                          <h4>{exp.title}</h4>
                          <p className="exp-company">{exp.company}</p>
                        </div>
                        <span className="exp-date">
                          {exp.from ? new Date(exp.from).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                          {" – "}
                          {exp.current ? "Present" : exp.to ? new Date(exp.to).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="exp-desc">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No experience added yet.</p>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Profile;