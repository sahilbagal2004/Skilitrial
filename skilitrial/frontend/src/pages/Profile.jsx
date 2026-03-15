import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Save, Loader2, Pencil, Sparkles, CheckCircle2, XCircle, TrendingUp, Zap } from "lucide-react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Editable form state
  const [form, setForm] = useState({
    name: "", headline: "", bio: "", location: "",
    skills: [], experience: [],
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          headline: res.data.headline || "",
          bio: res.data.bio || "",
          location: res.data.location || "",
          skills: res.data.skills || [],
          experience: res.data.experience || [],
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [API, token]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAIAnalyze = async () => {
    if (!user) return;
    setAiLoading(true);
    setAiInsights(null);
    try {
      const res = await axios.post(`${API}/api/ai/analyze-profile`, {
        name: user.name, headline: user.headline, bio: user.bio,
        location: user.location, skills: user.skills, experience: user.experience,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setAiInsights(res.data);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "AI analysis failed. Check your Gemini API key.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API}/api/auth/update-profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setIsEditing(false);
      showToast("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm(f => ({ ...f, skills: [...f.skills, trimmed] }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
  };

  const handleAddExperience = () => {
    setForm(f => ({
      ...f,
      experience: [
        ...f.experience,
        { title: "", company: "", from: "", to: "", current: false, description: "" }
      ],
    }));
  };

  const handleExpChange = (i, field, value) => {
    const updated = [...form.experience];
    updated[i] = { ...updated[i], [field]: value };
    setForm(f => ({ ...f, experience: updated }));
  };

  const handleRemoveExp = (i) => {
    setForm(f => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }));
  };

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

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`profile-toast ${toast.type}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

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

            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <Pencil size={13} />
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

          {/* AI Insights Card */}
          <motion.div className="pcard pcard-full ai-card" custom={3} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="pcard-header">
              <div className="pcard-icon ai-icon">
                <Sparkles size={16} />
              </div>
              <h2>AI Profile Insights</h2>
              {aiInsights && <span className={`ai-grade grade-${aiInsights.grade}`}>{aiInsights.grade}</span>}
              <button className="ai-analyze-btn" onClick={handleAIAnalyze} disabled={aiLoading}>
                {aiLoading ? <><Loader2 size={14} className="spin" /> Analyzing...</> : <><Sparkles size={14} /> Analyze with AI</>}
              </button>
            </div>

            {!aiInsights && !aiLoading && (
              <div className="ai-empty">
                <Sparkles size={36} className="ai-empty-icon" />
                <p>Get an instant AI-powered analysis of your profile.</p>
                <span>Our AI evaluates your bio, skills, and experience — then gives you a score, grade, and personalized tips to help you stand out to recruiters.</span>
              </div>
            )}

            {aiLoading && (
              <div className="ai-loading-state">
                <div className="ai-pulsing">
                  {[0.0, 0.15, 0.3].map((d, i) => (
                    <div key={i} className="ai-pulse-dot" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
                <p>Analyzing your profile with Gemini AI…</p>
              </div>
            )}

            {aiInsights && !aiLoading && (
              <div className="ai-results">
                {/* Score row */}
                <div className="ai-score-row">
                  <div className="ai-score-ring">
                    <svg viewBox="0 0 80 80" width="80" height="80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(108,99,255,0.15)" strokeWidth="8"/>
                      <circle cx="40" cy="40" r="32" fill="none"
                        stroke={aiInsights.score >= 70 ? "#22c55e" : aiInsights.score >= 40 ? "#fbbf24" : "#ef4444"}
                        strokeWidth="8"
                        strokeDasharray={`${(aiInsights.score / 100) * 201} 201`}
                        strokeLinecap="round"
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <span className="ai-score-num">{aiInsights.score}</span>
                  </div>
                  <div className="ai-score-info">
                    <h3>Profile Score</h3>
                    <p>{aiInsights.summary}</p>
                  </div>
                </div>

                <div className="ai-cols">
                  {/* Strengths */}
                  <div className="ai-col">
                    <div className="ai-col-title"><CheckCircle2 size={15} className="icon-green" /> Strengths</div>
                    <ul className="ai-list">
                      {aiInsights.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="ai-col">
                    <div className="ai-col-title"><XCircle size={15} className="icon-red" /> Needs Improvement</div>
                    <ul className="ai-list">
                      {aiInsights.improvements?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Suggested Skills */}
                {aiInsights.suggestedSkills?.length > 0 && (
                  <div className="ai-skills-suggest">
                    <div className="ai-col-title"><TrendingUp size={15} className="icon-blue" /> Suggested Skills to Add</div>
                    <div className="ai-skill-tags">
                      {aiInsights.suggestedSkills.map((skill, i) => (
                        <span key={i} className="ai-skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Headline Rewrite */}
                {aiInsights.headlineRewrite && (
                  <div className="ai-headline-rewrite">
                    <Zap size={15} className="icon-yellow" />
                    <div>
                      <span className="rewrite-label">AI-Suggested Headline:</span>
                      <p className="rewrite-text">{aiInsights.headlineRewrite}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

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

      {/* ═══════════ EDIT MODAL ═══════════ */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
            />
            <motion.div
              className="edit-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="edit-modal-header">
                <h2>Edit Profile</h2>
                <button className="modal-close-btn" onClick={() => setIsEditing(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="edit-modal-body">
                {/* Basic Info */}
                <div className="edit-section-title">Basic Info</div>
                <div className="edit-field">
                  <label>Full Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
                </div>
                <div className="edit-field">
                  <label>Headline</label>
                  <input value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder="e.g. Java Backend Developer | Spring Boot" />
                </div>
                <div className="edit-field">
                  <label>Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Mumbai, India" />
                </div>
                <div className="edit-field">
                  <label>About / Bio</label>
                  <textarea rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="A short bio about yourself..." />
                </div>

                {/* Skills */}
                <div className="edit-section-title">Skills</div>
                <div className="skills-edit-grid">
                  {form.skills.map((s, i) => (
                    <span key={i} className="skill-edit-tag">
                      {s}
                      <button onClick={() => handleRemoveSkill(s)}><X size={11} /></button>
                    </span>
                  ))}
                </div>
                <div className="skill-add-row">
                  <input
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddSkill()}
                    placeholder="Add a skill and press Enter"
                  />
                  <button className="add-skill-btn" onClick={handleAddSkill}><Plus size={16} /></button>
                </div>

                {/* Experience */}
                <div className="edit-section-title" style={{ marginTop: "24px" }}>
                  Experience
                  <button className="add-exp-btn" onClick={handleAddExperience}><Plus size={15} /> Add Role</button>
                </div>
                {form.experience.map((exp, i) => (
                  <div key={i} className="exp-edit-card">
                    <div className="exp-edit-header">
                      <span>Role #{i + 1}</span>
                      <button className="remove-exp-btn" onClick={() => handleRemoveExp(i)}><Trash2 size={14} /></button>
                    </div>
                    <div className="edit-field">
                      <label>Job Title</label>
                      <input value={exp.title} onChange={e => handleExpChange(i, "title", e.target.value)} placeholder="e.g. Backend Engineer" />
                    </div>
                    <div className="edit-field">
                      <label>Company</label>
                      <input value={exp.company} onChange={e => handleExpChange(i, "company", e.target.value)} placeholder="e.g. Infosys" />
                    </div>
                    <div className="edit-row-2">
                      <div className="edit-field">
                        <label>From</label>
                        <input type="date" value={exp.from ? exp.from.slice(0, 10) : ""} onChange={e => handleExpChange(i, "from", e.target.value)} />
                      </div>
                      <div className="edit-field">
                        <label>To {exp.current ? "(current)" : ""}</label>
                        <input type="date" value={exp.to ? exp.to.slice(0, 10) : ""} disabled={exp.current} onChange={e => handleExpChange(i, "to", e.target.value)} />
                      </div>
                      <div className="edit-field current-check">
                        <label>
                          <input type="checkbox" checked={exp.current} onChange={e => handleExpChange(i, "current", e.target.checked)} />
                          Currently here
                        </label>
                      </div>
                    </div>
                    <div className="edit-field">
                      <label>Description</label>
                      <textarea rows={2} value={exp.description} onChange={e => handleExpChange(i, "description", e.target.value)} placeholder="What you did here..." />
                    </div>
                  </div>
                ))}
              </div>

              <div className="edit-modal-footer">
                <button className="modal-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="modal-save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="spin" size={16} /> : <Save size={16} />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Profile;