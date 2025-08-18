import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import { format } from "date-fns";

const API_BASE_URL = "http://localhost:8080";

// --- Utility function to get the token from localStorage ---
const getToken = () => {
  return localStorage.getItem('jwtToken'); // Ensure 'jwtToken' matches how you store it after login
};

// --- Simple Edit Project Modal Component ---
function EditProjectModal({ project, onClose, onSave }) {
  const [editedProject, setEditedProject] = useState(project);

  useEffect(() => {
    setEditedProject(project);
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(editedProject.id, editedProject);
    onClose();
  };

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Project: {project.title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={editedProject.title || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
            <textarea
              id="description"
              name="description"
              value={editedProject.description || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
            <select
              id="category"
              name="category"
              value={editedProject.category || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Category</option>
              {["Web Development", "Graphic Design", "UI/UX Design", "Digital Marketing", "Data Science", "Video Production"].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="budget" className="block text-gray-700 text-sm font-bold mb-2">Budget:</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={editedProject.budget || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="budgetType" className="block text-gray-700 text-sm font-bold mb-2">Budget Type:</label>
            <select
              id="budgetType"
              name="budgetType"
              value={editedProject.budgetType || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Budget Type</option>
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="deadline" className="block text-gray-700 text-sm font-bold mb-2">Deadline:</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={editedProject.deadline ? format(new Date(editedProject.deadline), 'yyyy-MM-dd') : ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="progress" className="block text-gray-700 text-sm font-bold mb-2">Progress (%):</label>
            <input
              type="number"
              id="progress"
              name="progress"
              value={editedProject.progress || 0}
              onChange={handleChange}
              min="0"
              max="100"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
            <select
              id="status"
              name="status"
              value={editedProject.status || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="reviewing">Reviewing</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main MyProjects Component ---
function MyProjects() {
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    "Web Development", "Graphic Design", "UI/UX Design",
    "Digital Marketing", "Data Science", "Video Production",
  ];
  const statuses = ["active", "completed", "reviewing", "paused", "draft"];

  // Use useCallback for fetchProjects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      console.log('Token being sent for projects GET:', token);

      if (!token) {
        setError("You are not logged in. Please log in to view your projects.");
        setLoading(false);
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/employer/projects`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (e) {
      console.error("Failed to fetch projects:", e);
      setError(`Failed to load projects: ${e.message}. Please ensure your backend is running and you are logged in.`);
      if (e.message.includes('403') || e.message.includes('401')) {
          // localStorage.removeItem('jwtToken');
          // navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [setProjects, setLoading, setError, navigate]); // Dependencies for useCallback

  const handleNewProjectClick = () => {
    navigate("/dashboard/employer/post-project");
  };

  // Use useCallback for handleUpdateProject
  const handleUpdateProject = useCallback(async (projectId, updatedProjectData) => {
    const token = getToken();
    if (!token) {
      setError("Authentication required to update project. Please log in.");
      return;
    }

    console.log(`Attempting to update project ${projectId} with:`, updatedProjectData);
    try {
      const payload = {
        ...updatedProjectData,
        skills: Array.isArray(updatedProjectData.skills) ? updatedProjectData.skills : (updatedProjectData.skills ? updatedProjectData.skills.split(',').map(s => s.trim()) : [])
      };
      if (payload.deadline) {
        payload.deadline = new Date(payload.deadline).toISOString().split('T')[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/employer/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const returnedProject = await response.json();
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p.id === projectId ? returnedProject : p))
      );
      console.log("Project updated successfully:", returnedProject);
      setError(null);
    } catch (e) {
      console.error(`Failed to update project ${projectId}:`, e);
      setError(`Error updating project: ${e.message}`);
    }
  }, [setProjects, setError]); // Dependencies for useCallback

  // Use useCallback for handleDeleteProject
  const handleDeleteProject = useCallback(async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      const token = getToken();
      if (!token) {
        setError("Authentication required to delete project. Please log in.");
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/employer/projects/${projectId}`, {
          method: "DELETE",
          headers: {
              "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
        console.log("Project deleted successfully:", projectId);
        setError(null);
      } catch (e) {
        console.error(`Failed to delete project ${projectId}:`, e);
        setError(`Error deleting project: ${e.message}`);
      }
    }
  }, [setProjects, setError]); // Dependencies for useCallback

  // Fetch projects on initial load
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); // Now fetchProjects is a stable dependency thanks to useCallback

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "reviewing": return "bg-yellow-100 text-yellow-800";
      case "paused": return "bg-gray-100 text-gray-800";
      case "draft": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    const iconProps = { className: "h-4 w-4" };
    switch (status) {
      case "active": return <Clock {...iconProps} />;
      case "completed": return <CheckCircle {...iconProps} />;
      case "reviewing": return <Eye {...iconProps} />;
      case "paused": return <AlertCircle {...iconProps} />;
      case "draft": return <Edit {...iconProps} />;
      default: return <AlertCircle {...iconProps} />;
    }
  };

  const filteredAndSearchedProjects = projects.filter((project) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(search) ||
      project.description.toLowerCase().includes(search) ||
      (project.skills && Array.isArray(project.skills) && project.skills.some((skill) => skill.toLowerCase().includes(search)));

    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const groupedProjects = {
    all: filteredAndSearchedProjects,
    active: filteredAndSearchedProjects.filter((p) => p.status === "active"),
    reviewing: filteredAndSearchedProjects.filter((p) => p.status === "reviewing"),
    completed: filteredAndSearchedProjects.filter((p) => p.status === "completed"),
    paused: filteredAndSearchedProjects.filter((p) => p.status === "paused"),
    draft: filteredAndSearchedProjects.filter((p) => p.status === "draft"),
  };

  // --- Dropdown Menu Component (inline) ---
  function DropdownMenu({ projectId }) {
    const isOpen = dropdownOpenId === projectId;

    const handleEditClick = () => {
      const projectToEdit = projects.find(p => p.id === projectId);
      if (projectToEdit) {
        setProjectToEdit(projectToEdit);
        setIsEditModalOpen(true);
      }
      setDropdownOpenId(null);
    };

    const handleViewDetailsClick = () => {
      navigate(`/dashboard/employer/projects/${projectId}`);
      setDropdownOpenId(null);
    };

    const handleDeleteClick = () => {
      handleDeleteProject(projectId); // Using the useCallback-wrapped function
      setDropdownOpenId(null);
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (isOpen && !event.target.closest(`#dropdown-button-${projectId}`) && !event.target.closest(`#dropdown-menu-${projectId}`)) {
          setDropdownOpenId(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, projectId]);

    return (
      <div className="relative inline-block text-left z-10">
        <button
          id={`dropdown-button-${projectId}`}
          onClick={() => setDropdownOpenId(isOpen ? null : projectId)}
          className="inline-flex justify-center p-1 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          aria-haspopup="true"
          aria-expanded={isOpen ? "true" : "false"}
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {isOpen && (
          <div
            id={`dropdown-menu-${projectId}`}
            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby={`dropdown-button-${projectId}`}
          >
            <div className="py-1">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={handleViewDetailsClick}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={handleEditClick}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                role="menuitem"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800 hidden md:block">SkillSwap Employer</h1>
          <nav>
            <ul className="flex space-x-4 text-sm md:text-base">
              <li><Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link></li>
              <li><Link to="/employer/projects" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">My Projects</Link></li>
              <li><Link to="/applications" className="text-gray-600 hover:text-blue-600">Applications</Link></li>
              <li><Link to="/payments" className="text-gray-600 hover:text-blue-600">Payments</Link></li>
            </ul>
          </nav>
        </div>
        <button
          type="button"
          onClick={handleNewProjectClick}
          className="mt-4 md:mt-0 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </header>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
        <p className="text-gray-600 mt-1">Manage all your posted projects and track their progress.</p>
      </section>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm md:w-48"
          aria-label="Filter projects by status"
        >
          <option value="all">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm md:w-48"
          aria-label="Filter projects by category"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {["all", "active", "reviewing", "completed", "draft"].map((tab) => {
            const tabName = tab === "all" ? "All Projects" : tab.charAt(0).toUpperCase() + tab.slice(1);
            const isSelected = activeTab === tab;
            const count = (groupedProjects[tab] || []).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                  isSelected
                    ? "border-blue-600 text-blue-600 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                }
                aria-current={isSelected ? "page" : undefined}
              >
                {tabName} ({count})
              </button>
            );
          })}
        </nav>
      </div>

      {loading && <p className="text-center text-gray-500 text-lg py-10">Loading projects...</p>}
      {error && <p className="text-center text-red-600 text-lg py-10">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(groupedProjects[activeTab] || []).length === 0 ? (
            <p className="col-span-full text-center text-gray-500 text-lg py-10">No projects found for this selection.</p>
          ) : (
            (groupedProjects[activeTab] || []).map((project) => (
             // ... inside the .map((project) => (...)
             
<div
    key={project.id}
    className="bg-white shadow-md rounded-lg p-6 relative group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
>
    <div>
        {/* Status Badge */}
        <span
            className={`absolute top-4 right-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                project.status
            )}`}
        >
            {getStatusIcon(project.status)}
            {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Unknown'}
        </span>

        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900 pr-16">{project.title}</h3>
            {/* --- THIS IS THE LINE TO CHANGE --- */}
            <div className="absolute top-4 right-1.5 opacity-100 transition-opacity duration-200 z-20"> {/* Changed from opacity-0 */}
                <DropdownMenu projectId={project.id} />
            </div>
            {/* --- END CHANGE --- */}
        </div>


                  <p className="mt-1 text-gray-600 text-sm line-clamp-3 mb-4">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>
                        {project.budget ? `$${project.budget}` : 'N/A'} {project.budgetType === "hourly" ? "/hr" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{project.applicants || 0} applications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Due {project.deadline ? format(new Date(project.deadline), 'MMM dd,yyyy') : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Posted {project.postedDate ? format(new Date(project.postedDate), 'MMM dd,yyyy') : 'N/A'}</span>
                    </div>
                  </div>

                  {project.skills && Array.isArray(project.skills) && project.skills.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label htmlFor={`progress-${project.id}`} className="sr-only">
                    Progress
                  </label>
                  <div
                    id={`progress-${project.id}`}
                    role="progressbar"
                    aria-valuenow={project.progress || 0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="w-full rounded-full bg-gray-200 h-2"
                  >
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 text-right">
                    Progress: {project.progress || 0}%
                  </p>
                </div>

                {project.assignedTo && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={project.assignedTo.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${project.assignedTo.name}&backgroundColor=indigo,blue,purple&backgroundType=gradient&radius=50`}
                        alt={project.assignedTo.name || 'Assigned User'}
                        className="h-10 w-10 rounded-full object-cover mr-3 border border-gray-200"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {project.assignedTo.name}
                        </p>
                        <div className="flex items-center text-yellow-400 text-xs">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.round(project.assignedTo.rating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-gray-600">({(project.assignedTo.rating || 0).toFixed(1)})</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md text-sm hover:bg-indigo-200 transition-colors duration-200">
                        Message
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {isEditModalOpen && (
        <EditProjectModal
          project={projectToEdit}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateProject}
        />
      )}
    </div>
  );
}

export default MyProjects;