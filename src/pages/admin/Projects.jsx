import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Briefcase,
  CheckCircle,
  DollarSign,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  Star,
  Users,
  MoreVertical,
  Trash2,
  XCircle,
  PauseCircle,
  Loader,
} from "lucide-react";

// Import the custom authentication hook
import { useAuth } from "../../context/AuthContext";

// The base URL for your backend API.
const API_URL = "http://localhost:8080/api/admin/projects";

// Tailwind CSS classes for different project statuses and priorities
const statusColors = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  disputed: "bg-red-100 text-red-800",
  suspended: "bg-gray-200 text-gray-700",
};

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

// Available status options for filtering and the modal dropdown
const statusOptions = [
  "All Status",
  "Active",
  "Completed",
  "Pending",
  "Disputed",
  "Suspended",
];

// Reusable modal component
function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
}

// A simple card component for displaying stats
function StatCard({ label, value, icon, bgColor }) {
  return (
    <div
      className={`flex items-center space-x-4 p-4 rounded-lg shadow-sm ${bgColor}`}
      role="region"
      aria-label={label}
    >
      <div className="p-3 rounded-full bg-white">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-700">{label}</p>
      </div>
    </div>
  );
}

// A component for a single project row in the table
// A component for a single project row in the table
function ProjectRow({
  project,
  openModal,
  toggleFeatured,
  suspendProject,
  deleteProject,
}) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Project & featured */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <p className="text-indigo-700 font-semibold">{project?.title || "Untitled"}</p>
            {project?.featured && (
              <span
                title="Featured Project"
                className="ml-2 px-2 py-0.5 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded"
              >
                Featured
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs">{project?.category || "No category"}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {project?.skills?.map((skill) => (
              <span
                key={skill}
                className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full"
              >
                {skill}
              </span>
            )) || <span className="text-gray-400 text-xs">No skills</span>}
          </div>
        </div>
      </td>

      {/* Employer */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          {project?.employer?.avatar ? (
            <img
              src={project.employer.avatar}
              alt={project.employer?.name || "Employer"}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/40x40/E0E7FF/4338CA?text=AD";
              }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-white font-semibold uppercase">
              {project?.employer?.name?.[0] || "?"}
            </div>
          )}
          <div>
            <p className="text-gray-900 font-medium">
              {project?.employer?.name || "Unknown Employer"}
            </p>
            <p className="text-gray-500 text-xs">
              {project?.employer?.email || "No email"}
            </p>
          </div>
        </div>
      </td>

      {/* Budget */}
      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
        {project?.budget != null ? `$${project.budget.toLocaleString()}` : "N/A"}
      </td>

      {/* Deadline */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-1 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{project?.deadline || "No deadline"}</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            statusColors[project?.status?.toLowerCase()] ||
            "bg-gray-100 text-gray-800"
          }`}
        >
          {project?.status
            ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
            : "Unknown"}
        </span>
      </td>

      {/* Applicants */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center space-x-1">
          <Users className="w-4 h-4 text-gray-600" />
          <span>{project?.applicants ?? 0}</span>
        </div>
      </td>

      {/* Priority */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            priorityColors[project?.priority?.toLowerCase()] ||
            "bg-gray-100 text-gray-800"
          }`}
        >
          {project?.priority
            ? project.priority.charAt(0).toUpperCase() +
              project.priority.slice(1)
            : "N/A"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
        <button
          title="View / Edit"
          onClick={openModal}
          className="p-1 rounded-md hover:bg-indigo-100 text-indigo-600 transition-colors"
          aria-label={`View details for ${project?.title || "project"}`}
          type="button"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
        <button
          title={project?.featured ? "Unfeature" : "Feature"}
          onClick={toggleFeatured}
          className={`p-1 rounded-md hover:bg-yellow-100 transition-colors ${
            project?.featured ? "text-yellow-600" : "text-gray-400"
          }`}
          aria-label={`${project?.featured ? "Remove" : "Add"} featured status`}
          type="button"
        >
          <Star className="w-5 h-5" />
        </button>
        <button
          title="Suspend Project"
          onClick={suspendProject}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label={`Suspend project ${project?.title || "project"}`}
          type="button"
        >
          <PauseCircle className="w-5 h-5" />
        </button>
        <button
          title="Delete Project"
          onClick={deleteProject}
          className="p-1 rounded-md hover:bg-red-100 text-red-600 transition-colors"
          aria-label={`Delete project ${project?.title || "project"}`}
          type="button"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}


