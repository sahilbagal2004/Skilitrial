import "./Home.css";
import { useEffect } from "react";
import heroImage from "../assets/skilitrial-hero-optimized.jpg";
import javaImg from "../assets/trial-java.jpg";
import supportImg from "../assets/trial-support.jpg";
import adminImg from "../assets/trial-admin.jpg";

function Home() {

  // Scroll reveal animation
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }, []);

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

            <p>
              Prove what you can do with short video trials and get discovered by top employers.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary">Join as Job Seeker</button>
              <button className="btn-outline">Find Talent</button>
            </div>

            <div className="hero-features">
              <span>✔ Real Skills</span>
              <span>✔ Short Videos</span>
              <span>✔ Direct Hiring</span>
            </div>
          </div>

          {/* RIGHT SIDE - IMAGE ONLY */}
          <div className="hero-right">
            <div className="single-card">
              <img
                src={heroImage}
                alt="Skill Verified Professional"
                className="parallax-img"
              />
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section reveal">
        <h2>How It Works</h2>

        <div className="how-container">
          <div className="how-card">
            <div className="icon-wrapper">📱</div>
            <h3>Record Your Trial</h3>
            <p>Complete a short task and upload your real skill performance.</p>
          </div>

          <div className="how-card">
            <div className="icon-wrapper">🛡️</div>
            <h3>Get Verified Badge</h3>
            <p>Receive verified recognition after expert evaluation.</p>
          </div>

          <div className="how-card">
            <div className="icon-wrapper">🤝</div>
            <h3>Get Hired Faster</h3>
            <p>Employers discover and hire based on proven ability.</p>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="featured reveal">
        <h2>Featured Skill Trials</h2>

        <div className="cards">

          <div className="card">
            <img src={javaImg} alt="Java Login System" />
            <h3>Java Login System</h3>
            <p>Build a complete authentication flow in Android Studio.</p>
          </div>

          <div className="card">
            <img src={supportImg} alt="Customer Support Call" />
            <h3>Customer Support Trial</h3>
            <p>Demonstrate communication & problem-solving skills.</p>
          </div>

          <div className="card">
            <img src={adminImg} alt="Office Admin Task" />
            <h3>Office Admin Task</h3>
            <p>Show Excel, organization & workflow efficiency.</p>
          </div>

        </div>

        <button className="browse-btn">Browse More Trials</button>
      </section>

      {/* CTA */}
      <section className="cta reveal">
        <h2>Ready to Prove Your Skills?</h2>
        <p>
          Start your first trial and get noticed by <b>top employers worldwide.</b>
        </p>

        <div className="cta-buttons">
          <button className="btn-primary">Join Now for Free</button>
          <button className="btn-outline">Find Talent</button>
        </div>
      </section>

      {/* FOOTER */}
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