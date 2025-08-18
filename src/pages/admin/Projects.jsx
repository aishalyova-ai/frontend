import React, { useState, useMemo } from "react";
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
} from "lucide-react";

const sampleProjects = [
  {
    id: 1,
    title: "Website Redesign",
    category: "Design",
    skills: ["UI/UX", "Photoshop", "Figma"],
    featured: true,
    reports: 2,
    employer: {
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    budget: 4500,
    deadline: "2025-07-15",
    status: "active",
    applicants: 12,
    priority: "high",
  },
  {
    id: 2,
    title: "Mobile App Development",
    category: "Development",
    skills: ["React Native", "JavaScript"],
    featured: false,
    reports: 0,
    employer: {
      name: "Bob Smith",
      email: "bob@example.com",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    budget: 9000,
    deadline: "2025-08-30",
    status: "pending",
    applicants: 8,
    priority: "medium",
  },
  {
    id: 3,
    title: "SEO Optimization",
    category: "Marketing",
    skills: ["SEO", "Google Analytics", "Content Writing"],
    featured: false,
    reports: 1,
    employer: {
      name: "Charlie Lee",
      email: "charlie@example.com",
      avatar: "",
    },
    budget: 3200,
    deadline: "2025-06-10",
    status: "disputed",
    applicants: 5,
    priority: "low",
  },
  {
    id: 4,
    title: "E-commerce Backend",
    category: "Development",
    skills: ["Node.js", "MongoDB"],
    featured: false,
    reports: 0,
    employer: {
      name: "Dana White",
      email: "dana@example.com",
      avatar: "https://i.pravatar.cc/40?img=4",
    },
    budget: 12000,
    deadline: "2025-09-01",
    status: "completed",
    applicants: 15,
    priority: "high",
  },
  {
    id: 5,
    title: "Logo Design",
    category: "Design",
    skills: ["Illustrator", "Branding"],
    featured: true,
    reports: 0,
    employer: {
      name: "Eve Black",
      email: "eve@example.com",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
    budget: 800,
    deadline: "2025-06-20",
    status: "suspended",
    applicants: 3,
    priority: "medium",
  },
];

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

const statusOptions = [
  "All Status",
  "Active",
  "Completed",
  "Pending",
  "Disputed",
  "Suspended",
];

function AdminProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [modalProject, setModalProject] = useState(null);
  const [projects, setProjects] = useState(sampleProjects);

  // Stats calculation
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const disputedProjects = projects.filter((p) => p.status === "disputed").length;

  // Filtered & searched projects
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

  // Update project status (and optionally featured)
  const updateProject = (id, changes) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
    );
  };

  // Modal save handler
  const saveModalChanges = () => {
    if (!modalProject) return;
    updateProject(modalProject.id, { status: modalProject.status });
    setModalProject(null);
  };

  // Delete project
  const deleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (modalProject?.id === id) setModalProject(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-indigo-700">SkillSwap Admin</h1>
          </div>
          <nav className="flex space-x-6 text-gray-700 font-semibold">
            <a
              href="/admin/dashboard"
              className="hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/admin/users"
              className="hover:text-indigo-600 transition-colors"
            >
              Users
            </a>
            <a
              href="/admin/projects"
              className="text-indigo-600 border-b-2 border-indigo-600 pb-1"
            >
              Projects
            </a>
            <a
              href="/admin/reports"
              className="hover:text-indigo-600 transition-colors"
            >
              Reports
            </a>
            <a
              href="/admin/settings"
              className="hover:text-indigo-600 transition-colors"
            >
              Settings
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="relative">
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
                <circle cx={12} cy={8} r={3} />
              </svg>
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full" />
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
              {filteredProjects.map((project) => (
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
                  deleteProject={() => deleteProject(project.id)}
                />
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* Modal */}
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
    </div>
  );
}

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

function ProjectRow({ project, openModal, toggleFeatured, suspendProject, deleteProject }) {
  return (
    <tr className="hover:bg-gray-50 cursor-pointer">
      {/* Project & featured */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div>
            <p className="text-indigo-700 font-semibold">{project.title}</p>
            <p className="text-gray-500 text-xs">{project.category}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {project.featured && (
            <span
              title="Featured Project"
              className="ml-2 px-2 py-0.5 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded"
            >
              Featured
            </span>
          )}
        </div>
      </td>

      {/* Employer */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          {project.employer.avatar ? (
            <img
              src={project.employer.avatar}
              alt={project.employer.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-white font-semibold uppercase">
              {project.employer.name[0]}
            </div>
          )}
          <div>
            <p className="text-gray-900 font-medium">{project.employer.name}</p>
            <p className="text-gray-500 text-xs">{project.employer.email}</p>
          </div>
        </div>
      </td>

      {/* Budget */}
      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
        ${project.budget.toLocaleString()}
      </td>

      {/* Deadline */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-1 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{project.deadline}</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            statusColors[project.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </td>

      {/* Applicants */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center space-x-1">
          <Users className="w-4 h-4 text-gray-600" />
          <span>{project.applicants}</span>
        </div>
      </td>

      {/* Priority */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            priorityColors[project.priority] || "bg-gray-100 text-gray-800"
          }`}
        >
          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
        <button
          title="View / Edit"
          onClick={openModal}
          className="p-1 rounded hover:bg-indigo-100 text-indigo-600"
          aria-label={`View details for ${project.title}`}
          type="button"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
        <button
          title={project.featured ? "Unfeature" : "Feature"}
          onClick={toggleFeatured}
          className={`p-1 rounded hover:bg-yellow-100 ${
            project.featured ? "text-yellow-600" : "text-gray-400"
          }`}
          aria-label={`${project.featured ? "Remove" : "Add"} featured status`}
          type="button"
        >
          <Star className="w-5 h-5" />
        </button>
        <button
          title="Suspend Project"
          onClick={suspendProject}
          className="p-1 rounded hover:bg-gray-100 text-gray-600"
          aria-label={`Suspend project ${project.title}`}
          type="button"
        >
          <PauseCircle className="w-5 h-5" />
        </button>
        <button
          title="Delete Project"
          onClick={deleteProject}
          className="p-1 rounded hover:bg-red-100 text-red-600"
          aria-label={`Delete project ${project.title}`}
          type="button"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg relative">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <XCircle className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
}

export default AdminProjectsPage;
