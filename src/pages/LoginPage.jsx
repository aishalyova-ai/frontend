// src/pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Building, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // from LoginPage.jsx
import { jwtDecode } from 'jwt-decode';




export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("individual"); // UI state, not sent to backend
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  // We only need 'login' here for the submit handler.
  // 'user' is handled by AuthContext internally after login, and its state
  // changes are picked up by components rendered after navigation.
  const { login } = useAuth(); // Get the login function from context

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email, // Backend expects 'username'
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed. Please check your credentials.");
      }

      const data = await response.json();
      console.log("Login successful:", data);
if (data.token) {
  await login(data.token);
  console.log("JWT Token stored and user context updated.");

  // Decode the token from data.token
  const decoded = jwtDecode(data.token);

  const userRoles = decoded.roles || [];

  if (userRoles.includes("ROLE_ADMIN")) {
    navigate("/dashboard/admin");
  } else if (userRoles.includes("ROLE_EMPLOYER")) {
    navigate("/dashboard/employer");
  } else if (userRoles.includes("ROLE_INDIVIDUAL")) {
    navigate("/dashboard/user");
  } else {
    console.warn("User has no recognized roles. Redirecting to default dashboard.");
    navigate("/dashboard/user");
  }
}

        // --- End Role-based Redirection Logic ---

     
    } catch (err) {
      console.error("Login error:", err);
      // Display the error message from the thrown Error
      setError(err.message || "Login failed. An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">SkillSwap</h1>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
        </div>

        <div className="bg-white rounded shadow p-6">
          <div className="mb-6">
            <div className="flex space-x-4 mb-2">
              {[
                { label: "Individual", value: "individual", icon: User },
                { label: "Employer", value: "employer", icon: Building },
                { label: "Admin", value: "admin", icon: Shield },
              ].map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  className={`flex items-center px-3 py-1 rounded ${
                    userType === value ? "bg-indigo-600 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setUserType(value)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {userType === "individual" &&
                "Sign in as an individual to find projects and share your skills"}
              {userType === "employer" &&
                "Sign in as an employer to post projects and find talent"}
              {userType === "admin" &&
                "Sign in as an administrator to manage the platform"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                  className="form-checkbox"
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm text-gray-500 bg-white px-2">
              Or continue with
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" className="w-full border border-gray-300 rounded py-2 flex items-center justify-center hover:bg-gray-100 transition">
              {/* Google Icon */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.08 3.28-7.79z" />
                <path d="M12 22c2.7 0 4.98-.89 6.64-2.41l-3.17-2.64c-.88.59-2 .94-3.47.94-2.66 0-4.93-1.8-5.73-4.21H3.16v2.64C4.8 19.8 8.17 22 12 22z" />
                <path d="M6.27 13.68a6.22 6.22 0 0 1 0-3.36V7.68H3.16v2.64c.35 2.4 2.64 4.31 5.11 4.31z" />
              </svg>
              Google
            </button>
            <button type="button" className="w-full border border-gray-300 rounded py-2 flex items-center justify-center hover:bg-gray-100 transition">
              {/* GitHub Icon */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 0 0 8.21 11.43c.6.11.82-.26.82-.58 0-.29-.01-1.07-.02-2.1-3.34.73-4.04-1.61-4.04-1.61-.54-1.37-1.32-1.74-1.32-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.5.12-3.13 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.63.24 2.83.12 3.13.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.64-5.48 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.21.7.82.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}