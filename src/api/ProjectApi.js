// src/api/ProjectApi.jsx
import axios from "axios";

const API_BASE = "http://localhost:8080/api/projects";

export async function fetchAllProjects() {
  const response = await axios.get(API_BASE);
  return response.data;
}

export async function fetchProjectById(projectId) {
  const response = await axios.get(`${API_BASE}/${projectId}`);
  return response.data;
}

export async function fetchProjectsByStatus(status) {
  const response = await axios.get(`${API_BASE}/status/${status}`);
  return response.data;
}

export async function fetchProjectsByEmployerAndStatus(username, status) {
  // Example: GET /api/projects/employer/{username}?status={status}
  const response = await axios.get(`${API_BASE}/employer/${username}`, {
    params: { status },
  });
  return response.data;
}

export async function createProject(projectRequest, postedByUsername) {
  const response = await axios.post(
    `${API_BASE}/create?postedByUsername=${postedByUsername}`,
    projectRequest
  );
  return response.data;
}

export async function updateProject(projectId, projectRequest, currentUsername) {
  const response = await axios.put(
    `${API_BASE}/update/${projectId}?currentUsername=${currentUsername}`,
    projectRequest
  );
  return response.data;
}

export async function deleteProject(projectId) {
  const response = await axios.delete(`${API_BASE}/delete/${projectId}`);
  return response.data;
}
