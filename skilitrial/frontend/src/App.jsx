import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BrowseTrials from "./pages/BrowseTrials";
import PostJob from "./pages/PostJob";
import Jobs from "./pages/Jobs";
import Reports from "./pages/Reports";
import SkillTrials from "./pages/SkillTrials";
import CustomerSupportTrialStart from "./pages/CustomerSupportTrialStart";

// ✅ Trial Pages
import CustomerSupportTrial from "./pages/CustomerSupportTrial";
import JavaLoginTrial from "./pages/JavaLoginTrial";
import JavaLoginStart from "./pages/JavaLoginStart";   // ✅ ADDED
import OfficeAdminTrial from "./pages/OfficeAdminTrial";

function App() {
  const location = useLocation();

  // Hide Navbar on these pages
  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/dashboard",
    "/recruiter-dashboard",
    "/jobs",
    "/reports",
    "/skill-trials",
    "/profile"
  ];

  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="app-wrapper">
      {!shouldHideNavbar && <Navbar />}

      <Routes>

        {/* ===== Public Routes ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse-trials" element={<BrowseTrials />} />
        <Route path="/post-job" element={<PostJob />} />

        {/* ===== Trial Pages ===== */}
        <Route path="/customer-support-trial" element={<CustomerSupportTrial />} />
        <Route path="/java-login-trial" element={<JavaLoginTrial />} />
        <Route path="/java-login-trial/start" element={<JavaLoginStart />} />   {/* ✅ ADDED */}
        <Route path="/office-admin-trial" element={<OfficeAdminTrial />} />

        {/* ===== Candidate Protected Routes ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="candidate">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute role="candidate">
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute role="candidate">
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skill-trials"
          element={
            <ProtectedRoute role="candidate">
              <SkillTrials />
            </ProtectedRoute>
          }
        />
        <Route
  path="/trial/customer-support/start"
  element={<CustomerSupportTrialStart />}
/>

        {/* ===== Recruiter Protected Route ===== */}
        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== Profile ===== */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  );
}

export default App;