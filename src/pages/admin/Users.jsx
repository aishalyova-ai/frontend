import React, { useState, useMemo } from "react";
import {Link} from 'react-router-dom'
import {
  ShieldCheck,
  Bell,
  Search,
  Users,
  User,
  Building,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Edit2,
  MoreVertical,
  Check,
  X,
  Bell as BellIcon,
  Filter,
  Download,
  UserPlus,
} from "lucide-react";

function AdminUsersPage() {
  // Sample users data (replace or load from API)
  const initialUsers = [
    {
      id: 1,
      fullName: "Alice Johnson",
      email: "alice@example.com",
      avatar: null,
      type: "Individual",
      status: "active",
      location: "New York, USA",
      joined: "2022-01-15",
    },
    {
      id: 2,
      fullName: "Beta Corp",
      email: "contact@betacorp.com",
      avatar: null,
      type: "Employer",
      status: "pending",
      location: "San Francisco, USA",
      joined: "2023-03-02",
    },
    {
      id: 3,
      fullName: "Charlie Smith",
      email: "charlie@example.com",
      avatar: null,
      type: "Individual",
      status: "suspended",
      location: "London, UK",
      joined: "2021-11-22",
    },
    {
      id: 4,
      fullName: "Diana Prince",
      email: "diana@example.com",
      avatar:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      type: "Individual",
      status: "active",
      location: "Paris, France",
      joined: "2022-07-19",
    },
  ];

  const [users] = useState(initialUsers);

  // Filters & UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, Individual, Employer
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, pending, suspended
  const [activeTab, setActiveTab] = useState("all"); // all, active, pending, suspended
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  // Helpers
  const normalize = (str) => (str ? str.toLowerCase() : "");

  // Filter users based on search & filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Tab filter
      if (activeTab !== "all" && user.status !== activeTab) return false;

      // Type filter
      if (filterType !== "all" && user.type !== filterType) return false;

      // Status filter
      if (filterStatus !== "all" && user.status !== filterStatus) return false;

      // Search filter (name, email, skills)
      const q = normalize(searchQuery);
      if (q) {
        const found =
          normalize(user.fullName).includes(q) ||
          normalize(user.email).includes(q);
        if (!found) return false;
      }

      return true;
    });
  }, [users, activeTab, filterType, filterStatus, searchQuery]);

  // Counts for tabs (reflecting filters for type and search)
  const counts = useMemo(() => {
    const c = { all: 0, active: 0, pending: 0, suspended: 0 };
    users.forEach((u) => {
      if (
        (filterType === "all" || u.type === filterType) &&
        (searchQuery === "" ||
          normalize(u.fullName).includes(normalize(searchQuery)) ||
          normalize(u.email).includes(normalize(searchQuery)))
      ) {
        c.all++;
        if (u.status === "active") c.active++;
        else if (u.status === "pending") c.pending++;
        else if (u.status === "suspended") c.suspended++;
      }
    });
    return c;
  }, [users, filterType, searchQuery]);

  // Status label colors
  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
  };

  // Type label styles
  const typeIcon = (type) =>
    type === "Individual" ? (
      <User className="w-4 h-4 mr-1" />
    ) : (
      <Building className="w-4 h-4 mr-1" />
    );

  // User initials
  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
    );
  };

  // Clear all filters
  function clearFilters() {
    setSearchQuery("");
    setFilterType("all");
    setFilterStatus("all");
    setActiveTab("all");
  }

  // Toggle dropdown for a user row
  function toggleDropdown(id) {
    setDropdownOpenId((curr) => (curr === id ? null : id));
  }

  // Action handlers (stub)
  function viewUser(id) {
    alert("View user " + id);
  }
  function editUser(id) {
    alert("Edit user " + id);
  }
  function approveUser(id) {
    alert("Approve user " + id);
  }
  function rejectUser(id) {
    alert("Reject user " + id);
  }
  function suspendUser(id) {
    alert("Suspend user " + id);
  }
  function reactivateUser(id) {
    alert("Reactivate user " + id);
  }
  function sendNotification(id) {
    alert("Send notification to user " + id);
  }
  function exportUsers() {
    alert("Export users (not implemented)");
  }
  function addUser() {
    alert("Add new user (not implemented)");
  }

  // Empty state messages by tab
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
      icon: <XCircle className="w-16 h-16 text-yellow-400" />,
      heading: "No pending users",
      description: "All users have been reviewed.",
    },
    suspended: {
      icon: <XCircle className="w-16 h-16 text-red-400" />,
      heading: "No suspended users",
      description: "Try reactivating some users.",
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between px-6 h-14 shadow-md z-50">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-blue-500" />
          <h1 className="font-bold text-lg select-none">SkillSwap Admin</h1>
        </div>
        <nav className="hidden md:flex space-x-6 font-semibold">
          <Link to="/dashboard/admin"
            className="text-gray-400 hover:text-gray-200 transition"
            aria-label="Dashboard"
          >
            Dashboard
          </Link>
          <Link to="/dashboard/admin/users"
            className="text-white border-b-2 border-blue-500 pb-1 transition"
            aria-current="page"
            aria-label="Users"
          >
            Users
          </Link>
          <Link
            href="/dashboard/admin/projects"
            className="text-gray-400 hover:text-gray-200 transition"
            aria-label="Projects"
          >
            Projects
          </Link>
          <Link
            to="/dashboard/admin/reports"
            className="text-gray-400 hover:text-gray-200 transition"
            aria-label="Reports"
          >
            Reports
          </Link>
          <Link
            href="/dashboard/admin/settings"
            className="text-gray-400 hover:text-gray-200 transition"
            aria-label="Settings"
          >
            Settings
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            aria-label="Notifications"
            className="relative focus:outline-none"
            type="button"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-900"></span>
          </button>
          <div
            title="Admin User"
            className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-semibold select-none text-sm"
          >
            AD
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 max-w-7xl mx-auto px-6 pb-16">
        {/* Page Title */}
        <section className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">
            Manage all users on the SkillSwap platform.
          </p>
        </section>

        {/* Filters Card */}
        <section className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search users by name, email, or skills..."
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search users"
              spellCheck={false}
            />
            <Search
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* User Type Filter */}
          <div>
            <label htmlFor="user-type" className="sr-only">
              User Type
            </label>
            <select
              id="user-type"
              className="border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Employer">Employer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="sr-only">
              Status
            </label>
            <select
              id="status-filter"
              className="border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* More Filters Button */}
          <button
            type="button"
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="More filters"
            onClick={() => alert("More filters (not implemented)")}
          >
            <Filter className="w-5 h-5" />
            <span>More Filters</span>
          </button>

          {/* Clear Filters Button (conditional) */}
          {(searchQuery || filterType !== "all" || filterStatus !== "all") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 font-semibold focus:outline-none"
            >
              Clear Filters
            </button>
          )}

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Export Button */}
          <button
            type="button"
            onClick={exportUsers}
            className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2 text-gray-700 focus:outline-none"
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>

          {/* Add User Button */}
          <button
            type="button"
            onClick={addUser}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 focus:outline-none"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </section>

        {/* Tabs */}
        <nav
          aria-label="User status tabs"
          className="border-b border-gray-200 mb-4 overflow-x-auto"
        >
          <ul className="flex -mb-px space-x-6">
            {[
              { id: "all", label: "All Users", icon: Users, count: counts.all },
              {
                id: "active",
                label: "Active",
                icon: CheckCircle2,
                count: counts.active,
              },
              {
                id: "pending",
                label: "Pending",
                icon: AlertTriangle,
                count: counts.pending,
              },
              {
                id: "suspended",
                label: "Suspended",
                icon: XCircle,
                count: counts.suspended,
              },
            ].map(({ id, label, icon: Icon, count }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex items-center border-b-2 py-3 px-1 text-sm font-semibold transition-colors focus:outline-none ${
                    activeTab === id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  aria-current={activeTab === id ? "page" : undefined}
                >
                  <Icon
                    className={`w-5 h-5 mr-2 ${
                      activeTab === id ? "text-blue-600" : "text-gray-400"
                    }`}
                    aria-hidden="true"
                  />
                  {label} ({count})
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Users Table or Empty State */}
        {filteredUsers.length > 0 ? (
          <section className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                      {user.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar}
                          alt={`${user.fullName} avatar`}
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                          {getInitials(user.fullName)}
                        </div>
                      )}
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {user.fullName}
                        </div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center">
                      {typeIcon(user.type)}
                      <span>{user.type}</span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          statusColors[user.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.location}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.joined).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={dropdownOpenId === user.id}
                        onClick={() => toggleDropdown(user.id)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        aria-label={`Actions for ${user.fullName}`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {/* Dropdown Menu */}
                      {dropdownOpenId === user.id && (
                        <div
                          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby={`actions-menu-${user.id}`}
                        >
                          <button
                            onClick={() => {
                              viewUser(user.id);
                              setDropdownOpenId(null);
                            }}
                            className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                            role="menuitem"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </button>

                          <button
                            onClick={() => {
                              editUser(user.id);
                              setDropdownOpenId(null);
                            }}
                            className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                            role="menuitem"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit User
                          </button>

                          {user.status === "pending" && (
                            <>
                              <button
                                onClick={() => {
                                  approveUser(user.id);
                                  setDropdownOpenId(null);
                                }}
                                className="group flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-100 w-full"
                                role="menuitem"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Approve User
                              </button>
                              <button
                                onClick={() => {
                                  rejectUser(user.id);
                                  setDropdownOpenId(null);
                                }}
                                className="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full"
                                role="menuitem"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Reject User
                              </button>
                            </>
                          )}

                          {user.status === "active" && (
                            <button
                              onClick={() => {
                                suspendUser(user.id);
                                setDropdownOpenId(null);
                              }}
                              className="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full"
                              role="menuitem"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Suspend User
                            </button>
                          )}

                          {user.status === "suspended" && (
                            <button
                              onClick={() => {
                                reactivateUser(user.id);
                                setDropdownOpenId(null);
                              }}
                              className="group flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-100 w-full"
                              role="menuitem"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Reactivate User
                            </button>
                          )}

                          <button
                            onClick={() => {
                              sendNotification(user.id);
                              setDropdownOpenId(null);
                            }}
                            className="group flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-100 w-full"
                            role="menuitem"
                          >
                            <BellIcon className="w-4 h-4 mr-2" />
                            Send Notification
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          // Empty state
          <section className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center text-center text-gray-600">
            {emptyStateData[activeTab].icon}
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {emptyStateData[activeTab].heading}
            </h3>
            <p className="mt-2">{emptyStateData[activeTab].description}</p>
            {(searchQuery || filterType !== "all" || filterStatus !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Clear Filters
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminUsersPage;
