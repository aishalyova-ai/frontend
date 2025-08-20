import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProjects from './pages/admin/Projects';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

// User Pages (Freelancer/Individual)
import UserDashboard from './pages/user/Dashboard';
import BrowseSkills from './pages/user/BrowseSkills';
import UserProjects from './pages/user/Projects';
import UserProfile from './pages/user/Profile';
import Messages from './pages/user/Messages';
import ChatPage from './pages/user/ChatPage';
import SkillExchangeRequestsPage from './pages/user/SkillExchangeRequestsPage';
import ExchangeDetailsPage from "./pages/user/ExchangeDetailsPage"; // This is the correct component import
import ApplyProjectForm from "./pages/user/ApplyProjectForm";
import UserApplications from "./pages/user/UserApplications";
import ProjectDetailsPage from "./pages/user/ProjectDetailsPage";

// Employer Pages
import EmployerDashboard from './pages/employer/Dashboard';
import MyProjects from './pages/employer/MyProjects';
import NewProject from './pages/employer/NewProject';
import Applications from './pages/employer/Applications';
import Payments from './pages/employer/Payments';
import PostProject from './pages/employer/PostProject';

const ForgotPasswordPage = () => <div>Forgot Password Page (To be implemented)</div>;

export default function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Admin Routes */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/users" element={<AdminUsers />} />
        <Route path="/dashboard/admin/projects" element={<AdminProjects />} />
        <Route path="/dashboard/admin/reports" element={<AdminReports />} />
        <Route path="/dashboard/admin/settings" element={<AdminSettings />} />

        {/* User Routes (Freelancer) */}
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/user/browse-skills" element={<BrowseSkills />} />
        <Route path="/dashboard/user/projects" element={<UserProjects />} />
        <Route path="/dashboard/user/profile" element={<UserProfile />} />
        <Route path="/dashboard/user/messages" element={<Messages />} />
        <Route path="/dashboard/user/chat-page/:chatId?" element={<ChatPage />} />
        <Route path="/dashboard/user/SkillExchangeRequestsPage" element={<SkillExchangeRequestsPage />} />
        <Route path="/dashboard/user/exchange-details/:exchangeId" element={<ExchangeDetailsPage />} />
         <Route path="/dashboard/user/projects/:id" element={<ProjectDetailsPage />}/>
        <Route path="/dashboard/user/projects/:projectId/apply" element={<ApplyProjectForm />} />
        <Route path="/dashboard/user/user-applications" element={<UserApplications/>}/>

        {/* Employer Routes */}
        <Route path="/dashboard/employer" element={<EmployerDashboard />} />
        <Route path="/dashboard/employer/my-projects" element={<MyProjects />} />
        <Route path="/dashboard/employer/new-projects" element={<NewProject />} />
        <Route path="/dashboard/employer/applications" element={<Applications />} />
        <Route path="/dashboard/employer/payments" element={<Payments />} />
        <Route path="/dashboard/employer/post-project" element={<PostProject />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}