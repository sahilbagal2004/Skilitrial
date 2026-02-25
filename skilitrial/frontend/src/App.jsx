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

function App() {
  const location = useLocation();

  // Pages where navbar should NOT show
  const noNavbarRoutes = [
    "/login",
    "/register",
    "/dashboard",
    "/recruiter-dashboard",
    "/profile",
  ];

  const hideNavbar = noNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="app-wrapper">
      {!hideNavbar && <Navbar />}

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse-trials" element={<BrowseTrials />} />
          <Route path="/post-job" element={<PostJob />} />

          {/* Candidate Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="candidate">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Dashboard */}
          <Route
            path="/recruiter-dashboard"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          {/* Profile (Logged in users only) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;