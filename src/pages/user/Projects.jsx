import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  File,
  UploadCloud,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ApplyProjectForm from "./ApplyProjectForm";

// --- API helpers ---
async function fetchPublicProjects() {
    const res = await fetch("http://localhost:8080/api/public/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
    return await res.json();
}

// --- API helper ---
async function fetchMyAssignedProjects(role, token) {
  if (!token) return [];

  const endpoint =
    role === "ROLE_INDIVIDUAL"
      ? `http://localhost:8080/api/individual/projects/assigned`
      : `http://localhost:8080/api/employer/projects/my-assigned`;

  const res = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to fetch assigned projects: ${res.status} - ${errorBody}`);
  }

  let projects = await res.json();

  // Sort so COMPLETED projects appear first
  projects.sort((a, b) => {
    if (a.status === "COMPLETED" && b.status !== "COMPLETED") return -1;
    if (a.status !== "COMPLETED" && b.status === "COMPLETED") return 1;
    return 0;
  });

  console.log("Fetched assigned projects:", projects); // <-- log here
  return projects;
}



async function fetchMyApplications(token) {
    if (!token) return [];
    const res = await fetch("http://localhost:8080/api/applications/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Failed to fetch applications: ${res.status} - ${errorBody}`);
    }
    return await res.json();
}

