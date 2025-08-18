// src/api/skillExchangeApi.js
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/skill-exchange';

export const sendRequest = async (requesterId, partnerId, skillOffered, skillWanted) => {
  return axios.post(`${API_BASE}/request`, { requesterId, partnerId, skillOffered, skillWanted });
};

export const getAllRequests = async () => {
  return axios.get(`${API_BASE}/all`);
};

export const getMyRequests = async (userId) => {
  return axios.get(`${API_BASE}/my/${userId}`);
};

export const acceptRequest = async (requestId) => {
  return axios.post(`${API_BASE}/accept/${requestId}`);
};

export const declineRequest = async (requestId) => {
  return axios.post(`${API_BASE}/decline/${requestId}`);
};
