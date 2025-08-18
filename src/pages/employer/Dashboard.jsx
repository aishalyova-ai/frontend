"use client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  ClipboardList,
  MessageSquare,
  User,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function EmployerDashboard() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error("No token found. Please log in.");
        const res = await fetch("http://localhost:8080/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const raw = await res.text();
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = JSON.parse(raw);

        setProfile({
          ...data,
          totalProjects: data.postedProjects?.length || 0,
          pendingApplications: data.openApplications || 0,
          completedProjects: data.completedProjects || 0,
          rating: data.rating || 4.5,
        });

        if (Array.isArray(data.postedProjects)) {
          const latest = data.postedProjects
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map((proj) => ({
              type: "new_project",
              message: `You posted: "${proj.title}"`,
              date: proj.createdAt
                ? new Date(proj.createdAt).toLocaleDateString()
                : "Recently",
              link: `/dashboard/employer/projects/${proj.id}`,
            }));
          setRecentActivities(latest);
        } else {
          setRecentActivities([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        Error: {error}
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Failed to load profile.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">SkillSwap</h1>
            <nav className="hidden md:flex space-x-8">
              <Link to="/dashboard/employer" className="text-indigo-600 font-medium">
                Dashboard
              </Link>
              <Link to="/dashboard/employer/my-projects" className="text-gray-700 hover:text-indigo-600">
                Projects
              </Link>
              <Link to="/dashboard/employer/applications" className="text-gray-700 hover:text-indigo-600">
                Applications
              </Link>
              <Link to="/dashboard/employer/payments" className="text-gray-700 hover:text-indigo-600">
                Payments
              </Link>
             
            </nav>
            <Link to="/logout"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-gray-100 text-gray-900 hover:bg-gray-200"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="flex items-center space-x-4 mb-8 bg-white p-6 rounded-lg shadow-sm border">
          <div className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-indigo-500">
            <img src={profile.avatarUrl || "/placeholder-avatar.png"} alt={profile.firstName} className="object-cover w-full h-full" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome, {profile.firstName}!
            </h2>
            <p className="text-gray-600 text-lg">
              Manage your projects, applications, and more.
            </p>
          </div>
        </div>

       
        {/* Recent Activity & Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            {recentActivities.length > 0 ? (
              <ul className="space-y-4">
                {recentActivities.map((act, idx) => (
                  <li key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                    <Briefcase className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-gray-800 text-sm">
                        {act.message}
                        <Link to={act.link} className="text-indigo-600 hover:underline ml-1">
                          View
                        </Link>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{act.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No recent projects to display.</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <QuickLink to="/dashboard/employer/projects/new" icon={<Briefcase className="h-5 w-5" />} label="Post New Project" />
              <QuickLink to="/dashboard/employer/applications" icon={<ClipboardList className="h-5 w-5" />} label="View Applications" />
              <QuickLink to="/dashboard/employer/profile" icon={<User className="h-5 w-5" />} label="Edit Profile" />
              <QuickLink to="/dashboard/user/messages" icon={<MessageSquare className="h-5 w-5" />} label="Messages" />
              <QuickLink to="/projects" icon={<LayoutGrid className="h-5 w-5" />} label="Explore Projects" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


// Quick link component
function QuickLink({ to, icon, label }) {
  return (
    <li>
      <Link to={to} className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 hover:underline">
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
}
