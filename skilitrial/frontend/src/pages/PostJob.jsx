import { useState } from "react";
import "./PostJob.css";

function PostJob() {

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Remote",
    description: "",
    skills: []
  });

  const [skillInput, setSkillInput] = useState("");
  const [logo, setLogo] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  /* Add Skill */
  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setJobData({
        ...jobData,
        skills: [...jobData.skills, skillInput]
      });
      setSkillInput("");
    }
  };

  /* Remove Skill */
  const removeSkill = (index) => {
    const updatedSkills = jobData.skills.filter((_, i) => i !== index);
    setJobData({ ...jobData, skills: updatedSkills });
  };

  /* Logo Upload */
  const handleLogo = (e) => {
    setLogo(URL.createObjectURL(e.target.files[0]));
  };

  /* Submit */
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Job Posted:", jobData);

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="post-job-container">

      <div className="post-job-card">

        <h1>Post a Job</h1>

        <form className="post-job-form" onSubmit={handleSubmit}>

          {/* Job Title */}
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            placeholder="Frontend Developer"
            value={jobData.title}
            onChange={handleChange}
            required
          />

          {/* Company Name */}
          <label>Company Name</label>
          <input
            type="text"
            name="company"
            placeholder="Google"
            value={jobData.company}
            onChange={handleChange}
            required
          />

          {/* Location */}
          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="Pune / Remote"
            value={jobData.location}
            onChange={handleChange}
          />

          {/* Salary */}
          <label>Salary Range</label>
          <input
            type="text"
            name="salary"
            placeholder="₹6 LPA - ₹10 LPA"
            value={jobData.salary}
            onChange={handleChange}
          />

          {/* Job Type */}
          <label>Job Type</label>
          <select name="type" value={jobData.type} onChange={handleChange}>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>Onsite</option>
          </select>

          {/* Skills */}
          <label>Required Skills</label>

          <div className="skills-input">
            <input
              type="text"
              placeholder="Add skill (React, Node...)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
            />

            <button type="button" onClick={addSkill}>
              Add
            </button>
          </div>

          <div className="skills-list">
            {jobData.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                <button onClick={() => removeSkill(index)}>×</button>
              </span>
            ))}
          </div>

          {/* Logo Upload */}
          <label>Company Logo</label>

          <input type="file" onChange={handleLogo} />

          {logo && (
            <img
              src={logo}
              alt="logo"
              className="logo-preview"
            />
          )}

          {/* Description */}
          <label>Job Description</label>
          <textarea
            name="description"
            placeholder="Describe the job role..."
            value={jobData.description}
            onChange={handleChange}
          />

          <button className="post-job-btn">
            Post Job
          </button>

        </form>

      </div>

      {/* SUCCESS POPUP */}

      {success && (
        <div className="success-popup">
          ✅ Job Posted Successfully!
        </div>
      )}

    </div>
  );
}

export default PostJob;