import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import PostProject from "./pages/PostProject";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";

// src/App.jsx - PrivateRoute
const PrivateRoute = ({ children, allowedRoles }) => {
  // role will now be null ONLY if user is null or if there was an error.
  const { user, role, loading } = useAuth(); 

  // The condition is simpler and safer now: WAIT until loading is FALSE.
  if (loading) {
    return <div>Loading Profile and Auth...</div>; // Show a clear loading state
  }

  // Auth Check
  if (!user) {
    console.log("Redirecting to login: No authenticated user.");
    return <Navigate to="/login" replace />;
  }
  
  // Role/Authorization Check
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log(`Redirecting to dashboard: Role ${role} not in [${allowedRoles.join(', ')}].`);
    return <Navigate to="/dashboard" replace />; 
  }

  // All checks passed
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Freelancer routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["freelancer", "client", "admin"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={["freelancer", "client", "admin"]}>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Client only */}
          <Route
            path="/post-project"
            element={
              <PrivateRoute allowedRoles={["client"]}>
                <PostProject />
              </PrivateRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