// Main component for the admin projects page
export default function App() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [modalProject, setModalProject] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Get the token and authentication state from the AuthContext
  const { token, authLoading } = useAuth();

  // Function to fetch all projects from the API
  const fetchProjects = useCallback(async () => {
    // Do not attempt to fetch if authentication is still loading or there's no token
    if (authLoading || !token) {
      console.warn("Auth not ready or no token. Skipping fetch.");
      setIsLoading(false);
      return;
    }
    
    // Create a new AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Use the token from AuthContext
        },
        signal: controller.signal, // AbortController signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (e) {
      // Check if the error is an abort/timeout error
      if (e.name === 'AbortError') {
        setError("Request timed out. Please check your network or server.");
      } else {
        console.error("Failed to fetch projects:", e);
        setError("Failed to load projects. Please check your server or try again.");
      }
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId); // Clear the timeout if the request completes
    }
  }, [token, authLoading]);

  // Effect hook to fetch data when the component mounts or the token/authLoading state changes
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Function to update a project's state on the backend and in the local state
  const updateProject = async (id, changes) => {
    if (!token) {
      console.error("No token available. Cannot update project.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Use the token from AuthContext
        },
        body: JSON.stringify(changes),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Update local state with the change
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
      );
    } catch (e) {
      console.error(`Failed to update project ${id}:`, e);
      setError(`Failed to update project ${id}. Please try again.`);
    }
  };

  // Function to delete a project on the backend and in the local state
  const deleteProject = async (id) => {
    if (!token) {
      console.error("No token available. Cannot delete project.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Use the token from AuthContext
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Update local state by removing the project
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (modalProject?.id === id) setModalProject(null);
      setConfirmDeleteId(null);
    } catch (e) {
      console.error(`Failed to delete project ${id}:`, e);
      setError(`Failed to delete project ${id}. Please try again.`);
    }
  };

  // Stats calculation
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const disputedProjects = projects.filter((p) => p.status === "disputed").length;

  // Filtered & searched projects using useMemo for performance
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" ||
        project.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  // Modal save handler
  const saveModalChanges = () => {
    if (!modalProject) return;
    updateProject(modalProject.id, { status: modalProject.status });
    setModalProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-indigo-700">SkillSwap Admin</h1>
          </div>
          <nav className="hidden md:flex space-x-6 text-gray-700 font-semibold">
            <a
              href="#"
              className="hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="hover:text-indigo-600 transition-colors"
            >
              Users
            </a>
            <a
              href="#"
              className="text-indigo-600 border-b-2 border-indigo-600 pb-1"
            >
              Projects
            </a>
            <a
              href="#"
              className="hover:text-indigo-600 transition-colors"
            >
              Reports
            </a>
            <a
              href="#"
              className="hover:text-indigo-600 transition-colors"
            >
              Settings
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="relative p-2" aria-label="Notifications">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-600 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold uppercase">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-1">Project Management</h2>
          <p className="text-gray-600">Manage all projects on the platform</p>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            label="Total Projects"
            value={totalProjects}
            icon={<Briefcase className="w-7 h-7 text-indigo-600" />}
            bgColor="bg-indigo-100"
          />
          <StatCard
            label="Active Projects"
            value={activeProjects}
            icon={<CheckCircle className="w-7 h-7 text-green-600" />}
            bgColor="bg-green-100"
          />
          <StatCard
            label="Total Budget"
            value={`$${totalBudget.toLocaleString()}`}
            icon={<DollarSign className="w-7 h-7 text-yellow-600" />}
            bgColor="bg-yellow-100"
          />
          <StatCard
            label="Disputed Projects"
            value={disputedProjects}
            icon={<AlertTriangle className="w-7 h-7 text-red-600" />}
            bgColor="bg-red-100"
          />
        </section>

        {/* Search and Filter */}
        <section className="flex flex-col sm:flex-row items-center mb-6 gap-4">
          <div className="relative flex-grow max-w-lg">
            <input
              type="text"
              placeholder="Search by title, employer, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <div className="relative w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </section>

        {/* Projects Table */}
        <section className="bg-white rounded-lg shadow-md overflow-x-auto">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold">All Projects</h3>
            <p className="text-gray-600 text-sm">
              Showing {filteredProjects.length} of {totalProjects} projects
            </p>
          </div>

          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Project
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Employer
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-700">
                  Budget
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Deadline
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-700">
                  Applicants
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-700">
                  Priority
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading || authLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6">
                    <div className="flex justify-center items-center text-gray-500">
                      <Loader className="animate-spin mr-2" /> Loading...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-red-500 italic">
                    {error}
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500 italic">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    openModal={() => setModalProject(project)}
                    toggleFeatured={() =>
                      updateProject(project.id, {
                        featured: !project.featured,
                      })
                    }
                    suspendProject={() =>
                      updateProject(project.id, { status: "suspended" })
                    }
                    deleteProject={() => setConfirmDeleteId(project.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* Project Details Modal */}
      {modalProject && (
        <Modal onClose={() => setModalProject(null)}>
          <h3 className="text-xl font-bold mb-2">Project Details</h3>
          <p className="text-gray-600 mb-6">View and manage project information.</p>
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Title:</label>
              <p>{modalProject.title}</p>
            </div>
            <div>
              <label className="font-semibold">Description:</label>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
                convallis.
              </p>
            </div>
            <div>
              <label className="font-semibold">Budget:</label>
              <p>${modalProject.budget.toLocaleString()}</p>
            </div>
            <div>
              <label className="font-semibold">Deadline:</label>
              <p>{modalProject.deadline}</p>
            </div>
            <div>
              <label className="font-semibold">Skills:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {modalProject.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold block mb-1">Status:</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={modalProject.status}
                onChange={(e) =>
                  setModalProject((p) => ({ ...p, status: e.target.value }))
                }
              >
                {statusOptions
                  .filter((s) => s !== "All Status")
                  .map((status) => (
                    <option key={status} value={status.toLowerCase()}>
                      {status}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setModalProject(null)}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
                Cancel
            </button>
            <button
              onClick={saveModalChanges}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
                Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId !== null && (
        <Modal onClose={() => setConfirmDeleteId(null)}>
          <div className="p-4 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Confirm Deletion</h3>
            <p className="text-gray-600">
              Are you sure you want to delete this project? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProject(confirmDeleteId)}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
