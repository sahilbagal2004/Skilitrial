import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Building2, Clock, Briefcase, Plus, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API}/api/jobs`);
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, [API, navigate]);

  const handleApply = (jobId) => {
    alert(`Applied for Job ID: ${jobId}`);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title?.toLowerCase().includes(search.toLowerCase()) || 
                          job.company?.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "All" || job.type === filter;
    
    return matchesSearch && matchesFilter;
  });

  const categories = ["All", "Full-time", "Part-time", "Contract", "Remote"];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="jobs-page-wrapper">
      <div className="jobs-content">
        
        <motion.div 
          className="jobs-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="jobs-hero-badge">
            <TrendingUp size={16} />
            <span>Over 500+ New Opportunities</span>
          </div>
          <h1>Find Your Next <span className="text-gradient">Dream Role</span></h1>
          <p>Discover real jobs based on your verified skills, not just your resume.</p>
          
          <div className="search-container">
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="post-btn" onClick={() => navigate('/post-job')}>
              <Plus size={18} />
              <span>Post a Job</span>
            </button>
          </div>

          <div className="filters-row">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="jobs-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence mode="popLayout">
            {filteredJobs.length === 0 ? (
              <motion.div 
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="empty-state-icon">
                  <Search size={48} />
                </div>
                <h3>No jobs found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                <button className="clear-btn" onClick={() => { setSearch(""); setFilter("All"); }}>
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              filteredJobs.map((job) => (
                <motion.div 
                  key={job._id} 
                  className="job-card"
                  variants={itemVariants}
                  layout
                >
                  <div className="job-card-header">
                    <div className="company-logo">
                      {job.company?.charAt(0) || "C"}
                    </div>
                    <div className="job-meta">
                      <span className={`job-type ${job.type?.toLowerCase().replace('-', '')}`}>
                        {job.type || "Full-time"}
                      </span>
                      <span className="job-time">
                        <Clock size={14} />
                        2d ago
                      </span>
                    </div>
                  </div>

                  <div className="job-card-body">
                    <h3>{job.title}</h3>
                    <div className="company-info-row">
                      <div className="company-info">
                        <Building2 size={16} />
                        <span>{job.company || "Company Name"}</span>
                      </div>
                      <div className="location-info">
                        <MapPin size={16} />
                        <span>{job.location || "Remote"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="job-card-footer">
                    <div className="salary">
                      {job.salary || "$80k - $120k"}
                    </div>
                    <button
                      className="apply-btn"
                      onClick={() => handleApply(job._id)}
                    >
                      <Briefcase size={16} />
                      Apply Now
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
        
      </div>
    </div>
  );
}

export default Jobs;