// src/api/ApplicationApi.jsx
import axios from "axios";

const API_BASE = "http://localhost:8080/api/applications";

/**
 * Submit a new application
 * @param {object} applicationRequest - The application data (applicantId, projectId, coverLetter, etc.)
 * @returns {Promise<object>} The saved application response DTO
 */
export async function submitApplication(applicationRequest) {
  const response = await axios.post(`${API_BASE}/submit`, applicationRequest);
  return response.data;
}

/**
 * Get all applications for an employer (projects posted by employer)
 * @param {string} employerUsername - username of employer
 * @returns {Promise<Array>} List of ApplicationResponse DTOs
 */
export async function getApplicationsForEmployer(employerUsername) {
  const response = await axios.get(`${API_BASE}/employer/${employerUsername}`);
  return response.data;
}

/**
 * Get all applications submitted by a user (applicant)
 * @param {string} applicantUsername - username of applicant
 * @returns {Promise<Array>} List of ApplicationResponse DTOs
 */
export async function getApplicationsByUser(applicantUsername) {
  const response = await axios.get(`${API_BASE}/user/${applicantUsername}`);
  return response.data;
}

/**
 * Update application status by employer
 * @param {number} applicationId - ID of the application to update
 * @param {string} status - New status (e.g., "ACCEPTED", "REJECTED", "PENDING")
 * @param {string} currentUsername - username of the employer performing update (for auth)
 * @returns {Promise<void>}
 */
export async function updateApplicationStatus(applicationId, status, currentUsername) {
  const response = await axios.put(
    `${API_BASE}/update-status/${applicationId}`,
    { status },
    { params: { currentUsername } }
  );
  return response.data;
}

/**
 * Update application progress by employer
 * @param {number} applicationId - ID of the application
 * @param {string} progress - Progress update text
 * @param {string} currentUsername - username of employer
 * @returns {Promise<void>}
 */
export async function updateApplicationProgress(applicationId, progress, currentUsername) {
  const response = await axios.put(
    `${API_BASE}/update-progress/${applicationId}`,
    { progress },
    { params: { currentUsername } }
  );
  return response.data;
}

/**
 * Assign user to project after application acceptance (optional endpoint)
 * @param {number} applicationId - ID of the accepted application
 * @returns {Promise<void>}
 */
export async function assignUserToProject(applicationId) {
  const response = await axios.post(`${API_BASE}/assign/${applicationId}`);
  return response.data;
}
