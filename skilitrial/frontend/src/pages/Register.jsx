import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Register.css";
import logo from "../assets/logo.svg";

function Register() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "candidate",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/register`, formData);
      setSuccess(res.data.message || "Account created successfully!");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = getStrength(formData.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#f87171", "#fbbf24", "#60a5fa", "#4ade80"][strength];

  const roles = [
    {
      value: "candidate",
      label: "Job Seeker",
      desc: "Find opportunities via skill trials",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M3 18c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      value: "recruiter",
      label: "Recruiter",
      desc: "Discover verified talent fast",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="5" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M2 9h16" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M6 4V2M14 4V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M6 13h4M6 15.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="14" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M16 16l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="reg-root">
      {/* Background */}
      <div className="reg-bg" aria-hidden="true">
        <div className="reg-glow-1" /><div className="reg-glow-2" /><div className="reg-grid" />
      </div>

      <motion.div
        className="reg-card"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Logo */}
        <Link to="/" className="reg-logo-link">
          <img src={logo} alt="Skilitrial" className="reg-logo-img" />
        </Link>

        {/* Header */}
        <div className="reg-header">
          <h1>Create your account</h1>
          <p>Start proving your skills and getting hired.</p>
        </div>

        {/* Error / Success */}
        <AnimatePresence>
          {error && (
            <motion.div className="reg-alert reg-alert-error"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M7.5 4.5v3M7.5 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div className="reg-alert reg-alert-success"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M4.5 7.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form className="reg-form" onSubmit={handleRegister}>

          {/* Role selector */}
          <div className="reg-field">
            <label>I am a…</label>
            <div className="reg-roles">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`reg-role-btn ${formData.role === r.value ? "active" : ""}`}
                  onClick={() => setFormData((p) => ({ ...p, role: r.value }))}
                >
                  <span className="role-icon">{r.icon}</span>
                  <span className="role-info">
                    <span className="role-label">{r.label}</span>
                    <span className="role-desc">{r.desc}</span>
                  </span>
                  {formData.role === r.value && (
                    <span className="role-check">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div className="reg-field">
            <label htmlFor="name">Full Name</label>
            <div className="reg-input-wrap">
              <svg className="reg-input-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M1.5 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                id="name" name="name" type="text"
                placeholder="Sahil Sharma"
                value={formData.name}
                onChange={handleChange}
                required autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="reg-field">
            <label htmlFor="reg-email">Email address</label>
            <div className="reg-input-wrap">
              <svg className="reg-input-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M1 5.5l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                id="reg-email" name="email" type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="reg-field">
            <label htmlFor="reg-password">Password</label>
            <div className="reg-input-wrap">
              <svg className="reg-input-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="2.5" y="6.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 6.5V5a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                id="reg-password" name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                required autoComplete="new-password"
              />
              <button
                type="button" className="reg-pw-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M1 7.5s2.3-4.5 6.5-4.5S14 7.5 14 7.5s-2.3 4.5-6.5 4.5S1 7.5 1 7.5z" stroke="currentColor" strokeWidth="1.3"/>
                    <circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M2 2l11 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M1 7.5s2.3-4.5 6.5-4.5S14 7.5 14 7.5s-2.3 4.5-6.5 4.5S1 7.5 1 7.5z" stroke="currentColor" strokeWidth="1.3"/>
                    <circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Strength bar */}
            {formData.password && (
              <motion.div className="reg-strength" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="strength-bar"
                      style={{ background: n <= strength ? strengthColor : undefined }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strengthColor }}>
                  {strengthLabel}
                </span>
              </motion.div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="reg-submit" disabled={loading}>
            {loading ? (
              <span className="btn-loading"><span className="spinner" />Creating account…</span>
            ) : (
              <>
                Create Account
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="reg-divider"><span /><p>or sign up with</p><span /></div>

        {/* OAuth */}
        <div className="reg-oauth">
          <button className="oauth-btn" type="button">
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
              <path d="M17.1 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.6c-.2 1-.8 1.8-1.6 2.4v2h2.6c1.5-1.4 2.5-3.5 2.5-6z" fill="#4285F4"/>
              <path d="M9 18c2.3 0 4.2-.8 5.6-2.1l-2.6-2c-.8.5-1.8.8-3 .8-2.3 0-4.2-1.5-4.9-3.6H1.4v2.1C2.8 16 5.7 18 9 18z" fill="#34A853"/>
              <path d="M4.1 11.1c-.2-.5-.3-1.1-.3-1.6s.1-1.1.3-1.6V5.8H1.4C.5 7.1 0 8.5 0 10s.5 2.9 1.4 4.2l2.7-2.1z" fill="#FBBC05"/>
              <path d="M9 3.6c1.3 0 2.5.4 3.4 1.3l2.5-2.5C13.2.9 11.3 0 9 0 5.7 0 2.8 2 1.4 5l2.7 2.1C4.8 5.1 6.7 3.6 9 3.6z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="oauth-btn" type="button">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>
        </div>

        <p className="reg-login-text">
          Already have an account?{" "}
          <Link to="/login" className="reg-login-link">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;