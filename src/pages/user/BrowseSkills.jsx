"use client"

import React, { useEffect, useState } from "react"
import { Search, MapPin, Clock, Star, X } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { useAuth } from "../../context/AuthContext"

// Separate component for the request modal
const ExchangeRequestModal = ({ showModal, onClose, selectedUserId, user, token }) => {
  const [skillOffered, setSkillOffered] = useState("")
  const [skillWanted, setSkillWanted] = useState("")

const sendRequest = async () => {
  if (!skillOffered || !skillWanted) {
    toast.warn("Please fill in both skills before sending")
    return
  }

  if (!user || !token) {
    toast.error("You must be logged in to send a request")
    onClose()
    return
  }

  const requestBody = {
    requester: { id: user.id },
    partner: { id: selectedUserId },
    skillOffered,
    skillWanted,
  }

  try {
    await axios.post(
      "http://localhost:8080/api/exchanges/request",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    toast.success("Request sent successfully!")
    onClose()
  } catch (error) {
    console.error(error)
    toast.error("Failed to send request. Try again!")
  }
}
  if (!showModal) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Request Skill Exchange</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill you can offer:</label>
          <input
            type="text"
            value={skillOffered}
            onChange={(e) => setSkillOffered(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill you want to learn:</label>
          <input
            type="text"
            value={skillWanted}
            onChange={(e) => setSkillWanted(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={sendRequest}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BrowseSkillsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [locationFilter, setLocationFilter] = useState("")
  const [experienceFilter, setExperienceFilter] = useState("All Levels")
  const [skillListings, setSkillListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)

  const { user, token } = useAuth()

  const categories = ["Technology", "Creative", "Business", "Education", "Health", "Language"]
  const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"]

  const fetchSkills = () => {
    setLoading(true)
    setError(null)
    axios.get("http://localhost:8080/api/public/users")
      .then(response => {
        setSkillListings(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch skill listings:", err)
        setError("Failed to load skills data. Please try again.")
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const filteredListings = skillListings.filter(userFromList => {
    if (user && userFromList.id === user.id) {
      return false
    }

    const matchesSearch =
      searchQuery === "" ||
      userFromList.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userFromList.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (userFromList.skillsOffered && userFromList.skillsOffered.some(skill =>
        skill.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    const matchesCategory =
      categoryFilter === "All Categories" ||
      (userFromList.skillsOffered && userFromList.skillsOffered.some(skill => skill.category === categoryFilter));
    
    const matchesLocation =
      locationFilter === "" ||
      userFromList.location?.toLowerCase().includes(locationFilter.toLowerCase());
      
    const matchesExperience =
      experienceFilter === "All Levels" ||
      (userFromList.experience && userFromList.experience === experienceFilter);

    return matchesSearch && matchesCategory && matchesLocation && matchesExperience;
  });

  const openModal = (userId) => {
    if (!user) {
      toast.error("You must be logged in to send a request.")
      return
    }
    setSelectedUserId(userId)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading skills...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={fetchSkills}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">SkillSwap</h1>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
              <Link to="/dashboard/user/browse-skills" className="text-indigo-600 font-medium">Browse Skills</Link>
              <Link to="/dashboard/user/projects" className="text-gray-700 hover:text-indigo-600">Projects</Link>
              <Link to="/dashboard/user/profile" className="text-gray-700 hover:text-indigo-600">Profile</Link>
              <Link to="/dashboard/user/SkillExchangeRequestsPage" className="text-gray-700 hover:text-indigo-600">Requests</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Skills</h2>
          <p className="text-gray-600">Find people to exchange skills with in our community</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search skills, people, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="All Levels">All Levels</option>
              {experienceLevels.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredListings.length} of {skillListings.length} skill listings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredListings.map(user => (
            <div key={user.id} className="bg-white border rounded-lg shadow-sm p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <img
                  src={user.avatarUrl ? `http://localhost:8080${user.avatarUrl}` : "/default-avatar.png"}
                  alt={user.fullName || "User Avatar"}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{user.fullName}</h3>
                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded">
  {user.skillsOffered && user.skillsOffered.length > 0 && user.skillsOffered[0] ? user.skillsOffered[0].category : "General"}
</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location || "Unknown"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {user.rating || "N/A"} ({user.reviewCount || 0} reviews)
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {user.experience || "N/A"}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-3 text-sm">{user.bio || "No bio provided."}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {user.skillsOffered?.filter(skill => skill).map(skill => (
                      <span key={skill.name} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => openModal(user.id)}
                    className="mt-3 text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                  >
                    Request Skill Exchange
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExchangeRequestModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        selectedUserId={selectedUserId}
        user={user}
        token={token}
      />
    </div>
  )
}