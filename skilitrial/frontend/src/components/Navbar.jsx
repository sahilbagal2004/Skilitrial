import "./Navbar.css";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      {/* LEFT - LOGO */}
      <Link to="/" className="logo">
        <img src={logo} alt="Skilitrial Logo" />
      </Link>

      {/* CENTER - ALL LINKS */}
      <div className="nav-links">
        <Link to="/browse-trials">Browse Trials</Link>
        <Link to="/">How It Works</Link>
        <Link to="/">Post a Job</Link>
        <Link to="/login">Log In</Link>
      </div>

      {/* RIGHT - BUTTON */}
      <Link to="/register" className="btn-start">
        Get Started
      </Link>

    </nav>
  );
}

export default Navbar;
