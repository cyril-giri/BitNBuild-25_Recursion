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

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }
  console.log(user, role);
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />; // Redirect to dashboard instead of register
  }

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
