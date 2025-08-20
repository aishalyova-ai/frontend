import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, CheckCircle2, AlertTriangle, XCircle, MoreVertical, Search, Filter, Download, UserPlus 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsersPage() {
  const { token, user } = useAuth();
  const userId = user?.id; // current admin's ID

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  const emptyStateData = {
    all: {
      icon: <Users className="w-16 h-16 text-gray-400" />,
      heading: "No users found",
      description: "Try adjusting your search criteria.",
    },
    active: {
      icon: <CheckCircle2 className="w-16 h-16 text-green-400" />,
      heading: "No active users found",
      description: "All active users are shown here.",
    },
    pending: {
      icon: <AlertTriangle className="w-16 h-16 text-yellow-400" />,
      heading: "No pending users",
      description: "All users have been reviewed.",
    },
    suspended: {
      icon: <XCircle className="w-16 h-16 text-red-400" />,
      heading: "No suspended users",
      description: "Try reactivating some users.",
    },
  };

useEffect(() => {
  async function fetchUsers() {
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
      const data = await res.json();

      // Get logged-in user's ID from AuthContext
      const loggedInUserId = user?.id;

      const mapped = data
        .filter(u => u.id !== loggedInUserId) // exclude admin himself
        .map(u => ({
          id: u.id,
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
          avatar: u.avatarUrl || "",
          type: u.role || "Individual",  // actual role from backend
          location: u.location || "",
          status: u.status || "active",
          joined: u.joinedDate || new Date().toISOString(),
          skills: u.skills || [],
        }));

      setUsers(mapped);
      setFilteredUsers(mapped);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchUsers();
}, [token, user]);


  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterStatus("all");
    setFilteredUsers(users);
  };

  const toggleDropdown = (id) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
  };

  const typeIcon = (type) => <Users className="w-4 h-4 mr-1" />;

  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
  };

  useEffect(() => {
    let temp = [...users];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      temp = temp.filter(
        u =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.skills.join(",").toLowerCase().includes(q)
      );
    }
    if (filterType !== "all") temp = temp.filter(u => u.type === filterType);
    if (filterStatus !== "all") temp = temp.filter(u => u.status === filterStatus);
    if (activeTab !== "all") temp = temp.filter(u => u.status === activeTab);
    setFilteredUsers(temp);
  }, [users, searchQuery, filterType, filterStatus, activeTab]);

  const exportUsers = () => console.log("Exporting users...");
  const addUser = () => console.log("Add user clicked");
  const viewUser = (id) => console.log("View user", id);
  const editUser = (id) => console.log("Edit user", id);
  const approveUser = (id) => console.log("Approve user", id);
  const rejectUser = (id) => console.log("Reject user", id);
  const suspendUser = (id) => console.log("Suspend user", id);
  const reactivateUser = (id) => console.log("Reactivate user", id);
  const sendNotification = (id) => console.log("Send notification", id);

  const counts = {
    all: users.length,
    active: users.filter(u => u.status === "active").length,
    pending: users.filter(u => u.status === "pending").length,
    suspended: users.filter(u => u.status === "suspended").length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between px-6 h-14 shadow-md z-50">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-500" />
          <h1 className="font-bold text-lg select-none">SkillSwap Admin</h1>
        </div>
        <nav className="hidden md:flex space-x-6 font-semibold">
          <Link to="/dashboard/admin" className="text-gray-400 hover:text-gray-200">Dashboard</Link>
          <Link to="/dashboard/admin/users" className="text-white border-b-2 border-blue-500 pb-1">Users</Link>
          <Link to="/dashboard/admin/projects" className="text-gray-400 hover:text-gray-200">Projects</Link>
          <Link to="/dashboard/admin/reports" className="text-gray-400 hover:text-gray-200">Reports</Link>
          <Link to="/dashboard/admin/settings" className="text-gray-400 hover:text-gray-200">Settings</Link>
        </nav>
      </header>

      <main className="pt-16 max-w-7xl mx-auto px-6 pb-16">
        {/* Search & Filters */}
        <section className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search users by name, email, or skills..."
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
          <div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Employer">Employer</option>
            </select>
          </div>
          <div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <button type="button" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
            <Filter className="w-5 h-5" />
            <span>More Filters</span>
          </button>
          {(searchQuery || filterType !== "all" || filterStatus !== "all") && (
            <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-800 font-semibold">Clear Filters</button>
          )}
          <div className="flex-grow"></div>
          <button onClick={exportUsers} className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2 text-gray-700">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
          <button onClick={addUser} className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2">
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </section>

        {/* Tabs */}
        <nav className="border-b border-gray-200 mb-4 overflow-x-auto">
          <ul className="flex -mb-px space-x-6">
            {["all", "active", "pending", "suspended"].map(tab => {
              const Icon = { all: Users, active: CheckCircle2, pending: AlertTriangle, suspended: XCircle }[tab];
              return (
                <li key={tab}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`inline-flex items-center border-b-2 py-3 px-1 text-sm font-semibold ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Users Table */}
        <section className="bg-white rounded-lg shadow p-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading users...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              {emptyStateData[activeTab].icon}
              <h3 className="text-xl font-semibold mt-4">{emptyStateData[activeTab].heading}</h3>
              <p className="text-gray-500 mt-2">{emptyStateData[activeTab].description}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Joined</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="px-4 py-2 flex items-center space-x-2">
                        {user.avatar ? (
                          <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                            {getInitials(user.firstName, user.lastName)}
                          </div>
                        )}
                        <span>{user.firstName} {user.lastName}</span>
                      </td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2 flex items-center">{typeIcon(user.type)}{user.type}</td>
                      <td className="px-4 py-2">{user.location}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[user.status] || "bg-gray-100 text-gray-700"}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2">{new Date(user.joined).toLocaleDateString()}</td>
                      <td className="px-4 py-2 relative">
                        <button onClick={() => toggleDropdown(user.id)} className="p-1 rounded hover:bg-gray-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {dropdownOpenId === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow z-10">
                            <button onClick={() => viewUser(user.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">View</button>
                            <button onClick={() => editUser(user.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Edit</button>
                            <button onClick={() => approveUser(user.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Approve</button>
                            <button onClick={() => rejectUser(user.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Reject</button>
                            <button onClick={() => suspendUser(user.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Suspend</button>
                            <button onClick={() => reactivateUser(user.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Reactivate</button>
                            <button onClick={() => sendNotification(user.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Send Notification</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
