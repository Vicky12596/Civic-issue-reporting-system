import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ReportIssue from './pages/ReportIssue';
import MyReports from './pages/MyReports';
import IssueDetails from './pages/IssueDetails';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import Analytics from './pages/admin/Analytics';

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('cc_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cc_theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/issues/:id" element={<IssueDetails />} />

          <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
          <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><Analytics /></ProtectedRoute>} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}
