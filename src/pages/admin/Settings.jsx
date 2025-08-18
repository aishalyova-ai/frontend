import React, { useState } from "react";
import {Link} from 'react-router-dom'
import {
  
  Bell,
  Save,
  Upload,
  Download,
  RefreshCw,
  Trash2,
  UserCircle
} from "lucide-react";

const tabs = [
  "General",
  "Platform",
  "Payments",
  "Notifications",
  "Security",
  "Integrations",
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("General");
  const [saving, setSaving] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showCacheDialog, setShowCacheDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div className="space-y-4">
            <Input label="Site Name" placeholder="SkillSwap Platform" />
            <Input label="Site URL" placeholder="https://skillswap.com" />
            <TextArea label="Site Description" placeholder="Connect, learn, and exchange skills..." />
            <Input label="Admin Email" type="email" placeholder="admin@skillswap.com" />
            <Input label="Support Email" type="email" placeholder="support@skillswap.com" />
            <Select label="Timezone" options={["UTC", "Eastern Time", "Pacific Time", "GMT"]} />
            <Select label="Default Language" options={["English", "Spanish", "French", "German"]} />
            <Toggle label="Maintenance Mode" />
          </div>
        );
      case "Platform":
        return (
          <div className="space-y-4">
            <Toggle label="Allow User Registration" />
            <Toggle label="Allow Employer Registration" />
            <Toggle label="Require Skill Verification" />
            <Toggle label="Auto-approve Projects" />
            <Input label="Featured Projects Limit" type="number" />
            <Input label="Max Skills per User" type="number" />
            <Input label="Min Project Budget ($)" type="number" />
            <Input label="Max Project Budget ($)" type="number" />
            <Input label="Max Project Duration (days)" type="number" />
          </div>
        );
      case "Payments":
        return (
          <div className="space-y-4">
            <Input label="Platform Fee (%)" type="number" />
            <Input label="Minimum Payout ($)" type="number" />
            <Select label="Default Currency" options={["USD", "EUR", "GBP", "CAD"]} />
            <Select label="Payout Schedule" options={["Daily", "Weekly", "Monthly"]} />
            <Input label="Refund Policy (days)" type="number" />
            <Toggle label="Enable Payment Processing" />
            <Toggle label="Enable Escrow" />
            <Toggle label="Tax Reporting" />
          </div>
        );
      case "Notifications":
        return (
          <div className="space-y-4">
            <Toggle label="Email Notifications" />
            <Toggle label="Push Notifications" />
            <Toggle label="SMS Notifications" />
            <Toggle label="Marketing Emails" />
            <Toggle label="System Alerts" />
            <Toggle label="Report Notifications" />
            <Toggle label="Payment Notifications" />
          </div>
        );
      case "Security":
        return (
          <div className="space-y-4">
            <Toggle label="Require Two-Factor Authentication" />
            <Toggle label="Password Complexity Requirements" />
            <Toggle label="Rate Limiting" />
            <Toggle label="Content Moderation" />
            <Toggle label="Spam Detection" />
            <Input label="Session Timeout (minutes)" type="number" />
            <Input label="IP Whitelist (comma-separated)" placeholder="192.168.1.1, 10.0.0.1" />
          </div>
        );
      case "Integrations":
        return (
          <div className="space-y-4">
            <Input label="Google Analytics Tracking ID" placeholder="GA-XXXXXXXXX" />
            <Input label="Stripe Publishable Key" placeholder="pk_test_..." />
            <Input label="PayPal Client ID" placeholder="AXX..." />
            <Input label="Twilio Account SID" placeholder="ACX..." />
            <Input label="SendGrid API Key" placeholder="SG..." />
            <Input label="Cloudinary Cloud Name" placeholder="skillswap" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white flex items-center justify-between px-6 h-14 shadow-md z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold">SkillSwap Admin</h1>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              to="/dashboard/admin"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard/admin/users"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Users
            </Link>
            <Link
              to="/dashboard/admin/projects"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Projects
            </Link>
            <Link
              to="/dashboard/admin/reports"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Reports
            </Link>
            <Link
              to="/dashboard/admin/settings"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-gray-600" />
          <UserCircle className="w-8 h-8 text-gray-600" />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-1">Platform Settings</h2>
        <p className="text-gray-600 mb-6">Configure and manage platform settings</p>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-300 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-600 hover:text-purple-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-lg shadow">{renderTabContent()}</div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-10">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
          <button
            onClick={() => setShowBackupDialog(true)}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
          >
            <Upload className="w-4 h-4" />
            Backup Data
          </button>
          <button
            onClick={() => setShowRestoreDialog(true)}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
          >
            <Download className="w-4 h-4" />
            Restore Data
          </button>
          <button
            onClick={() => setShowCacheDialog(true)}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4" />
            Clear Cache
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Delete All Data
          </button>
        </div>

        {/* Dialogs */}
        {showBackupDialog && (
          <Dialog
            title="Confirm Data Backup"
            description="Are you sure you want to initiate a full data backup? This process may take a while."
            confirmText="Backup Data"
            onClose={() => setShowBackupDialog(false)}
            onConfirm={() => setShowBackupDialog(false)}
          />
        )}
        {showRestoreDialog && (
          <Dialog
            title="Confirm Data Restore"
            description="Restoring data will overwrite current data. Are you sure you want to proceed? This action cannot be undone."
            confirmText="Restore Data"
            onClose={() => setShowRestoreDialog(false)}
            onConfirm={() => setShowRestoreDialog(false)}
          />
        )}
        {showCacheDialog && (
          <Dialog
            title="Confirm Cache Clear"
            description="Clearing the cache will remove temporary data and may improve performance. Are you sure?"
            confirmText="Clear Cache"
            onClose={() => setShowCacheDialog(false)}
            onConfirm={() => setShowCacheDialog(false)}
          />
        )}
        {showDeleteDialog && (
          <Dialog
            title="Confirm Data Deletion"
            description="This action is irreversible and will permanently delete all platform data. Type 'DELETE' to confirm."
            confirmText="Delete All Data"
            confirmColor="red"
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={() => {
              if (deleteConfirm === "DELETE") {
                setShowDeleteDialog(false);
                setDeleteConfirm("");
              }
            }}
            inputField
            inputValue={deleteConfirm}
            onInputChange={setDeleteConfirm}
          />
        )}
      </main>
    </div>
  );
}

// Reusable Components

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-purple-300"
      {...props}
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      rows="3"
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-purple-300"
      {...props}
    ></textarea>
  </div>
);

const Select = ({ label, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-purple-300">
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const Toggle = ({ label }) => {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-gray-700">{label}</label>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-10 h-5 flex items-center rounded-full px-1 transition-colors ${
          enabled ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
};

const Dialog = ({
  title,
  description,
  confirmText,
  confirmColor = "purple",
  onClose,
  onConfirm,
  inputField,
  inputValue,
  onInputChange,
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-700 mb-4">{description}</p>
      {inputField && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-full mb-4 border px-3 py-2 rounded text-sm"
          placeholder='Type "DELETE" to confirm'
        />
      )}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm rounded border border-gray-300">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 text-sm text-white rounded ${
            confirmColor === "red" ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);
