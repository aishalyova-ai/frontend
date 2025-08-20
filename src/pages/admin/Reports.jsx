import React, { useState, useEffect } from "react";
import { AlertCircle, User, FileText, MoreVertical } from "lucide-react";

// Component to display icons based on report type
function ReportTypeIcon({ type }) {
  switch (type) {
    case "spam":
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    case "harassment":
      return <User className="w-5 h-5 text-yellow-600" />;
    case "inappropriate":
      return <FileText className="w-5 h-5 text-purple-600" />;
    default:
      return <FileText className="w-5 h-5 text-gray-600" />;
  }
}

// Component for showing dashboard counts
function DashboardCounts() {
  const [counts, setCounts] = useState({ users: 0, projects: 0, exchanges: 0 });

  useEffect(() => {
    fetch("/api/admin/counts")
      .then((res) => res.json())
      .then((data) => setCounts(data))
      .catch((err) => console.error("Failed to fetch counts:", err));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white shadow rounded p-4 text-center">
        <h3 className="text-gray-500">Users</h3>
        <p className="text-2xl font-bold">{counts.users}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <h3 className="text-gray-500">Projects</h3>
        <p className="text-2xl font-bold">{counts.projects}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <h3 className="text-gray-500">Exchanges</h3>
        <p className="text-2xl font-bold">{counts.exchanges}</p>
      </div>
    </div>
  );
}

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch reports from backend
  useEffect(() => {
    fetch("/api/admin/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Failed to fetch reports:", err));
  }, []);

  const filteredReports = filterStatus === "all" ? reports : reports.filter((r) => r.status === filterStatus);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    investigating: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    dismissed: "bg-gray-100 text-gray-700",
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  function toggleDropdown(id) {
    setOpenDropdownId(openDropdownId === id ? null : id);
  }

  function openModal(report) {
    setSelectedReport(report);
    setModalOpen(true);
    setOpenDropdownId(null);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedReport(null);
  }

  // Update report status locally and optionally send to backend
  function changeReportStatus(id, newStatus) {
    const updatedReports = reports.map((r) =>
      r.id === id ? { ...r, status: newStatus, resolution: newStatus === "resolved" ? "Issue resolved" : "" } : r
    );
    setReports(updatedReports);

    // Send status update to backend
    fetch(`/api/admin/reports/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch((err) => console.error("Failed to update report status:", err));

    setOpenDropdownId(null);
  }

  function updateSelectedReport(field, value) {
    setSelectedReport((prev) => ({ ...prev, [field]: value }));
  }

  function saveAndResolve() {
    if (!selectedReport) return;

    const updatedReports = reports.map((r) => (r.id === selectedReport.id ? selectedReport : r));
    setReports(updatedReports);

    // Send full report update to backend
    fetch(`/api/admin/reports/${selectedReport.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedReport),
    }).catch((err) => console.error("Failed to save report:", err));

    setModalOpen(false);
    setSelectedReport(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Reports</h1>

      {/* Dashboard Counts */}
      <DashboardCounts />

      {/* Filter */}
      <div className="mb-4 flex items-center space-x-4">
        <label htmlFor="filterStatus" className="font-semibold">Filter by status:</label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Reported By</th>
              <th className="py-3 px-4">Reported User</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500 italic">
                  No reports found.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => openModal(report)}>
                  <td className="py-3 px-4 max-w-xs truncate" title={report.title}>
                    <div className="flex items-center space-x-2">
                      <ReportTypeIcon type={report.type} />
                      <span className="font-semibold truncate">{report.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 flex items-center space-x-2">
                    <img src={report.reportedBy.avatar} alt={report.reportedBy.name} className="w-6 h-6 rounded-full" />
                    <span>{report.reportedBy.name}</span>
                  </td>
                  <td className="py-3 px-4 flex items-center space-x-2">
                    <img src={report.reportedUser.avatar} alt={report.reportedUser.name} className="w-6 h-6 rounded-full" />
                    <span>{report.reportedUser.name}</span>
                  </td>
                  <td className="py-3 px-4 capitalize">{report.type}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${statusColors[report.status]}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${priorityColors[report.priority]}`}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{new Date(report.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleDropdown(report.id)} className="p-1 rounded hover:bg-gray-200" aria-label="Actions">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    {openDropdownId === report.id && (
                      <div className="absolute right-2 top-full mt-1 bg-white border rounded shadow-md text-sm z-10 w-36">
                        <button className="block w-full text-left px-3 py-2 hover:bg-indigo-100" onClick={() => changeReportStatus(report.id, "pending")}>Mark Pending</button>
                        <button className="block w-full text-left px-3 py-2 hover:bg-indigo-100" onClick={() => changeReportStatus(report.id, "investigating")}>Mark Investigating</button>
                        <button className="block w-full text-left px-3 py-2 hover:bg-indigo-100" onClick={() => changeReportStatus(report.id, "resolved")}>Mark Resolved</button>
                        <button className="block w-full text-left px-3 py-2 hover:bg-indigo-100" onClick={() => changeReportStatus(report.id, "dismissed")}>Dismiss</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            {/* Modal content (same as before) */}
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 truncate" title={selectedReport.title}>{selectedReport.title}</h2>
              <button onClick={closeModal} aria-label="Close modal" className="text-gray-600 hover:text-gray-900">✕</button>
            </header>
            {/* Add editable fields and evidence here */}
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={closeModal} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">Cancel</button>
              <button onClick={saveAndResolve} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50" disabled={selectedReport.status === "resolved" && selectedReport.resolution?.trim() === ""}>
                Save &amp; Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
