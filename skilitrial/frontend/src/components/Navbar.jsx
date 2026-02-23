import "./Navbar.css";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false); // 🔥 Added

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${showNavbar ? "show" : "hide"}`}>

      {/* LOGO */}
      <Link to="/" className="logo">
        <img src={logo} alt="Skilitrial Logo" />
      </Link>

      {/* HAMBURGER ICON */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {/* NAV LINKS */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>

        <Link to="/browse-trials" onClick={() => setMenuOpen(false)}>
          Browse Trials
        </Link>

        <Link to="/" onClick={() => setMenuOpen(false)}>
          How It Works
        </Link>

        <Link to="/" onClick={() => setMenuOpen(false)}>
          Post a Job
        </Link>

        <Link to="/login" onClick={() => setMenuOpen(false)}>
          Log In
        </Link>

        <Link
          to="/register"
          className="btn-start"
          onClick={() => setMenuOpen(false)}
        >
          Get Started
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;