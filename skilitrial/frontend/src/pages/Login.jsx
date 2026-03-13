import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/logo.svg";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "recruiter") navigate("/recruiter-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Background */}
      <div className="login-bg" aria-hidden="true">
        <div className="login-glow-1" />
        <div className="login-glow-2" />
        <div className="login-grid" />
      </div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Logo */}
        <Link to="/" className="login-logo-link">
          <img src={logo} alt="Skilitrial" className="login-logo-img" />
          <span className="login-logo-text">Skilitrial</span>
        </Link>

        {/* Header */}
        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue your journey</p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            className="login-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="field">
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M1 6l7 4 7-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="field">
            <div className="field-row">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
            <div className="input-wrap">
              <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Signing in…
              </span>
            ) : (
              <>
                Sign In
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5h11M9 3l4 4.5-4 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span />
          <p>or continue with</p>
          <span />
        </div>

        {/* OAuth */}
        <div className="login-oauth">
          <button className="oauth-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.1 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.6c-.2 1-.8 1.8-1.6 2.4v2h2.6c1.5-1.4 2.5-3.5 2.5-6z" fill="#4285F4"/>
              <path d="M9 18c2.3 0 4.2-.8 5.6-2.1l-2.6-2c-.8.5-1.8.8-3 .8-2.3 0-4.2-1.5-4.9-3.6H1.4v2.1C2.8 16 5.7 18 9 18z" fill="#34A853"/>
              <path d="M4.1 11.1c-.2-.5-.3-1.1-.3-1.6s.1-1.1.3-1.6V5.8H1.4C.5 7.1 0 8.5 0 10s.5 2.9 1.4 4.2l2.7-2.1-.1.9z" fill="#FBBC05"/>
              <path d="M9 3.6c1.3 0 2.5.4 3.4 1.3l2.5-2.5C13.2.9 11.3 0 9 0 5.7 0 2.8 2 1.4 5l2.7 2.1C4.8 5.1 6.7 3.6 9 3.6z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="oauth-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M17 1H1a1 1 0 00-1 1v14a1 1 0 001 1h7.6V11H6.5V8.5H8.6V6.6c0-2.1 1.3-3.2 3.1-3.2.9 0 1.8.1 2.7.2v3h-1.9c-.8 0-.9.4-.9.9v1.9H14l-.4 2.5h-2V17H17a1 1 0 001-1V2a1 1 0 00-1-1z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Sign up */}
        <p className="login-signup">
          Don't have an account?{" "}
          <Link to="/register" className="login-signup-link">Create one free</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;