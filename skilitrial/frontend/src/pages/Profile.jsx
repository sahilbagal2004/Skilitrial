import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const API = import.meta.env.VITE_API_URL;

      const res = await axios.get(
        `${API}/api/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  fetchProfile();
}, []);



  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">

      {/* COVER SECTION */}
      <div className="profile-cover">
        <div className="profile-image-wrapper">
          <img
            src={
              user.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="profile-image"
          />
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="profile-info">
        <h1>{user.name}</h1>
        <h3>{user.headline || "Add your professional headline"}</h3>
        <p className="profile-location">
          {user.location || "Location not added"}
        </p>

        <button className="edit-btn">Edit Profile</button>
      </div>

      {/* ABOUT SECTION */}
      <div className="profile-card">
        <h2>About</h2>
        <p>{user.bio || "Tell recruiters about yourself..."}</p>
      </div>

      {/* SKILLS SECTION */}
      <div className="profile-card">
        <h2>Skills</h2>
        <div className="skills-container">
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
              <span key={index} className="skill-badge">
                {skill}
              </span>
            ))
          ) : (
            <p>No skills added yet.</p>
          )}
        </div>
      </div>

      {/* EXPERIENCE SECTION */}
      <div className="profile-card">
        <h2>Experience</h2>

        {user.experience && user.experience.length > 0 ? (
          user.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <h4>{exp.title}</h4>
              <p>{exp.company}</p>
              <span>
                {exp.from
                  ? new Date(exp.from).toLocaleDateString()
                  : ""}{" "}
                -{" "}
                {exp.current
                  ? "Present"
                  : exp.to
                  ? new Date(exp.to).toLocaleDateString()
                  : ""}
              </span>
              <p>{exp.description}</p>
            </div>
          ))
        ) : (
          <p>No experience added yet.</p>
        )}
      </div>

    </div>
  );
}

export default Profile;
