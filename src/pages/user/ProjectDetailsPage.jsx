// src/components/Projects/ProjectDetailsPage.js

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DollarSign, Clock, Users, Briefcase } from "lucide-react";

async function fetchProjectDetails(id) {
  const res = await fetch(`http://localhost:8080/api/public/projects/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch project details");
  }
  return await res.json();
}

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getProject() {
      try {
        setLoading(true);
        const projectData = await fetchProjectDetails(id);
        setProject(projectData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-lg">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg mb-4">Error: {error || "Project not found or is not open."}</p>
        <Link to="/projects" className="text-indigo-600 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {project.title}
          </h1>
          <div className="text-sm font-medium text-indigo-600 mb-6">
            {project.category}
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {project.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span>
                Budget: ${project.budgetMin?.toLocaleString()} - $
                {project.budgetMax?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Timeline: {project.timeline}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span>Skills: {project.skills?.join(", ")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-orange-500" />
              <span>Status: {project.status}</span>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-2">About the Employer</h3>
            <p className="text-gray-600">
              This project was posted by a verified employer.
              <br />
              <Link to="/dashboard/user/projects" className="mt-4 inline-block text-sm text-indigo-600 hover:underline font-medium">
                Back to projects
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}