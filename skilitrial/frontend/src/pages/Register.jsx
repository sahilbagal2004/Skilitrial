import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const API = import.meta.env.VITE_API_URL;

    const res = await axios.post(
      `${API}/api/auth/register`,
      formData
    );

    alert(res.data.message || "Registered Successfully");

    navigate("/login");

  } catch (err) {
    console.log(err.response?.data);
    setError(err.response?.data?.message || "Registration Failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Your Account</h2>

        <form onSubmit={handleRegister}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <select name="role" onChange={handleChange}>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;