import "./BrowseTrials.css";

function BrowseTrials() {
  return (
    <div className="browse-container">
      <h1>Browse Skill Trials</h1>

      <div className="browse-layout">

        {/* Left Panel */}
        <div className="trial-list">

          <div className="trial-card">
            <h3>Java Login System</h3>
            <p>Build authentication system in Java</p>
            <button>Start Trial</button>
          </div>

          <div className="trial-card">
            <h3>React Dashboard UI</h3>
            <p>Create responsive admin dashboard</p>
            <button>Start Trial</button>
          </div>

          <div className="trial-card">
            <h3>Customer Support Simulation</h3>
            <p>Handle real customer scenarios</p>
            <button>Start Trial</button>
          </div>

        </div>

        {/* Right Panel */}
        <div className="job-panel">
          <h2>Job Opportunities</h2>

          <div className="job-card">
            <h4>Frontend Developer</h4>
            <p>Full Time · Remote</p>
            <button>Apply</button>
          </div>

          <div className="job-card">
            <h4>Customer Support Executive</h4>
            <p>Full Time · Pune</p>
            <button>Apply</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BrowseTrials;
