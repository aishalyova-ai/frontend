// src/api/ChatApi.js
const API_BASE = "http://localhost:8080/api/chats";

// Fetch messages in a chat
export async function fetchMessages(chatId, token, lastMessageId = null) {
  const url = lastMessageId
    ? `${API_BASE}/${chatId}/messages?lastMessageId=${lastMessageId}`
    : `${API_BASE}/${chatId}/messages`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
  return await res.json();
}
// Send a text message
export async function sendMessage(chatId, senderId, content, token) {
  const res = await fetch(`${API_BASE}/${chatId}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: new URLSearchParams({ senderId, content }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to send message: ${res.status} - ${errText}`);
  }

  return await res.json(); // returns MessageDto
}

// Upload a file (image, audio, video, etc.) as a message
export async function uploadFile(chatId, senderId, file, token) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("senderId", senderId);

  const res = await fetch(`${API_BASE}/${chatId}/messages/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to upload file: ${res.status} - ${errText}`);
  }

  return await res.json(); // returns MessageDto
}

// Fetch all chats a user is part of
export async function fetchUserChats(userId, token) {
  const res = await fetch(`${API_BASE}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch user chats: ${res.status}`);
  return await res.json(); // returns array of ChatDto
}

// Fetch single chat metadata
export async function fetchChat(chatId, token) {
  const res = await fetch(`${API_BASE}/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch chat: ${res.status}`);
  return await res.json(); // returns ChatDto
}

// Start a chat between two users (creates if not exists)
export async function startChat(userId1, userId2, token) {
  const res = await fetch(`${API_BASE}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId1, userId2 }),
  });
  if (!res.ok) throw new Error(`Failed to start chat: ${res.status}`);
  return await res.json(); // returns ChatDto
}
