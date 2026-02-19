import "./Navbar.css";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      {/* LOGO → HOME */}
      <Link to="/" className="logo">
        <img src={logo} alt="Skilitrial Logo" />
      </Link>

      <Link to="/browse-trials" className="nav-link">
        Browse Trials
      </Link>

      <div className="nav-links">
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