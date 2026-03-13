import "./Home.css";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/skilitrial-hero-optimized.jpg";
import javaImg from "../assets/trial-java.jpg";
import supportImg from "../assets/trial-support.jpg";
import adminImg from "../assets/trial-admin.jpg";
import HowItWorks from "../components/HowItWorks";

function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    // Scroll reveal
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 }
    );
    revealElements.forEach((el) => observer.observe(el));

    // Subtle parallax on hero image
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollY * 0.12}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const trials = [
    {
      to: "/java-login-trial",
      img: javaImg,
      alt: "Java Login System",
      label: "Engineering",
      title: "Java Login System",
      desc: "Build a complete authentication flow in Android Studio.",
      tag: "45 min",
    },
    {
      to: "/customer-support-trial",
      img: supportImg,
      alt: "Customer Support Trial",
      label: "Communication",
      title: "Customer Support Trial",
      desc: "Demonstrate communication & problem-solving skills.",
      tag: "30 min",
    },
    {
      to: "/office-admin-trial",
      img: adminImg,
      alt: "Office Admin Task",
      label: "Operations",
      title: "Office Admin Task",
      desc: "Show Excel, organization & workflow efficiency.",
      tag: "40 min",
    },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-noise" />
        <div className="hero-glow" />

        <div className="hero-content">
          <div className="hero-left">
            <span className="hero-eyebrow">
              <span className="eyebrow-dot" />
              Skills-First Hiring Platform
            </span>

            <h1 className="hero-headline">
              Show Your Skills.<br />
              <span className="headline-accent">Get Hired.</span>
            </h1>

            <p className="hero-sub">
              Prove what you can do with short video trials and get
              discovered by top employers — no resume needed.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">
                Join as Job Seeker
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/post-job" className="btn-outline">
                Find Talent
              </Link>
            </div>

            <div className="hero-pills">
              <span className="pill">✦ Real Skills</span>
              <span className="pill">✦ Short Videos</span>
              <span className="pill">✦ Direct Hiring</span>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card-wrap">
              <div className="hero-card-bg" />
              <div className="hero-card">
                <img
                  ref={heroRef}
                  src={heroImage}
                  alt="Skill Verified Professional"
                  className="hero-img"
                />
                <div className="hero-badge">
                  <span className="badge-icon">✓</span>
                  <div>
                    <div className="badge-title">Skill Verified</div>
                    <div className="badge-sub">Top 5% candidate</div>
                  </div>
                </div>
                <div className="hero-stat">
                  <div className="stat-num">12k+</div>
                  <div className="stat-label">Hired this year</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── FEATURED TRIALS ── */}
      <section className="featured reveal">
        <div className="section-header">
          <span className="section-label">Top Trials</span>
          <h2>Featured Skill Trials</h2>
          <p>Pick a trial, record your attempt, and land your next role.</p>
        </div>

        <div className="cards">
          {trials.map((t) => (
            <Link to={t.to} className="card" key={t.to}>
              <div className="card-img-wrap">
                <img src={t.img} alt={t.alt} />
                <div className="card-overlay">
                  <span className="card-label">{t.label}</span>
                </div>
                <div className="card-tag">{t.tag}</div>
              </div>
              <div className="card-body">
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <span className="card-cta">
                  Start Trial
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="browse-wrap">
          <Link to="/browse-trials" className="browse-btn">
            Browse All Trials
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta reveal">
        <div className="cta-bg" />
        <div className="cta-inner">
          <span className="section-label light">Get Started</span>
          <h2>Ready to Prove Your Skills?</h2>
          <p>
            Start your first trial and get noticed by{" "}
            <strong>top employers worldwide.</strong>
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary">
              Join Now for Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/post-job" className="btn-outline light">
              Find Talent
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-logo">Skilitrial</span>
            <p>Skills-first hiring, powered by proof.</p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Job Seekers</h4>
              <a href="#">Create Trial Videos</a>
              <a href="#">Get Verified</a>
              <a href="#">Get Hired</a>
            </div>
            <div className="footer-col">
              <h4>Employers</h4>
              <a href="#">Browse Talent</a>
              <a href="#">Post Jobs</a>
              <a href="#">Shortlist Candidates</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">How It Works</a>
              <a href="#">FAQ</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Skilitrial. All rights reserved.</span>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;