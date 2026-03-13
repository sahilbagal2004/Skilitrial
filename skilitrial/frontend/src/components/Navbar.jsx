import "./Navbar.css";
import logo from "../assets/logo.svg";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowNavbar(false);
        setMenuOpen(false);
      } else {
        setShowNavbar(true);
      }
      setScrolled(window.scrollY > 50);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { to: "/subscription", label: "Subscription" },
    { to: "/browse-trials", label: "Browse Trials" },
    { href: "#how-it-works", label: "How It Works" },
    { to: "/post-job", label: "Post a Job" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: showNavbar ? 0 : -100, opacity: showNavbar ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className={`navbar ${scrolled ? "scrolled" : ""}`}
      >
        {/* Logo — SVG already contains the wordmark, no extra span needed */}
        <NavLink to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Skilitrial" className="logo-img" />
        </NavLink>

        {/* Desktop Links */}
        <ul className="nav-links-desktop">
          {navLinks.map((link) =>
            link.href ? (
              <li key={link.label}>
                <a href={link.href} className="nav-link">{link.label}</a>
              </li>
            ) : (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link${isActive ? " nav-link--active" : ""}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            )
          )}
        </ul>

        {/* Desktop Auth */}
        <div className="nav-auth-desktop">
          <NavLink to="/login" className="btn-login">Log In</NavLink>
          <NavLink to="/register" className="btn-start">
            Get Started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </NavLink>
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="mobile-menu-header">
                <NavLink to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
                  <img src={logo} alt="Skilitrial" className="logo-img" />
                </NavLink>
                <button
                  className="mobile-close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <ul className="mobile-links">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                  >
                    {link.href ? (
                      <a href={link.href} className="mobile-link" onClick={() => setMenuOpen(false)}>
                        {link.label}
                      </a>
                    ) : (
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `mobile-link${isActive ? " mobile-link--active" : ""}`
                        }
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </NavLink>
                    )}
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="mobile-auth"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <NavLink to="/login" className="btn-login-mobile" onClick={() => setMenuOpen(false)}>
                  Log In
                </NavLink>
                <NavLink to="/register" className="btn-start-mobile" onClick={() => setMenuOpen(false)}>
                  Get Started
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </NavLink>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;