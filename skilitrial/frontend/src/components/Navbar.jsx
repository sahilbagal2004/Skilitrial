import "./Navbar.css";
import logo from "../assets/logo.svg";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setScrolled(window.scrollY > 50);
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: showNavbar ? 0 : -100 }}
      transition={{ duration: 0.4 }}
      className={`navbar ${scrolled ? "scrolled" : ""}`}
    >
      {/* LOGO */}
      <NavLink to="/" className="logo">
        <img src={logo} alt="Skilitrial Logo" />
      </NavLink>

      {/* HAMBURGER */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* NAV LINKS */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <NavLink to="/browse-trials" onClick={() => setMenuOpen(false)}>
          Browse Trials
        </NavLink>

        <NavLink to="/how-it-works" onClick={() => setMenuOpen(false)}>
          How It Works
        </NavLink>

        <NavLink to="/post-job" onClick={() => setMenuOpen(false)}>
          Post a Job
        </NavLink>

        {/* ✅ Added Login + Get Started */}
        <div className="auth-buttons">
          <NavLink
            to="/login"
            className="btn-login"
            onClick={() => setMenuOpen(false)}
          >
            Log In
          </NavLink>

          <NavLink
            to="/register"
            className="btn-start"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </NavLink>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;