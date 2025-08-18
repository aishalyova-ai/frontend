import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  Star,
  ArrowRight
} from "lucide-react"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const featuredSkills = [
    { name: "Web Development", count: 245, category: "Technology" },
    { name: "Graphic Design", count: 189, category: "Creative" },
    { name: "Digital Marketing", count: 156, category: "Business" },
    { name: "Photography", count: 134, category: "Creative" },
    { name: "Data Analysis", count: 98, category: "Technology" },
    { name: "Language Teaching", count: 87, category: "Education" },
  ]

  const recentExchanges = [
    {
      id: 1,
      user1: { name: "Sarah Chen", avatar: "/placeholder.svg", skill: "React Development" },
      user2: { name: "Mike Johnson", avatar: "/placeholder.svg", skill: "UI/UX Design" },
      status: "completed",
      rating: 5,
    },
    {
      id: 2,
      user1: { name: "Alex Rivera", avatar: "/placeholder.svg", skill: "Spanish Tutoring" },
      user2: { name: "Emma Davis", avatar: "/placeholder.svg", skill: "Photography" },
      status: "ongoing",
      rating: null,
    },
  ]

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">SkillSwap</h1>
          <nav className="hidden md:flex space-x-8">
            <Link to="/dashboard/user/browse-skills" className="text-gray-700 hover:text-indigo-600">Browse Skills</Link>
            <Link to="/dashboard/user/projects" className="text-gray-700 hover:text-indigo-600">Projects</Link>
            <Link to="/dashboard/user/community" className="text-gray-700 hover:text-indigo-600">Community</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/signin" className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 transition">Sign In</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Exchange Skills,
            <span className="text-indigo-600"> Build Community</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with others to share knowledge, learn new skills, and find exciting project opportunities.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for skills, projects, or people..."
                className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-indigo-500 w-full"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">
                Search
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-indigo-600 text-white text-lg px-8 py-4 rounded hover:bg-indigo-700 transition">Start Skill Swapping</Link>
            <Link to="/dashboard/user/projects" className="border border-indigo-600 text-indigo-600 text-lg px-8 py-4 rounded hover:bg-indigo-50 transition">Find Projects</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      

      {/* Featured Skills */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Popular Skills</h3>
            <p className="text-gray-600">Discover the most in-demand skills in our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSkills.map((skill, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{skill.name}</h4>
                    <p className="text-gray-500">{skill.category}</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm font-semibold">
                    {skill.count} users
                  </span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center">
                  Explore <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Exchanges */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Recent Skill Exchanges</h3>
            <p className="text-gray-600">See how our community members are connecting and growing together</p>
          </div>
          <div className="space-y-6">
            {recentExchanges.map((ex) => (
              <div key={ex.id} className="border rounded-lg p-6 bg-white shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* User 1 */}
                <div className="flex items-center space-x-4">
                  <img src={ex.user1.avatar} alt={ex.user1.name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">{ex.user1.name}</div>
                    <div className="text-sm text-gray-500">{ex.user1.skill}</div>
                  </div>
                </div>

                <div className="hidden md:block mx-6 text-indigo-600">
                  <ArrowRight className="h-8 w-8" />
                </div>

                {/* User 2 */}
                <div className="flex items-center space-x-4">
                  <img src={ex.user2.avatar} alt={ex.user2.name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">{ex.user2.name}</div>
                    <div className="text-sm text-gray-500">{ex.user2.skill}</div>
                  </div>
                </div>

                {/* Status & Rating */}
                <div className="ml-auto text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    ex.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {ex.status === "completed" ? "Completed" : "Ongoing"}
                  </div>
                  {ex.rating && (
                    <div className="mt-2 flex justify-end text-yellow-500">
                      {[...Array(ex.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white py-6 text-center">
        <p>&copy; 2025 SkillSwap. All rights reserved.</p>
      </footer>
    </div>
  )
}
