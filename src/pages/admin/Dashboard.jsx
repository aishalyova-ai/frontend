import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  BarChart3,
  LayoutDashboard,
  Bell,
  UserCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 300 },
  { name: "Mar", users: 500 },
  { name: "Apr", users: 700 },
  { name: "May", users: 600 },
  { name: "Jun", users: 800 },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      {/* Top Navigation Header */}
      <header className="bg-white shadow px-4 py-3 flex items-center justify-between border-b">
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
      <main className="p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Users</div>
              <div className="text-2xl font-bold">1,200</div>
            </div>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Active Projects</div>
              <div className="text-2xl font-bold">340</div>
            </div>
            <Briefcase className="w-6 h-6 text-green-500" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Exchanges</div>
              <div className="text-2xl font-bold">980</div>
            </div>
            <BarChart3 className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Reports</div>
              <div className="text-2xl font-bold">27</div>
            </div>
            <LayoutDashboard className="w-6 h-6 text-red-500" />
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 px-4">User</th>
                  <th className="py-2 px-4">Activity</th>
                  <th className="py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">John Doe</td>
                  <td className="py-2 px-4">Posted a new project</td>
                  <td className="py-2 px-4">May 28, 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Jane Smith</td>
                  <td className="py-2 px-4">Reported an issue</td>
                  <td className="py-2 px-4">May 27, 2025</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Alice Johnson</td>
                  <td className="py-2 px-4">Completed a swap</td>
                  <td className="py-2 px-4">May 25, 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
