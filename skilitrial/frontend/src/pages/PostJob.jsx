import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./PostJob.css";

const JOB_TYPES = ["Remote", "Hybrid", "Onsite"];

function PostJob() {
  const [jobData, setJobData] = useState({
    title: "", company: "", location: "",
    salary: "", type: "Remote", description: "", skills: [],
    requiredTrial: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) =>
    setJobData({ ...jobData, [e.target.name]: e.target.value });

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !jobData.skills.includes(trimmed)) {
      setJobData({ ...jobData, skills: [...jobData.skills, trimmed] });
      setSkillInput("");
    }
  };
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(); }
  };
  const removeSkill = (i) =>
    setJobData({ ...jobData, skills: jobData.skills.filter((_, idx) => idx !== i) });

  const applyLogo = (file) => {
    if (!file) return;
    setLogoFile(file);
    setLogo(URL.createObjectURL(file));
  };
  const handleLogo = (e) => applyLogo(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyLogo(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await fetch(import.meta.env.VITE_API_URL + "/api/jobs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (error) {
      console.error(error);
    }
  };

  const fields = [
    { name: "title",    label: "Job Title",     placeholder: "e.g. Frontend Developer",  type: "text", icon: "briefcase" },
    { name: "company",  label: "Company Name",  placeholder: "e.g. Google",              type: "text", icon: "building" },
    { name: "location", label: "Location",      placeholder: "e.g. Pune / Remote",       type: "text", icon: "pin" },
    { name: "salary",   label: "Salary Range",  placeholder: "e.g. ₹6 LPA – ₹10 LPA",  type: "text", icon: "currency" },
  ];

  const icons = {
    briefcase: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 5V4a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M1 9h13" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
    building: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="2" width="11" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 6h1M9 6h1M5 9h1M9 9h1M6 14v-3h3v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    pin: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1a4 4 0 014 4c0 3.5-4 9-4 9s-4-5.5-4-9a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="7.5" cy="5" r="1.2" fill="currentColor"/>
      </svg>
    ),
    currency: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M7.5 4v7M5.5 5.5h3a1.5 1.5 0 010 3h-2a1.5 1.5 0 000 3H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  };

  return (
    <div className="pj-root">
      {/* Background */}
      <div className="pj-bg" aria-hidden="true">
        <div className="pj-glow-1" />
        <div className="pj-glow-2" />
        <div className="pj-grid" />
      </div>

      <div className="pj-page">
        {/* Header */}
        <motion.div
          className="pj-page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="pj-label">Employers</span>
          <h1>Post a Job</h1>
          <p>Find the right talent by posting your open role — verified candidates only.</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="pj-card"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        >
          <form className="pj-form" onSubmit={handleSubmit}>

            {/* Section: Basic Info */}
            <div className="pj-section-label">Basic Info</div>
            <div className="pj-fields-grid">
              {fields.map((f) => (
                <div className="pj-field" key={f.name}>
                  <label htmlFor={f.name}>{f.label}</label>
                  <div className="pj-input-wrap">
                    <span className="pj-input-icon">{icons[f.icon]}</span>
                    <input
                      id={f.name}
                      type={f.type}
                      name={f.name}
                      placeholder={f.placeholder}
                      value={jobData[f.name]}
                      onChange={handleChange}
                      required={f.name === "title" || f.name === "company"}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Job Type */}
            <div className="pj-field">
              <label>Job Type</label>
              <div className="pj-type-pills">
                {JOB_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`type-pill ${jobData.type === t ? "active" : ""}`}
                    onClick={() => setJobData({ ...jobData, type: t })}
                  >
                    {t === "Remote" && (
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M1 6.5h11M6.5 1c-1.5 2-2 3.5-2 5.5s.5 3.5 2 5.5M6.5 1c1.5 2 2 3.5 2 5.5s-.5 3.5-2 5.5" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                    )}
                    {t === "Hybrid" && (
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2 10V6l4.5-4 4.5 4v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="4.5" y="7.5" width="4" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                    )}
                    {t === "Onsite" && (
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <rect x="1" y="4" width="11" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M4 4V3a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    )}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Required Trial */}
            <div className="pj-field">
              <label>Required Skill Trial</label>
              <div className="pj-input-wrap" style={{ padding: "0 14px" }}>
                <span className="pj-input-icon">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M4.5 7.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <select 
                  name="requiredTrial"
                  value={jobData.requiredTrial}
                  onChange={handleChange}
                  className="pj-select"
                  style={{ width: "100%", background: "transparent", border: "none", color: "var(--pj-ink)", outline: "none", padding: "12px 0", fontFamily: "inherit", fontSize: "0.9rem", cursor: "pointer" }}
                >
                  <option value="" style={{ color: "#000" }}>None (Direct Apply)</option>
                  <option value="/java-login-trial" style={{ color: "#000" }}>Java Backend Trial</option>
                  <option value="/customer-support-trial/start" style={{ color: "#000" }}>Customer Support Trial</option>
                  <option value="/office-admin-trial" style={{ color: "#000" }}>Office Admin Trial</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div className="pj-section-label">Requirements</div>
            <div className="pj-field">
              <label>Required Skills</label>
              <div className="pj-skill-input-row">
                <div className="pj-input-wrap flex-1">
                  <span className="pj-input-icon">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M7.5 1l1.7 3.4 3.8.55-2.75 2.68.65 3.77L7.5 9.6l-3.4 1.84.65-3.77L2 5l3.8-.55z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter or Add"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                  />
                </div>
                <button type="button" className="pj-add-btn" onClick={addSkill}>
                  Add
                </button>
              </div>
              {jobData.skills.length > 0 && (
                <div className="pj-skills-wrap">
                  <AnimatePresence>
                    {jobData.skills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        className="pj-skill-tag"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.2 }}
                      >
                        {skill}
                        <button
                          type="button"
                          className="pj-skill-remove"
                          onClick={() => removeSkill(i)}
                          aria-label={`Remove ${skill}`}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Logo Upload */}
            <div className="pj-section-label">Branding</div>
            <div className="pj-field">
              <label>Company Logo</label>
              <div
                className={`pj-dropzone ${dragOver ? "drag-over" : ""} ${logo ? "has-logo" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("logo-upload").click()}
              >
                {logo ? (
                  <div className="pj-logo-preview">
                    <img src={logo} alt="Company logo preview" />
                    <span className="pj-logo-change">Click to change</span>
                  </div>
                ) : (
                  <div className="pj-dropzone-empty">
                    <div className="pj-drop-icon">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M11 14V4M7 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p>Drag & drop or <span>browse</span></p>
                    <p className="pj-drop-hint">PNG, JPG up to 2MB</p>
                  </div>
                )}
                <input id="logo-upload" type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }} />
              </div>
            </div>

            {/* Description */}
            <div className="pj-field pj-field-full">
              <label htmlFor="description">Job Description</label>
              <div className="pj-textarea-wrap">
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the role, responsibilities, and what makes it exciting…"
                  value={jobData.description}
                  onChange={handleChange}
                  rows={6}
                />
                <span className="pj-char-count">{jobData.description.length} chars</span>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="pj-submit">
              Post Job
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 7.5h11M9 3l4 4.5L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

          </form>
        </motion.div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="pj-toast"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pj-toast-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="1.4"/>
                <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="toast-title">Job posted successfully!</p>
              <p className="toast-sub">Candidates can now discover your role.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PostJob;