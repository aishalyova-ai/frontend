import React, { useState } from "react";
import {
  AlertCircle,
  User,
  FileText,
  MoreVertical,
} from "lucide-react";

function ReportTypeIcon({ type }) {
  // Icons for report types
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

export default function AdminReports() {
  // Sample data for reports
  const initialReports = [
    {
      id: "r1",
      title: "Spam messages in chat",
      description: "User is sending unsolicited spam in the general chat.",
      reportedBy: {
        name: "Alice Smith",
        email: "alice@example.com",
        avatar:
          "https://randomuser.me/api/portraits/women/44.jpg",
      },
      reportedUser: {
        name: "SpamBot",
        email: "spambot@example.com",
        avatar:
          "https://randomuser.me/api/portraits/lego/1.jpg",
      },
      type: "spam",
      status: "pending",
      priority: "high",
      date: "2025-05-20",
      assignedTo: "John Admin",
      actionNotes: "",
      evidence: [
        { type: "Chat log", url: "https://example.com/evidence/chatlog1" },
      ],
      reportedContent: {
        title: "Chat conversation #12345",
        link: "https://example.com/chat/12345",
      },
      resolution: "",
    },
    {
      id: "r2",
      title: "Harassment in comments",
      description: "User is harassing others via comments.",
      reportedBy: {
        name: "Bob Johnson",
        email: "bob@example.com",
        avatar:
          "https://randomuser.me/api/portraits/men/32.jpg",
      },
      reportedUser: {
        name: "TrollUser",
        email: "troll@example.com",
        avatar:
          "https://randomuser.me/api/portraits/lego/2.jpg",
      },
      type: "harassment",
      status: "investigating",
      priority: "medium",
      date: "2025-05-21",
      assignedTo: "Sara Admin",
      actionNotes: "",
      evidence: [],
      reportedContent: {
        title: "Comment thread #54321",
        link: "https://example.com/comments/54321",
      },
      resolution: "",
    },
  ];

  const [reports, setReports] = useState(initialReports);
  const [filterStatus, setFilterStatus] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Filter reports by status
  const filteredReports =
    filterStatus === "all"
      ? reports
      : reports.filter((r) => r.status === filterStatus);

  // Status colors for badges
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    investigating: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    dismissed: "bg-gray-100 text-gray-700",
  };

  // Priority colors
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

  function changeReportStatus(id, newStatus) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              resolution: newStatus === "resolved" ? "Issue resolved" : "",
            }
          : r
      )
    );
    setOpenDropdownId(null);
  }

  function updateSelectedReport(field, value) {
    setSelectedReport((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function saveAndResolve() {
    if (!selectedReport) return;
    setReports((prev) =>
      prev.map((r) => (r.id === selectedReport.id ? selectedReport : r))
    );
    setModalOpen(false);
    setSelectedReport(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Reports</h1>

      <div className="mb-4 flex items-center space-x-4">
        <label htmlFor="filterStatus" className="font-semibold">
          Filter by status:
        </label>
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
            {filteredReports.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500 italic">
                  No reports found.
                </td>
              </tr>
            )}
            {filteredReports.map((report) => (
              <tr
                key={report.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => openModal(report)}
              >
                <td
                  className="py-3 px-4 max-w-xs truncate"
                  title={report.title}
                >
                  <div className="flex items-center space-x-2">
                    <ReportTypeIcon type={report.type} />
                    <span className="font-semibold truncate">{report.title}</span>
                  </div>
                </td>
                <td className="py-3 px-4 flex items-center space-x-2">
                  <img
                    src={report.reportedBy.avatar}
                    alt={report.reportedBy.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{report.reportedBy.name}</span>
                </td>
                <td className="py-3 px-4 flex items-center space-x-2">
                  <img
                    src={report.reportedUser.avatar}
                    alt={report.reportedUser.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{report.reportedUser.name}</span>
                </td>
                <td className="py-3 px-4 capitalize">{report.type}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${statusColors[report.status]}`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="py-3 px-4 capitalize">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${priorityColors[report.priority]}`}
                  >
                    {report.priority}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {new Date(report.date).toLocaleDateString()}
                </td>
                <td
                  className="py-3 px-4 text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => toggleDropdown(report.id)}
                    className="p-1 rounded hover:bg-gray-200"
                    aria-label="Actions"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                  {openDropdownId === report.id && (
                    <div className="absolute right-2 top-full mt-1 bg-white border rounded shadow-md text-sm z-10 w-36">
                      <button
                        className="block w-full text-left px-3 py-2 hover:bg-indigo-100"
                        onClick={() => changeReportStatus(report.id, "pending")}
                      >
                        Mark Pending
                      </button>
                      <button
                        className="block w-full text-left px-3 py-2 hover:bg-indigo-100"
                        onClick={() => changeReportStatus(report.id, "investigating")}
                      >
                        Mark Investigating
                      </button>
                      <button
                        className="block w-full text-left px-3 py-2 hover:bg-indigo-100"
                        onClick={() => changeReportStatus(report.id, "resolved")}
                      >
                        Mark Resolved
                      </button>
                      <button
                        className="block w-full text-left px-3 py-2 hover:bg-indigo-100"
                        onClick={() => changeReportStatus(report.id, "dismissed")}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex justify-between items-center mb-4">
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900 truncate"
                title={selectedReport.title}
              >
                {selectedReport.title}
              </h2>
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </header>

            <section className="space-y-4">
              <p className="text-gray-700">{selectedReport.description}</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-1">Reported By</h3>
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedReport.reportedBy.avatar}
                      alt={selectedReport.reportedBy.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{selectedReport.reportedBy.name}</p>
                      <p className="text-sm text-gray-500">{selectedReport.reportedBy.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Reported User</h3>
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedReport.reportedUser.avatar}
                      alt={selectedReport.reportedUser.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{selectedReport.reportedUser.name}</p>
                      <p className="text-sm text-gray-500">{selectedReport.reportedUser.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Report Type</h3>
                  <div className="inline-flex items-center space-x-2 text-indigo-600 capitalize">
                    <ReportTypeIcon type={selectedReport.type} />
                    <span>{selectedReport.type}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Reported Content</h3>
                  <a
                    href={selectedReport.reportedContent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline"
                  >
                    {selectedReport.reportedContent.title}
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Evidence</h3>
                  {selectedReport.evidence.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {selectedReport.evidence.map((ev, i) => (
                        <li key={i}>
                          <a
                            href={ev.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 underline"
                          >
                            {ev.type}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No evidence provided.</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Status</h3>
                  <select
                    value={selectedReport.status}
                    onChange={(e) => updateSelectedReport("status", e.target.value)}
                    className="rounded-md border border-gray-300 py-1 px-2 w-full max-w-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Priority</h3>
                  <select
                    value={selectedReport.priority}
                    onChange={(e) => updateSelectedReport("priority", e.target.value)}
                    className="rounded-md border border-gray-300 py-1 px-2 w-full max-w-xs"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Assigned To</h3>
                  <input
                    type="text"
                    value={selectedReport.assignedTo}
                    onChange={(e) => updateSelectedReport("assignedTo", e.target.value)}
                    className="rounded-md border border-gray-300 py-1 px-2 w-full max-w-xs"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Action Notes</h3>
                <textarea
                  rows={3}
                  value={selectedReport.actionNotes}
                  onChange={(e) => updateSelectedReport("actionNotes", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 resize-none"
                  placeholder="Add notes about your actions..."
                />
              </div>

              <div>
                <h3 className="font-semibold mb-1">Resolution</h3>
                <textarea
                  rows={3}
                  value={selectedReport.resolution}
                  onChange={(e) => updateSelectedReport("resolution", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 resize-none"
                  placeholder="Describe the resolution if resolved..."
                  disabled={selectedReport.status !== "resolved"}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAndResolve}
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  disabled={
                    selectedReport.status === "resolved" && selectedReport.resolution.trim() === ""
                  }
                >
                  Save &amp; Resolve
                </button>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
