import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ If not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ If role required and user role doesn't match
  if (role && user?.role !== role) {
    // Redirect properly based on their role
    if (user?.role === "recruiter") {
      return <Navigate to="/recruiter-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // ✅ Access allowed
  return children;
}

export default ProtectedRoute;