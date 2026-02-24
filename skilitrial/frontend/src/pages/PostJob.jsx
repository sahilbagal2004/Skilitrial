import "./PostJob.css";

function PostJob() {
  return (
    <div className="post-job-container">
      <div className="post-job-card">
        <h1>Post a Job</h1>

        <form className="post-job-form">
          <label>Job Title</label>
          <input type="text" placeholder="Frontend Developer" />

          <label>Company Name</label>
          <input type="text" placeholder="Google" />

          <label>Job Type</label>
          <select>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>Onsite</option>
          </select>

          <label>Job Description</label>
          <textarea placeholder="Describe the job role..." />

          <button className="post-job-btn">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;