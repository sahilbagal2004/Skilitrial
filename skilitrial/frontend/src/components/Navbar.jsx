import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.svg";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Skilitrial Logo" />
      </div>

      <div className="nav-links">
        <Link to="/">Browse Trials</Link>
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