async function submitProjectWork(projectId, progressValue, file, token, status) {
  if (!token) throw new Error("Unauthorized");
  const formData = new FormData();
  if (progressValue !== undefined) {
    formData.append("progress", progressValue);
  }
  if (status) {
    formData.append("status", status);
  }
  if (file) {
    formData.append("file", file);
  }
  const res = await fetch(`http://localhost:8080/api/individual/projects/${projectId}/submit-work`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to submit project work: ${res.status} - ${errorBody}`);
  }
  return await res.json();
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("browseProjects");
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [isBudgetSelectOpen, setIsBudgetSelectOpen] = useState(false);
  const [isDurationSelectOpen, setIsDurationSelectOpen] = useState(false);
  const categorySelectRef = useRef(null);
  const budgetSelectRef = useRef(null);
  const durationSelectRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myAssignedProjects, setMyAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressInputs, setProgressInputs] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const { token, user } = useAuth();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedProjectForApply, setSelectedProjectForApply] = useState(null);

  const categories = [
    "Web Development",
    "Graphic Design",
    "UI/UX Design",
    "Digital Marketing",
    "Data Science",
    "Video Production",
    "Writing",
    "Translation",
  ];
  const budgetRanges = [
    "Under $500",
    "$500 - $1,000",
    "$1,000 - $5,000",
    "$5,000 - $10,000",
    "Over $10,000",
  ];
  const durations = [
    "Less than 1 week",
    "1-4 weeks",
    "1-3 months",
    "3-6 months",
    "More than 6 months",
  ];

  useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const publicProjects = await fetchPublicProjects();
      setProjects(publicProjects);

      if (token && user?.roles?.length > 0) {
        const assigned = await fetchMyAssignedProjects(user.roles[0], token);
        setMyAssignedProjects(Array.isArray(assigned) ? assigned : []);

        // Initialize progress inputs
        const initialProgress = {};
        assigned.forEach(project => {
          initialProgress[project.id] = project.progress ?? 0;
        });
        setProgressInputs(initialProgress);

        const applications = await fetchMyApplications(token);
        setMyApplications(Array.isArray(applications) ? applications : []);
      } else {
        setMyAssignedProjects([]);
        setMyApplications([]);
      }
    } catch (err) {
      setError("Failed to load data. Please try again later.");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [token, user?.roles, user?.id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categorySelectRef.current && !categorySelectRef.current.contains(event.target)) {
        setIsCategorySelectOpen(false);
      }
      if (budgetSelectRef.current && !budgetSelectRef.current.contains(event.target)) {
        setIsBudgetSelectOpen(false);
      }
      if (durationSelectRef.current && !durationSelectRef.current.contains(event.target)) {
        setIsDurationSelectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleStatusChange(projectId, newStatus) {
    setMyAssignedProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, status: newStatus } : p
      )
    );
  }

  async function handleUpdateProjectDetails(projectId, progressValue = null) {
    const actualProgress = progressValue !== null ? progressValue : progressInputs[projectId];
    const file = selectedFiles[projectId];
    const status = document.getElementById(`status-${projectId}`)?.value;
    if (actualProgress === undefined || actualProgress < 0 || actualProgress > 100) {
      alert("Please enter a valid progress percentage between 0 and 100.");
      return;
    }
    try {
      const updatedProject = await submitProjectWork(projectId, actualProgress, file, token, status);
      setMyAssignedProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, progress: actualProgress, status: updatedProject.status }
            : p
        )
      );
      setSelectedFiles(prev => {
        const newState = { ...prev };
        delete newState[projectId];
        return newState;
      });
      alert(`Project ${status === "Completed" ? "marked as completed!" : `progress updated to ${actualProgress}%!`}`);
      if (file) {
        alert("Work file submitted successfully!");
      }
    } catch (error) {
      alert(`Failed to update project details: ${error.message}`);
      console.error("Error updating project:", error);
    }
  }

  function handleProgressInputChange(projectId, value) {
    setProgressInputs(prev => ({
      ...prev,
      [projectId]: Number(value)
    }));
  }

  function handleFileChange(projectId, event) {
    setSelectedFiles(prev => ({
      ...prev,
      [projectId]: event.target.files[0]
    }));
  }

  function openApplyForm(project) {
    setSelectedProjectForApply(project);
    setShowApplyForm(true);
  }

  async function handleApplySuccess() {
    setShowApplyForm(false);
    setSelectedProjectForApply(null);
    if (token) {
      try {
        const applications = await fetchMyApplications(token);
        setMyApplications(Array.isArray(applications) ? applications : []);
      } catch (err) {
        console.error("Failed to refresh applications after success:", err);
      }
    }
  }
async function handleTabChange(tab) {
  setActiveTab(tab);
  if (token && user?.roles?.length > 0) {
    try {
      if (tab === "myAssignedProjects") {
        let assigned = await fetchMyAssignedProjects(user.roles[0], token);

        // Ensure COMPLETED projects appear first
        assigned.sort((a, b) => {
          if (a.status === "COMPLETED" && b.status !== "COMPLETED") return -1;
          if (a.status !== "COMPLETED" && b.status === "COMPLETED") return 1;
          return 0;
        });

        setMyAssignedProjects(Array.isArray(assigned) ? assigned : []);

        const initialProgress = {};
        assigned.forEach(project => {
          initialProgress[project.id] = project.progress ?? 0;
        });
        setProgressInputs(initialProgress);

      } else if (tab === "myApplications") {
        const applications = await fetchMyApplications(token);
        setMyApplications(Array.isArray(applications) ? applications : []);
      }
    } catch (err) {
      console.error(`Failed to reload data for ${tab} tab:`, err);
    }
  }
}


  function filterByDuration(project, filter) {
    if (filter === "all") return true;
    if (!project.duration) return false;
    return project.duration.toLowerCase().includes(filter.toLowerCase());
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.skills &&
        project.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
    const matchesBudget =
      budgetFilter === "all" ||
      (budgetFilter === "Under $500" && project.budgetMax <= 500) ||
      (budgetFilter === "$500 - $1,000" &&
        project.budgetMin >= 500 &&
        project.budgetMax <= 1000) ||
      (budgetFilter === "$1,000 - $5,000" &&
        project.budgetMin >= 1000 &&
        project.budgetMax <= 5000) ||
      (budgetFilter === "$5,000 - $10,000" &&
        project.budgetMin >= 5000 &&
        project.budgetMax <= 10000) ||
      (budgetFilter === "Over $10,000" && project.budgetMin >= 10000);
    const matchesDuration = filterByDuration(project, durationFilter);
    return matchesSearch && matchesCategory && matchesBudget && matchesDuration;
  });

  const CustomSelect = ({
    value,
    onValueChange,
    options,
    placeholder,
    selectRef,
    isOpen,
    setIsOpen,
  }) => (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {value === "all"
            ? placeholder
            : options.find((opt) => opt.value === value)?.label || value}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 opacity-50 ml-2"
        >
          <path d="M6 9l6 6 6-6"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-10 min-w-[12rem] md:min-w-[8rem] overflow-hidden rounded-md border bg-white text-gray-950 shadow-md p-1">
          <div
            className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 ${
              value === "all" ? "bg-gray-100 font-semibold" : ""
            }`}
            onClick={() => {
              onValueChange("all");
              setIsOpen(false);
            }}
          >
            {value === "all" && (
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-indigo-600">
                <CheckCircle className="h-4 w-4" />
              </span>
            )}
            {placeholder}
          </div>
          {options.map((option) => (
            <div
              key={option.value}
              className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 ${
                value === option.value ? "bg-gray-100 font-semibold" : ""
              }`}
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
            >
              {value === option.value && (
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-indigo-600">
                  <CheckCircle className="h-4 w-4" />
                </span>
              )}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-lg">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-indigo-600">SkillSwap</h1>
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-700 hover:text-indigo-600">
                  Home
                </Link>
                <Link
                  to="/dashboard/user/browse-skills"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Browse Skills
                </Link>
                <Link to="/projects" className="text-indigo-600 font-medium">
                  Projects
                </Link>
                <Link
                  to="/dashboard/user/profile"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard/user/user-applications"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  My Applications
                </Link>
              </nav>
              
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Projects & Your Engagements
            </h2>
            <p className="text-gray-600">
              Discover exciting project opportunities or manage your ongoing work
            </p>
          </div>
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => handleTabChange("browseProjects")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "browseProjects"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Browse Projects
            </button>
            <button
              onClick={() => handleTabChange("myApplications")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "myApplications"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              My Applications ({myApplications.length})
            </button>
            <button
              onClick={() => handleTabChange("myAssignedProjects")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "myAssignedProjects"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              My Assigned Projects ({myAssignedProjects.length})
            </button>
          </div>
          {activeTab === "browseProjects" && (
            <>
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <CustomSelect
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                    options={categories.map((cat) => ({ value: cat, label: cat }))}
                    placeholder="All Categories"
                    selectRef={categorySelectRef}
                    isOpen={isCategorySelectOpen}
                    setIsOpen={setIsCategorySelectOpen}
                  />
                  <CustomSelect
                    value={budgetFilter}
                    onValueChange={setBudgetFilter}
                    options={budgetRanges.map((range) => ({ value: range, label: range }))}
                    placeholder="Any Budget"
                    selectRef={budgetSelectRef}
                    isOpen={isBudgetSelectOpen}
                    setIsOpen={setIsBudgetSelectOpen}
                  />
                  <CustomSelect
                    value={durationFilter}
                    onValueChange={setDurationFilter}
                    options={durations.map((dur) => ({ value: dur, label: dur }))}
                    placeholder="Any Duration"
                    selectRef={durationSelectRef}
                    isOpen={isDurationSelectOpen}
                    setIsOpen={setIsDurationSelectOpen}
                  />
                </div>
              </div>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredProjects.length} project
                  {filteredProjects.length !== 1 ? "s" : ""}
                </p>
              </div>
              {filteredProjects.length === 0 ? (
                <p className="text-center text-gray-500">
                  No projects found matching your criteria.
                </p>
              ) : (
                <div className="overflow-x-auto pb-4">
                  <div className="flex space-x-4">
                    {filteredProjects.map((project) => {
                      const hasApplied = Array.isArray(myApplications) && myApplications.some(
                        (app) => app.projectId === project.id
                      );
                      const isAssigned = Array.isArray(myAssignedProjects) && myAssignedProjects.some((p) => p.id === project.id);
                      const isOpen = project.status?.toLowerCase() === "open";

                      console.log({
                        projectId: project.id,
                        hasApplied,
                        isAssigned,
                        isOpen,
                        myApplications,
                        myAssignedProjects,
                      });

                      return (
                        <div
                          key={project.id}
                          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm min-w-[350px]"
                        >
                          <h3 className="mb-2 text-lg font-semibold text-gray-900">
                            {project.title}
                          </h3>
                          <p className="mb-1 text-sm text-gray-700">{project.description}</p>
                          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>
                                {project.budgetMin && project.budgetMax
                                  ? `$${project.budgetMin.toLocaleString()} - $${project.budgetMax.toLocaleString()}`
                                  : "Budget not specified"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{project.timeline || "Timeline not specified"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{project.skills?.join(", ") || "No skills listed"}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <Link
                              to={`/projects/${project.id}`}
                              className="text-indigo-600 hover:underline text-sm font-medium"
                            >
                              View Details
                            </Link>
                            <button
  onClick={() => openApplyForm(project)}
  disabled={hasApplied || isAssigned || !isOpen}
  className={`rounded px-3 py-1.5 text-sm font-semibold text-white ${
    hasApplied || isAssigned || !isOpen
      ? "cursor-not-allowed bg-gray-400"
      : "bg-indigo-600 hover:bg-indigo-700"
  }`}
>
  {!isOpen
    ? "Closed"
    : hasApplied
    ? "Applied"
    : isAssigned
    ? "Assigned to You"
    : "Apply Now"}
</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
          {activeTab === "myApplications" && (
            <div>
              {myApplications.length === 0 ? (
                <p className="text-center text-gray-500">
                  You have not applied to any projects yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {myApplications.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {app.projectTitle}
                      </h3>
                      <p className="text-sm text-gray-700 mb-2">Status: {app.status}</p>
                      <p className="text-sm text-gray-700">
                        Proposed Budget: ${app.proposedBudget?.toLocaleString() || "N/A"}
                      </p>
                      <p className="text-sm text-gray-700">
                        Proposed Timeline: {app.proposedTimeline || "N/A"}
                      </p>
                      <Link
                        to={`/projects/${app.projectId}`}
                        className="text-indigo-600 hover:underline text-sm font-medium"
                      >
                        View Project Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "myAssignedProjects" && (
            <div>
              {myAssignedProjects.length === 0 ? (
                <p className="text-center text-gray-500">You have no assigned projects.</p>
              ) : (
                <div className="overflow-x-auto pb-4">
                  <div className="flex space-x-4">
                    {myAssignedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm min-w-[350px]"
                      >
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">
                          {project.title}
                        </h3>
                        <p className="mb-1 text-sm text-gray-700">{project.description}</p>
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>
                              {project.budgetMin && project.budgetMax
                                ? `$${project.budgetMin.toLocaleString()} - $${project.budgetMax.toLocaleString()}`
                                : "Budget not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{project.timeline || "Timeline not specified"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{project.skills?.join(", ") || "No skills listed"}</span>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label htmlFor={`status-${project.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            id={`status-${project.id}`}
                            value={project.status}
                            onChange={(e) => handleStatusChange(project.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="Open">Open</option>
                            <option value="Started">Started</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 mb-1">
                            Progress: <span className="font-medium">{progressInputs[project.id] ?? project.progress ?? 0}%</span>
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor={`progress-${project.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Update Progress (%)
                            </label>
                            <input
                              type="number"
                              id={`progress-${project.id}`}
                              min="0"
                              max="100"
                              value={progressInputs[project.id] ?? project.progress ?? 0}
                              onChange={(e) => handleProgressInputChange(project.id, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Progress %"
                            />
                          </div>
                          <div>
                            <label htmlFor={`file-${project.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Attach Work File
                            </label>
                            <label htmlFor={`file-${project.id}`} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-indigo-600">
                              <UploadCloud className="h-4 w-4" />
                              <span>Choose a file</span>
                              <input
                                id={`file-${project.id}`}
                                type="file"
                                onChange={(e) => handleFileChange(project.id, e)}
                                className="hidden"
                              />
                            </label>
                            {selectedFiles[project.id] && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <File className="h-3 w-3" />
                                {selectedFiles[project.id].name}
                              </p>
                            )}
                            {project.workSubmissionUrl && (
                              <p className="text-xs text-gray-500 mt-1">
                                Last submitted:{" "}
                                <a
                                  href={project.workSubmissionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:underline"
                                >
                                  View File
                                </a>
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateProjectDetails(project.id)}
                              className="flex-1 rounded bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700 text-sm font-medium"
                            >
                              Update Progress
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      {showApplyForm && selectedProjectForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full overflow-auto max-h-[90vh] relative">
            <button
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-900 text-2xl leading-none"
              onClick={() => setShowApplyForm(false)}
              aria-label="Close apply form"
            >
              &times;
            </button>
            <ApplyProjectForm
              projectId={selectedProjectForApply.id}
              employerId={selectedProjectForApply.employerId || selectedProjectForApply.postedBy?.id}
              questions={selectedProjectForApply.screeningQuestionsList || []}
              onSuccess={handleApplySuccess}
            />
          </div>
        </div>
      )}
    </>
  );
}
