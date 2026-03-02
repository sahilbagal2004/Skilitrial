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
      <NavLink to="/" className="logo">
        <img src={logo} alt="Skilitrial Logo" />
      </NavLink>

      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <NavLink to="/browse-trials">Browse Trials</NavLink>
        <a href="#how-it-works">How It Works</a>
        <NavLink to="/post-job">Post a Job</NavLink>

        <div className="auth-buttons">
          <NavLink to="/login" className="btn-login">
            Log In
          </NavLink>

          <NavLink to="/register" className="btn-start">
            Get Started
          </NavLink>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;