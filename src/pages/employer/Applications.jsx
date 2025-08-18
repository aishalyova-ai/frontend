import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, MapPin, X, CheckCircle, Award } from "lucide-react";
import { Link } from "react-router-dom";

// Helper function to determine status badge color
const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "ACCEPTED":
      return "bg-blue-100 text-blue-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "WITHDRAWN":
      return "bg-gray-200 text-gray-600";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Header component
const Header = () => (
  <header className="bg-white shadow-sm border-b mb-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <h1 className="text-2xl font-bold text-indigo-600">SkillSwap Employer</h1>
        <nav className="hidden md:flex space-x-8">
          <Link to="/dashboard/employer" className="text-indigo-600 font-medium">Dashboard</Link>
          <Link to="/dashboard/employer/my-projects" className="text-gray-700 hover:text-indigo-600">Projects</Link>
          <Link to="/dashboard/employer/applications" className="text-gray-700 hover:text-indigo-600">Applications</Link>
          <Link to="/dashboard/employer/payments" className="text-gray-700 hover:text-indigo-600">Payments</Link>
        </nav>
        <Link to="/logout" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-gray-100 text-gray-900 hover:bg-gray-200">Logout</Link>
      </div>
    </div>
  </header>
);

// Single application card (for Pending/Rejected/Withdrawn)
const ApplicationCard = ({ app, onViewDetails, onStatusChange }) => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img src={app.applicantAvatar || "/avatar.svg"} alt="avatar" className="w-12 h-12 rounded-full" />
        <div>
          <h4 className="text-lg font-semibold">
            {app.applicantName} <span className="text-xs text-gray-400">(User ID: {app.applicantId})</span>
          </h4>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {app.applicantLocation || "Remote"}
          </p>
        </div>
      </div>
      <span className={`text-sm px-2 py-1 rounded ${getStatusColor(app.status)}`}>{app.status}</span>
    </div>

    <div className="text-gray-600">
      <p><strong>Project:</strong> {app.projectTitle}</p>
      <p><strong>Budget:</strong> ${app.proposedBudget}</p>
      <p className="line-clamp-2 text-sm"><strong>Cover Letter:</strong> {app.coverLetter}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {Array.isArray(app.skills) && app.skills.map((skill, idx) => (
          <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">{skill}</span>
        ))}
      </div>
    </div>

    <div className="flex flex-wrap gap-3">
      <button onClick={() => onViewDetails(app)} className="text-indigo-600 hover:underline">View Details</button>
      {app.status === "PENDING" && (
        <>
          <button onClick={() => onStatusChange(app.id, "ACCEPTED")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Accept</button>
          <button onClick={() => onStatusChange(app.id, "REJECTED")} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reject</button>
        </>
      )}
    </div>
  </div>
);

// New component for displaying completed projects
const CompletedProjectCard = ({ app }) => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Award className="w-8 h-8 text-yellow-500" />
        <div>
          <h4 className="text-lg font-semibold">
            {app.projectTitle} <span className="text-xs text-gray-400">(ID: {app.projectId})</span>
          </h4>
          <p className="text-sm text-gray-500">
            Completed by: {app.assignedUsername || app.applicantName}
          </p>
        </div>
      </div>
      <span className={`text-sm px-2 py-1 rounded ${getStatusColor("COMPLETED")}`}>Completed</span>
    </div>
    <div className="text-gray-600">
      <p><strong>Budget:</strong> ${app.proposedBudget}</p>
      <p className="mt-2 text-sm">
        <strong>Project Submission:</strong>
        {app.workSubmissionUrl ? (
          <a href={app.workSubmissionUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
            View
          </a>
        ) : (
          <span className="ml-2 text-gray-500">N/A</span>
        )}
      </p>
    </div>
    <Link
      to={`/projects/${app.projectId}`}
      className="text-indigo-600 hover:underline text-sm font-medium"
    >
      View Full Details
    </Link>
  </div>
);

