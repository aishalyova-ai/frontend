import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Award,
  Search,
  MessageCircle,
  Plus,
} from "lucide-react";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No authentication token found. Please log in.");

        const response = await fetch("http://localhost:8080/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const rawText = await response.text();
        console.log("Raw response text:", rawText);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = JSON.parse(rawText);
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching user profile for dashboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        No user data available. Please ensure you are logged in and your profile exists.
      </div>
    );
  }

  const displayName = userProfile.firstName || userProfile.username || "User";

  const quickActions = [
    {
      title: "Browse Skills",
      icon: <Search className="text-indigo-600" size={18} />,
      link: "/dashboard/user/browse-skills",
    },
    {
      title: "Find Projects",
      icon: <Briefcase className="text-indigo-600" size={18} />,
      link: "/dashboard/user/projects",
    },
    {
      title: "Update Profile",
      icon: <Award className="text-indigo-600" size={18} />,
      link: "/dashboard/user/profile",
    },
    {
      title: "Messages",
      icon: <MessageCircle className="text-indigo-600" size={18} />,
      link: "/dashboard/user/messages",
    },
  ];

 const skillProgressData =
  userProfile.skillsOffered
    ? userProfile.skillsOffered
        .filter(skill => skill !== null && skill !== undefined) // 👈 Filter out any null/undefined skills
        .map((skill) => ({
          name: skill.name,
          percent:
            skill.level === "Expert"
              ? 100
              : skill.level === "Advanced"
              ? 80
              : skill.level === "Intermediate"
              ? 60
              : skill.level === "Beginner"
              ? 40
              : 0,
        }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">SkillSwap</h1>
        <nav className="space-x-6 hidden md:flex">
          <Link to="/dashboard/user/browse-skills" className="text-gray-600 hover:text-indigo-600">
            Browse Skills
          </Link>
          <Link to="/dashboard/user/projects" className="text-gray-600 hover:text-indigo-600">
            Projects
          </Link>
          <Link to="/dashboard/user/messages" className="text-gray-600 hover:text-indigo-600">
            Messages
          </Link>
          <Link to="/dashboard/user/profile" className="text-gray-600 hover:text-indigo-600">
            Profile
          </Link>
          <Link to="/dashboard/user/SkillExchangeRequestsPage" className="text-gray-600 hover:text-indigo-600">
            Requests
          </Link>
        </nav>
        <div className="flex items-center space-x-3">
          <button className="relative bg-indigo-100 text-indigo-600 p-2 rounded-full hover:bg-indigo-200">
            <MessageCircle className="w-5 h-5" />
          </button>
          <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
            {displayName.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-1">Welcome back, {displayName}!</h2>
          <p className="text-gray-600">
            Here's what's happening with your skill exchanges and projects today.
          </p>
        </section>

        {/* Removed stats section */}

        <section>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white border hover:bg-indigo-50 p-4 rounded-lg flex flex-col items-center space-y-2 shadow-sm"
              >
                {action.icon}
                <span className="text-sm font-medium">{action.title}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Skill Progress</h3>
          <p className="text-sm text-gray-600 mb-4">Track your learning journey.</p>
          <div className="space-y-4">
            {skillProgressData.length > 0 ? (
              skillProgressData.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${skill.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No skills offered yet. Add some to get started!</p>
            )}
            <Link
              to="/dashboard/user/profile"
              className="mt-4 flex items-center text-indigo-600 hover:underline"
            >
              <Plus size={16} className="mr-1" /> Add/Manage Skills
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
