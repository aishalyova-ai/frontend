import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed

export default function UserApplications() {
  const [applications, setApplications] = useState([]);
  const [progressInputs, setProgressInputs] = useState({});
  const [messages, setMessages] = useState({});

  const { token } = useAuth();

  useEffect(() => {
    if (!token) return; // Wait for token before fetching

    fetch('/api/applications/my-applications', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setApplications(data))
      .catch(err => console.error('Error fetching applications:', err));
  }, [token]);

  const handleProgressChange = (applicationId, value) => {
    setProgressInputs(prev => ({
      ...prev,
      [applicationId]: value,
    }));
  };

  const handleSubmitProgress = async (applicationId) => {
    const progress = progressInputs[applicationId];
    try {
      const res = await fetch(`/api/applications/${applicationId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ progress }),
      });

      if (res.ok) {
        setMessages(prev => ({
          ...prev,
          [applicationId]: 'Progress updated successfully!',
        }));
        setApplications(apps =>
          apps.map(app => app.id === applicationId ? { ...app, progress } : app)
        );
      } else {
        const err = await res.text();
        setMessages(prev => ({
          ...prev,
          [applicationId]: `Failed to update: ${err}`,
        }));
      }
    } catch (error) {
      setMessages(prev => ({
        ...prev,
        [applicationId]: `Error: ${error.message}`,
      }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Applications</h2>

      {applications.length === 0 ? (
        <p className="text-gray-600">You haven't applied to any projects yet.</p>
      ) : (
        <ul className="space-y-6">
          {applications.map(app => (
            <li key={app.id} className="border rounded p-5 shadow-sm bg-white">
              <p><strong>Project:</strong> {app.project?.title || 'N/A'}</p>
              <p><strong>Status:</strong> {app.status}</p>
              <p><strong>Cover Letter:</strong> {app.coverLetter}</p>
              <p><strong>Current Progress:</strong> {app.progress || 'No updates yet.'}</p>

              <textarea
                rows="3"
                placeholder="Update your progress here..."
                value={progressInputs[app.id] || ''}
                onChange={e => handleProgressChange(app.id, e.target.value)}
                className="mt-3 w-full border rounded p-2"
              />

              <button
                onClick={() => handleSubmitProgress(app.id)}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Submit Progress
              </button>

              {messages[app.id] && (
                <p className="mt-2 text-sm text-green-600">{messages[app.id]}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
