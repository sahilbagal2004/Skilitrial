import "./Navbar.css";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
      <Link to="/" className="logo">
        <img src={logo} alt="Skilitrial Logo" />
      </Link>

      <div className="nav-links">
        <Link to="/browse-trials">Browse Trials</Link>
        <Link to="/">How It Works</Link>
        <Link to="/">Post a Job</Link>
        <Link to="/login">Log In</Link>
      </div>

      <Link to="/register" className="btn-start">
        Get Started
      </Link>
    </nav>
  );
}

export default Navbar;
