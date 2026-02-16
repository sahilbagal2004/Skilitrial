import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/logo.svg";



function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      console.log("Login Success:", res.data);

      alert("Login successful");

      // Save token if backend sends it
      localStorage.setItem("token", res.data.token);

      navigate("/");

    } catch (err) {
      console.log("Login Error:", err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <img src={logo} alt="Skilitrial Logo" className="login-logo" />

        <h2>Sign in to your account</h2>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Log In</button>
        </form>

        <p className="signup-text">
  Don't have an account?{" "}
  <Link to="/register" className="signup-link">
    Sign Up
  </Link>
</p>

      </div>
    </div>
  );
}

export default Login;
