import { useState } from "react";
import "./PostJob.css";

function PostJob() {

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    type: "Remote",
    description: ""
  });

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Job Posted:", jobData);

    // Later you can send this to backend
    // axios.post("/api/jobs", jobData)

    alert("Job Posted Successfully!");
  };

  return (
    <div className="post-job-container">

      <div className="post-job-card">

        <h1>Post a Job</h1>

        <form className="post-job-form" onSubmit={handleSubmit}>

          {/* Job Title */}
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              placeholder="Frontend Developer"
              value={jobData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Company Name */}
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="company"
              placeholder="Google"
              value={jobData.company}
              onChange={handleChange}
              required
            />
          </div>

          {/* Job Type */}
          <div className="form-group">
            <label>Job Type</label>
            <select
              name="type"
              value={jobData.type}
              onChange={handleChange}
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Job Description</label>
            <textarea
              name="description"
              placeholder="Describe the job role..."
              value={jobData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="post-job-btn">
            Post Job
          </button>

        </form>

      </div>

    </div>
  );
}

export default PostJob;