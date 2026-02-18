import "./Home.css";
import javaImg from "../assets/trial-java.jpg";
import supportImg from "../assets/trial-support.jpg";
import adminImg from "../assets/trial-admin.jpg";



function Home() {
  return (
    <>
      {/* HERO SECTION */}
<section className="hero">
  <div className="hero-content">

    {/* LEFT SIDE */}
    <div className="hero-left">
      <h1>
        Show Your Skills. <br /> Get Hired.
      </h1>

      <p>Prove what you can do with short video trials.</p>

      <div className="hero-buttons">
        <button className="btn-primary">Join as Job Seeker</button>
        <button className="btn-outline">Find Talent</button>
      </div>

      <div className="hero-features">
        <span>✔ Real Skills</span>
        <span>✔ Short Videos</span>
        <span>✔ Job Offers</span>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="hero-right">

      <div className="hero-card card-1">
        <img src={javaImg} alt="Java Trial" />
        <div className="card-text">
          <h4>App Developer</h4>
          <p>Building a Login Screen</p>
        </div>
      </div>

      <div className="hero-card card-2">
        <img src={supportImg} alt="Support Trial" />
        <div className="card-text">
          <h4>Call Center</h4>
          <p>Handling Customer Queries</p>
        </div>
      </div>

      <div className="hero-card card-3">
        <img src={adminImg} alt="Admin Trial" />
        <div className="card-text">
          <h4>Admin Task</h4>
          <p>Excel Data Entry</p>
        </div>
      </div>

    </div>

  </div>
</section>
    {/* HOW IT WORKS */ }
    < section className = "how-section" >
        <h2>How It Works</h2>

        <div className="how-container">

          <div className="how-card">
            <div className="icon-wrapper">📱</div>
            <h3>Record Your Trial</h3>
            <p>Complete a short skill-based task and upload your video.</p>
          </div>

          <div className="arrow">→</div>

          <div className="how-card">
            <div className="icon-wrapper">🛡️</div>
            <h3>Get Verified Badge</h3>
            <p>Receive a verified skill badge after evaluation.</p>
          </div>

          <div className="arrow">→</div>

          <div className="how-card">
            <div className="icon-wrapper">🤝</div>
            <h3>Get Hired Faster</h3>
            <p>Employers discover and hire you quickly.</p>
          </div>

        </div>
      </section >



    <section className="featured">
      <h2>Featured Skill Trials</h2>

      <div className="cards">

        <div className="card">
          <img src={javaImg} alt="Java Login System" />
          <h3>Java Login System</h3>
          <p>Building a Login in Android Studio</p>
        </div>

        <div className="card">
          <img src={supportImg} alt="Customer Support Call" />
          <h3>Customer Support Call</h3>
          <p>Handling Difficult Customers</p>
        </div>

        <div className="card">
          <img src={adminImg} alt="Office Admin Task" />
          <h3>Office Admin Task</h3>
          <p>Organizing Spreadsheets</p>
        </div>

      </div>

      <button className="browse-btn">Browse More Trials</button>
    </section>


  {/* CTA SECTION */ }
  <section className="cta">
    <h2>Ready to Prove Your Skills?</h2>
    <p>Start Your First Trial & Get Noticed by <b>Top Employers!</b></p>

    <div className="cta-buttons">
      <button className="btn-primary">Join Now for Free</button>
      <button className="btn-dark">Find Talent</button>
    </div>
  </section>

  {/* FOOTER */ }
  <footer className="footer">
    <div className="footer-columns">
      <div>
        <h4>For Job Seekers</h4>
        <p>Create Trial Videos</p>
        <p>Get Verified</p>
        <p>Get Hired</p>
      </div>

      <div>
        <h4>For Employers</h4>
        <p>Browse Talent</p>
        <p>Post Jobs</p>
        <p>Shortlist Candidates</p>
      </div>

      <div>
        <h4>About</h4>
        <p>How It Works</p>
        <p>FAQ</p>
        <p>Contact Us</p>
      </div>
    </div>

    <div className="footer-bottom">
      © 2026 Skilitrial. All rights reserved.
    </div>
  </footer>
    </>
  );
}

export default Home;
