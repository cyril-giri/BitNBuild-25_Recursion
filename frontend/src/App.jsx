import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import PostProject from './pages/PostProject';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ProjectDetailPage from './pages/ProjectDetail';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/register" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />

          {/* Freelancer routes */}
          <Route
            path="/dashboard"
            element={<PrivateRoute allowedRoles={['freelancer', 'client', 'admin']}><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/profile"
            element={<PrivateRoute allowedRoles={['freelancer', 'client', 'admin']}><Profile /></PrivateRoute>}
          />

          {/* Client only */}
          <Route
            path="/post-project"
            element={<PrivateRoute allowedRoles={['client']}><PostProject /></PrivateRoute>}
          />

          {/* Admin only */}
          <Route
            path="/admin"
            element={<PrivateRoute allowedRoles={['admin']}><AdminPanel /></PrivateRoute>}
          />

          {/* Project Detail Page (public route) */}
          <Route
            path="/project/:id"
            element={<ProjectDetailPage />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
