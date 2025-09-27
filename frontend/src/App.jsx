<<<<<<< HEAD
import React from "react";
import { Button } from "@/components/ui/button";
import Navbar from "./components/Landing/navbar"; // ✅ fixed path

function App() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Page content */}
      <div className="flex flex-1 items-center justify-center">
        <Button className="bg-blue-500 text-white">Click me</Button>
      </div>
    </div>
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import PostProject from './pages/PostProject';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Register from './pages/Register';

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
        </Routes>
      </Router>
    </AuthProvider>
>>>>>>> 67c8ade71df03ca73236a32dc56f91effd0a5ab8
  );
}

export default App;
