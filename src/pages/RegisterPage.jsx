import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { X, Plus } from "lucide-react"

export default function RegisterPage() {
    const [userType, setUserType] = useState("")
    const [skills, setSkills] = useState([])
    const [newSkill, setNewSkill] = useState("") // Correctly defined setNewSkill
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "", // Frontend validation only, not sent to backend directly
        phone: "",
        location: "",
        bio: "",
        experience: "",
        companyName: "",
        companySize: "",
        industry: "",
    })
    const [error, setError] = useState(null); // State to store registration errors
    const [successMessage, setSuccessMessage] = useState(null); // State for success messages

    const navigate = useNavigate(); // Hook for navigation

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()])
            setNewSkill("")
        }
    }

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove))
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => { // Made the function async
        e.preventDefault()
        setError(null) // Clear previous errors
        setSuccessMessage(null); // Clear previous success messages

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Construct the payload for the backend
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            username: formData.email, // Using email as username as per backend setup
            password: formData.password,
            role: userType.toUpperCase(), // Ensure role is uppercase: INDIVIDUAL, EMPLOYER, BOTH
            phone: formData.phone,
            location: formData.location,
            bio: formData.bio,
            experience: formData.experience,
            companyName: formData.companyName,
            companySize: formData.companySize,
            industry: formData.industry,
            skills: skills, // Send skills array
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json(); // Always try to parse JSON, even for errors

            if (!response.ok) {
                // If response is not OK (e.g., 400, 500), throw an error
                throw new Error(data.message || "Registration failed: An unknown error occurred.");
            }

            console.log("Registration successful:", data);
            setSuccessMessage(data.message || "Registration successful!");
            // Optionally navigate to login page after successful registration
            navigate("/signin");

        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Join SkillSwap</h1>
                    <p className="text-gray-600 mt-2">Create your account and start exchanging skills</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-1">Create Your Account</h2>
                        <p className="text-gray-600 text-sm">
                            Fill in your details to get started with skill swapping
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

                        {/* User Type */}
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">I want to join as:</label>
                            <select
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="" disabled>
                                    Select user type
                                </option>
                                <option value="individual">Individual (Skill Swapper)</option>
                                <option value="employer">Employer (Project Poster)</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block mb-2 font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    required
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block mb-2 font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    required
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                required
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    required
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                    required
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Phone and Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block mb-2 font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="location" className="block mb-2 font-medium text-gray-700">
                                    Location
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    placeholder="City, Country"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange("location", e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Employer fields */}
                        {(userType === "employer" || userType === "both") && (
                            <>
                                <div>
                                    <label htmlFor="companyName" className="block mb-2 font-medium text-gray-700">
                                        Company Name
                                    </label>
                                    <input
                                        id="companyName"
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700">Company Size</label>
                                        <select
                                            value={formData.companySize}
                                            onChange={(e) => handleInputChange("companySize", e.target.value)}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="" disabled>
                                                Select company size
                                            </option>
                                            <option value="1-10">1-10 employees</option>
                                            <option value="11-50">11-50 employees</option>
                                            <option value="51-200">51-200 employees</option>
                                            <option value="201-1000">201-1000 employees</option>
                                            <option value="1000+">1000+ employees</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="industry" className="block mb-2 font-medium text-gray-700">
                                            Industry
                                        </label>
                                        <input
                                            id="industry"
                                            type="text"
                                            value={formData.industry}
                                            onChange={(e) => handleInputChange("industry", e.target.value)}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Individual fields */}
                        {(userType === "individual" || userType === "both") && (
                            <>
                                <div>
                                    <label htmlFor="bio" className="block mb-2 font-medium text-gray-700">
                                        Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => handleInputChange("bio", e.target.value)}
                                        rows={3}
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="experience" className="block mb-2 font-medium text-gray-700">
                                        Experience
                                    </label>
                                    <textarea
                                        id="experience"
                                        value={formData.experience}
                                        onChange={(e) => handleInputChange("experience", e.target.value)}
                                        rows={3}
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    ></textarea>
                                </div>

                                {/* Skills input */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Skills</label>
                                    <div className="flex gap-2 flex-wrap mb-2">
                                        {skills.map((skill) => (
                                            <div
                                                key={skill}
                                                className="flex items-center bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm"
                                            >
                                                <span>{skill}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill)}
                                                    className="ml-1 focus:outline-none"
                                                    aria-label={`Remove skill ${skill}`}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add a skill and press Enter"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)} // Corrected the function call
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    addSkill()
                                                }
                                            }}
                                            className="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={addSkill}
                                            className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
                        >
                            Register
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-indigo-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
