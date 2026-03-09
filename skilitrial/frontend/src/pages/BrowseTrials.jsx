import "./BrowseTrials.css";

function BrowseTrials() {
  return (
    <div className="browse-container">

      <div className="page-wrapper">

        <div className="browse-header">
          <h1>Browse Skill Trials</h1>
          <p>Practice real-world skills and unlock job opportunities</p>
        </div>

        <div className="browse-layout">

          {/* LEFT SIDE */}
          <div className="trial-list">

            <div className="trial-card">

              <div className="trial-left">
                <div className="trial-icon">💻</div>

                <div className="trial-content">
                  <h3>Java Login System</h3>
                  <p>Build authentication system in Java</p>

                  <div className="trial-meta">
                    <span className="tag">Backend</span>
                    <span className="tag">45 min</span>
                    <span className="tag medium">Medium</span>
                  </div>
                </div>
              </div>

              <button className="start-btn">Start Trial</button>

            </div>


            <div className="trial-card">

              <div className="trial-left">
                <div className="trial-icon">⚛️</div>

                <div className="trial-content">
                  <h3>React Dashboard UI</h3>
                  <p>Create responsive admin dashboard</p>

                  <div className="trial-meta">
                    <span className="tag">Frontend</span>
                    <span className="tag">60 min</span>
                    <span className="tag easy">Easy</span>
                  </div>
                </div>
              </div>

              <button className="start-btn">Start Trial</button>

            </div>


            <div className="trial-card">

              <div className="trial-left">
                <div className="trial-icon">🎧</div>

                <div className="trial-content">
                  <h3>Customer Support Simulation</h3>
                  <p>Handle real customer scenarios</p>

                  <div className="trial-meta">
                    <span className="tag">Communication</span>
                    <span className="tag">20 min</span>
                    <span className="tag easy">Easy</span>
                  </div>
                </div>
              </div>

              <button className="start-btn">Start Trial</button>

            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="job-panel">

            <h2>Job Opportunities</h2>

            <div className="job-card">
              <div>
                <h4>Frontend Developer</h4>
                <p>Full Time · Remote</p>
              </div>

              <button className="apply-btn">Apply</button>
            </div>


            <div className="job-card">
              <div>
                <h4>Customer Support Executive</h4>
                <p>Full Time · Pune</p>
              </div>

              <button className="apply-btn">Apply</button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BrowseTrials;