// Modal for application details
const ApplicationDetailsModal = ({ application, onClose, onStatusChange }) => {
  if (!application) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800" onClick={onClose}><X /></button>

        <h3 className="text-xl font-semibold mb-2">
          {application.applicantName} <span className="text-sm text-gray-400">(User ID: {application.applicantId})</span>
        </h3>
        <p className="text-sm mb-4 text-gray-500">{application.applicantLocation}</p>

        <p className="mb-2"><strong>Project:</strong> {application.projectTitle}</p>
        <p className="mb-2"><strong>Budget:</strong> ${application.proposedBudget}</p>
        <p className="mb-2"><strong>Timeline:</strong> {application.proposedTimeline}</p>
        <p className="mb-2"><strong>Cover Letter:</strong><br />{application.coverLetter}</p>
        <p className="mb-2">
          <strong>Answers to Questions:</strong>
          {Array.isArray(application.answersToQuestions) ? (
            <ul className="list-disc list-inside">
              {application.answersToQuestions.map((a, idx) => <li key={idx}>{a}</li>)}
            </ul>
          ) : <p>No answers provided.</p>}
        </p>

        <p className="mb-4">
          <strong>Skills:</strong>{" "}
          {Array.isArray(application.skills) && application.skills.map((s, i) => (
            <span key={i} className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 mr-2 rounded-full text-xs">{s}</span>
          ))}
        </p>

        <div className="flex flex-wrap gap-3">
          {application.status === "PENDING" && (
            <>
              <button onClick={() => onStatusChange(application.id, "ACCEPTED")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Accept</button>
              <button onClick={() => onStatusChange(application.id, "REJECTED")} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reject</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Employer Applications Page
const EmployerApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const token = localStorage.getItem("jwtToken");

  // Fetch all applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/applications/employer", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Debugging line to see the API response
        console.log("API response data:", res.data);

        // The API returns a flat list of applications, we'll map them for easier access
        const mappedApps = res.data.map(app => ({
          ...app,
          // Safely access nested properties using optional chaining
          applicantName: `${app.applicant?.firstName || ''} ${app.applicant?.lastName || ''}`,
          applicantAvatar: app.applicant?.avatarUrl,
          applicantLocation: app.applicant?.location,
          applicantId: app.applicant?.id,
          projectTitle: app.project?.title,
          projectId: app.project?.id,
          workSubmissionUrl: app.workSubmissionUrl || "",
          skills: app.skillsOffered,
        }));

        setApplications(mappedApps);
      } catch (error) {
        console.error("Failed to load applications", error);
      }
    };

    if (token) {
      fetchApplications();
    }
  }, [token]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/api/applications/${applicationId}/status?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Re-fetch applications to update the UI after a successful status change
      const res = await axios.get("http://localhost:8080/api/applications/employer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedApps = res.data.map(app => ({
        ...app,
        applicantName: `${app.applicant?.firstName || ''} ${app.applicant?.lastName || ''}`,
        applicantAvatar: app.applicant?.avatarUrl,
        applicantLocation: app.applicant?.location,
        applicantId: app.applicant?.id,
        projectTitle: app.project?.title,
        projectId: app.project?.id,
        workSubmissionUrl: app.workSubmissionUrl || "",
        skills: app.skillsOffered,
      }));
      setApplications(updatedApps);
      setSelectedApplication(null);
    } catch (err) {
      console.error("Failed to update application status", err);
    }
  };

  // Filter applications for the "Completed Projects" section
  const completedProjects = applications.filter(app => app.status === "COMPLETED");

  // Get all applications that are not completed or assigned for the "Other Applications" section
  const otherApplications = applications.filter(app => app.status !== "COMPLETED" && app.status !== "ASSIGNED" && app.status !== "ACCEPTED");

  // Apply filters to the applications list
  const filteredApplications = otherApplications.filter(app => {
    const matchesSearch =
      (app.applicantName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.projectTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(app.skills) && app.skills.some(skill =>
        (skill || "").toLowerCase().includes(searchQuery.toLowerCase())
      ));

    const matchesProject = projectFilter === "all" || app.projectTitle === projectFilter;
    const matchesStatus = statusFilter === "all" || (app.status || "").toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesProject && matchesStatus;
  });

  // Get unique project titles for the filter dropdown
  const uniqueProjectTitles = [...new Set(applications.map(app => app.projectTitle))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header />
      <h1 className="text-2xl font-bold mb-4">Employer Applications</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border rounded"
            placeholder="Search applicants or skills"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="border px-3 py-2 rounded">
          <option value="all">All Projects</option>
          {uniqueProjectTitles.map((proj, idx) => <option key={idx} value={proj}>{proj}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border px-3 py-2 rounded">
          <option value="all">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>
      </div>

      {/* New section for completed projects */}
      <h2 className="text-xl font-semibold mb-3 mt-8">Completed Projects</h2>
      <div className="grid gap-6 mb-6">
        {completedProjects.length > 0 ? (
          completedProjects.map(app => (
            <CompletedProjectCard key={app.id} app={app} />
          ))
        ) : (
          <p className="text-gray-500">No completed projects found.</p>
        )}
      </div>

      {/* Existing section for other applications */}
      <h2 className="text-xl font-semibold mb-3 mt-8">Other Applications ({statusFilter === 'all' ? 'All' : statusFilter})</h2>
      <div className="grid gap-6">
        {filteredApplications.length === 0 ? (
          <p className="text-gray-500">No applications found with the selected filters.</p>
        ) : (
          filteredApplications.map(app => (
            <ApplicationCard
              key={app.id}
              app={app}
              onViewDetails={setSelectedApplication}
              onStatusChange={updateStatus}
            />
          ))
        )}
      </div>

      <ApplicationDetailsModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onStatusChange={updateStatus}
      />
    </div>
  );
};

export default EmployerApplicationsPage;
