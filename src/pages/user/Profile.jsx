"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Edit, Plus, X, User, Camera, CheckCircle, Award, Star } from "lucide-react";

export default function ProfilePage() {
  const [userProfileFromBackend, setUserProfileFromBackend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  const [newSkillOfferedName, setNewSkillOfferedName] = useState("");
  const [newSkillOfferedLevel, setNewSkillOfferedLevel] = useState("Beginner");
  const [newSkillToLearn, setNewSkillToLearn] = useState("");

  const [activeTab, setActiveTab] = useState("skills");

  // State to hold the file object for the avatar and its temporary preview URL
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const [editableProfile, setEditableProfile] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    location: "",
    bio: "",
    skillsOffered: [],
    skillsToLearn: [],
    profilePicture: ""
  });

  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await fetch("http://localhost:8080/api/user/profile", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch user profile' }));
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const skillsOffered = Array.isArray(data.skillsOffered) ? data.skillsOffered : [];
        const skillsToLearn = Array.isArray(data.skillsToLearn) ? data.skillsToLearn : [];

        setUserProfileFromBackend(data);
        setEditableProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          username: data.username || "",
          email: data.email || "",
          location: data.location || "",
          bio: data.bio || "",
          skillsOffered: skillsOffered,
          skillsToLearn: skillsToLearn,
          profilePicture: data.avatarUrl || "",
        });

      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // useMemo to create a combined profile object. This is where the preview URL is used.
  const userProfile = useMemo(() => {
    if (!userProfileFromBackend) return {};

    const combinedProfile = {
      ...userProfileFromBackend,
      ...editableProfile,
      skills: Array.isArray(editableProfile.skillsOffered) ? editableProfile.skillsOffered : [],
      wantToLearn: Array.isArray(editableProfile.skillsToLearn) ? editableProfile.skillsToLearn : [],
      name: `${editableProfile.firstName || ''} ${editableProfile.lastName || ''}`.trim() || editableProfile.username || '',
      location: editableProfile.location || "Not specified",
      bio: editableProfile.bio || "No bio provided.",
      // Prioritize the temporary avatarPreviewUrl if it exists, otherwise use the profile picture from state
      profilePicture: avatarPreviewUrl || editableProfile.profilePicture || "",
      joinDate: userProfileFromBackend.joinDate || "N/A",
    };
    return combinedProfile;
  }, [userProfileFromBackend, editableProfile, avatarPreviewUrl]);


  const recentActivity = [
    { type: "exchange_completed", title: "Completed skill exchange with Mike Johnson", description: "Taught React development, learned UI/UX design principles", date: "2 days ago" },
    { type: "project_completed", title: "Finished project: Landing Page Redesign", description: "Delivered modern, responsive landing page for startup", date: "1 week ago" },
    { type: "review_received", title: "Received review from Emma Davis", description: "Excellent React mentoring session. Very knowledgeable and patient!", date: "2 weeks ago" },
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordChange(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    if (newSkillOfferedName.trim()) {
      const skillExists = editableProfile.skillsOffered.some(
        skill => skill.name.toLowerCase() === newSkillOfferedName.trim().toLowerCase()
      );
      if (!skillExists) {
        setEditableProfile(prev => ({
          ...prev,
          skillsOffered: [...prev.skillsOffered, { name: newSkillOfferedName.trim(), level: newSkillOfferedLevel, endorsements: 0 }]
        }));
        setNewSkillOfferedName("");
        setNewSkillOfferedLevel("Beginner");
      } else {
        setStatusMessage({ type: 'error', message: 'Skill already added!' });
      }
    }
  };

  const addWantToLearn = () => {
    if (newSkillToLearn.trim()) {
      const learningInterestExists = editableProfile.skillsToLearn.some(
        skill => String(skill).toLowerCase() === newSkillToLearn.trim().toLowerCase()
      );
      if (!learningInterestExists) {
        setEditableProfile(prev => ({
          ...prev,
          skillsToLearn: [...prev.skillsToLearn, newSkillToLearn.trim()]
        }));
        setNewSkillToLearn("");
      } else {
        setStatusMessage({ type: 'error', message: 'Learning interest already added!' });
      }
    }
  };

 const removeSkill = (skillToRemoveName) => {
  setEditableProfile(prev => ({
    ...prev,
    skillsOffered: prev.skillsOffered.filter(s => s && s.name !== skillToRemoveName)
  }));
};


  const removeWantToLearn = (skillToRemoveName) => {
    setEditableProfile(prev => ({
      ...prev,
      skillsToLearn: prev.skillsToLearn.filter(s => s !== skillToRemoveName)
    }));
  };
  
  // This function now also creates a temporary URL to display the image immediately.
 const handleAvatarChange = (event) => {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(previewUrl);
    setIsEditing(true);
  }
};


  // Helper function to upload the file to a specific endpoint
  const uploadFile = async (file, endpoint) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:8080/api/user/profile/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Note: The browser automatically sets the correct 'Content-Type' for FormData,
          // so we do not need to manually set it to 'multipart/form-data'.
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to upload file to ${endpoint}` }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error(`Error uploading file to ${endpoint}:`, err);
      setError(err.message);
      setStatusMessage({ type: 'error', message: `Error uploading file: ${err.message}` });
      return null;
    }
  };

  // The main save function now orchestrates the file upload and profile update
 // ...
// This is a corrected version of the frontend function, not backend code
const handleSaveProfile = async () => {
  setLoading(true);
  setError(null);
  setStatusMessage({ type: '', message: '' });

  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    let finalProfilePictureUrl = editableProfile.profilePicture;

    // STEP 1: Check and handle avatar upload first
    if (avatarFile) {
      console.log("Attempting to upload new avatar...");
      const avatarFormData = new FormData();
      avatarFormData.append('file', avatarFile);

      const uploadResponse = await fetch("http://localhost:8080/api/user/profile/avatar", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set 'Content-Type': 'application/json' for FormData
        },
        body: avatarFormData,
      });

      if (!uploadResponse.ok) {
        // If upload fails, throw an error to stop the process
        const errorData = await uploadResponse.json().catch(() => ({ message: 'Failed to upload avatar' }));
        throw new Error(errorData.message || `Avatar upload failed: Status ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      finalProfilePictureUrl = uploadResult.url; // Extract the URL from the response
      console.log("Avatar uploaded successfully. New URL:", finalProfilePictureUrl);
    }

    // STEP 2: Update the rest of the profile with the new or existing URL
    const payload = {
      ...editableProfile,
      avatarUrl: finalProfilePictureUrl, // Make sure to use 'avatarUrl' here, not 'profilePicture'
    };

    console.log("Attempting to update user profile with payload:", payload);
    const profileUpdateResponse = await fetch("http://localhost:8080/api/user/profile", {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!profileUpdateResponse.ok) {
      const errorData = await profileUpdateResponse.json().catch(() => ({ message: 'Failed to update profile' }));
      throw new Error(errorData.message || `Profile update failed: Status ${profileUpdateResponse.status}`);
    }

    const updatedData = await profileUpdateResponse.json();
    console.log("Profile updated successfully. Data from backend:", updatedData);
    
    // Update the state with the final backend data
    setUserProfileFromBackend(updatedData);
    setEditableProfile({
      ...updatedData,
      profilePicture: updatedData.avatarUrl || "",
      skillsOffered: updatedData.skillsOffered || [],
      skillsToLearn: updatedData.skillsToLearn || [],
    });

    setAvatarFile(null);
    setAvatarPreviewUrl("");
    setIsEditing(false);
    setStatusMessage({ type: 'success', message: 'Profile updated successfully!' });

  } catch (err) {
    console.error("Error saving profile:", err);
    setError(err.message);
    setStatusMessage({ type: 'error', message: `Error saving profile: ${err.message}` });
  } finally {
    setLoading(false);
  }
};

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage({ type: '', message: '' });

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch("http://localhost:8080/api/user/update-account", {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: editableProfile.username,
          email: editableProfile.email
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update account details' }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const updatedData = await response.json();
      setUserProfileFromBackend(prev => ({ ...prev, username: updatedData.username, email: updatedData.email }));
      setEditableProfile(prev => ({ ...prev, username: updatedData.username, email: updatedData.email }));
      setStatusMessage({ type: 'success', message: 'Account details updated successfully!' });

    } catch (err) {
      console.error("Error updating account details:", err);
      setError(err.message);
      setStatusMessage({ type: 'error', message: `Error updating account details: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage({ type: '', message: '' });

    if (passwordChange.newPassword !== passwordChange.confirmNewPassword) {
      setStatusMessage({ type: 'error', message: 'New password and confirmation do not match.' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch("http://localhost:8080/api/user/change-password", {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordChange.currentPassword,
          newPassword: passwordChange.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to change password' }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      setStatusMessage({ type: 'success', message: 'Password updated successfully!' });
      setPasswordChange({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });

    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.message);
      setStatusMessage({ type: 'error', message: `Error changing password: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const getProgressBarColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">Loading profile...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">Error: {error}</div>;
  }

  if (!userProfileFromBackend) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">No user data available. Please ensure you are logged in and your profile exists.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">SkillSwap</h1>
            <nav className="hidden md:flex space-x-8">
              <Link to="/dashboard/user" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
              <Link to="/dashboard/user/projects" className="text-gray-700 hover:text-indigo-600">Projects</Link>
              <Link to="/dashboard/user/browse-skills" className="text-gray-700 hover:text-indigo-600">Browse Skills</Link>
              <Link to="/dashboard/user/profile" className="text-indigo-600 font-medium">Profile</Link>
              <Link to="/dashboard/user/messages" className="text-gray-700 hover:text-indigo-600">Messages</Link>
            </nav>
            <Link to="/logout"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gray-100 text-gray-900 hover:bg-gray-200"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {statusMessage.message && (
          <div className={`p-4 mb-4 rounded-lg shadow-sm border ${
            statusMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            statusMessage.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`} role="alert">
            {statusMessage.message}
          </div>
        )}

        <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative flex h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-indigo-500">
              {userProfile.profilePicture ? (
               <img
  src={avatarPreviewUrl || (editableProfile.profilePicture ? `http://localhost:8080${editableProfile.profilePicture}` : '/default-avatar.png')}
  alt="Profile Avatar"
  className="w-32 h-32 rounded-full object-cover"
/>
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-2xl font-semibold">
                  {userProfile.name
                    ? userProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                    : editableProfile.username?.[0]?.toUpperCase() || <User className="h-16 w-16 text-indigo-400" />}
                </div>
              )}
              {isEditing && (
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    onChange={handleAvatarChange}
                    ref={fileInputRef}
                    accept="image/*"
                  />
                </label>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="firstName"
                        value={editableProfile.firstName}
                        onChange={handleProfileChange}
                        placeholder="First Name"
                        className="border border-gray-300 rounded-md px-2 py-1 text-base"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={editableProfile.lastName}
                        onChange={handleProfileChange}
                        placeholder="Last Name"
                        className="border border-gray-300 rounded-md px-2 py-1 text-base"
                      />
                    </div>
                  ) : (
                    userProfile.name
                  )}
                </h2>
                <button
  onClick={() => {
    if (isEditing) {
      // Reset editable profile to original backend data
      setEditableProfile({
        firstName: userProfileFromBackend.firstName || "",
        lastName: userProfileFromBackend.lastName || "",
        username: userProfileFromBackend.username || "",
        email: userProfileFromBackend.email || "",
        location: userProfileFromBackend.location || "",
        bio: userProfileFromBackend.bio || "",
        skillsOffered: userProfileFromBackend.skillsOffered || [],
        skillsToLearn: userProfileFromBackend.skillsToLearn || [],
        profilePicture: userProfileFromBackend.avatarUrl || "",
      });
      // Reset temporary avatar states and the status message
      setAvatarFile(null);
      setAvatarPreviewUrl("");
      setStatusMessage({ type: '', message: '' });
    }
    // Toggle the editing state
    setIsEditing(!isEditing);
  }}
  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-gray-100 h-10 px-4 py-2"
>
  <Edit className="h-4 w-4 mr-2" />
  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>
                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    className="ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2"
                  >
                    Save Changes
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4 text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={editableProfile.location}
                      onChange={handleProfileChange}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                  ) : (
                    <span>{userProfile.location || "Not specified"}</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {userProfile.joinDate ? new Date(userProfile.joinDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  value={editableProfile.bio}
                  onChange={handleProfileChange}
                  rows={3}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                ></textarea>
              ) : (
                <p className="text-gray-700 mb-4">{userProfile.bio || "No bio provided."}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid w-full grid-cols-3 bg-gray-100 rounded-md p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("skills")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "skills"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "activity"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "settings"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Settings
            </button>
          </div>

          {activeTab === "skills" && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Skills I Offer</h3>
                  </div>
                  <div className="space-y-4">
                    {editableProfile.skillsOffered.length > 0 ? (
                      editableProfile.skillsOffered.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                               <span className="font-medium text-gray-800">{skill?.name || "Unknown Skill"}</span>
                              {isEditing ? (
                               <select
  value={skill?.level || ""}
  onChange={(e) => {
    const updatedSkills = editableProfile.skillsOffered.map((s, i) =>
      i === index ? { ...s, level: e.target.value } : s
    );
    setEditableProfile({ ...editableProfile, skillsOffered: updatedSkills });
  }}
>
  <option value="Beginner">Beginner</option>
  <option value="Intermediate">Intermediate</option>
  <option value="Advanced">Advanced</option>
  <option value="Expert">Expert</option>
                                </select>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
  {skill?.level || "N/A"}
</span>
                              )}
                            </div>
                            {isEditing && (
                              <button
  onClick={() => removeSkill(skill?.name || "")}
  className="ml-2 p-1 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
  aria-label={`Remove ${skill?.name || "skill"}`}
>
  <X className="h-4 w-4" />
</button>

                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                           <div
  className={`h-2 rounded-full ${getProgressBarColor(
    skill?.level === "Expert"
      ? 100
      : skill?.level === "Advanced"
        ? 80
        : skill?.level === "Intermediate"
          ? 60
          : 40
  )}`}
  style={{
    width: `${
      skill?.level === "Expert"
        ? 100
        : skill?.level === "Advanced"
          ? 80
          : skill?.level === "Intermediate"
            ? 60
            : 40
    }%`
  }}
></div>

                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-sm">No skills listed yet.</p>
                    )}
                  </div>
                  {isEditing && (
                    <div className="mt-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a skill you offer..."
                          value={newSkillOfferedName}
                          onChange={(e) => setNewSkillOfferedName(e.target.value)}
                          onKeyPress={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                          className="flex-1 h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        />
                        <select
                          value={newSkillOfferedLevel}
                          onChange={(e) => setNewSkillOfferedLevel(e.target.value)}
                          className="h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <button
                          onClick={addSkill}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Skills I Want to Learn</h3>
                  <div className="flex flex-wrap gap-2">
                    {editableProfile.skillsToLearn.length > 0 ? (
                      editableProfile.skillsToLearn.map((skill, index) => (
                        <div key={index} className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                          <span>{skill}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeWantToLearn(skill)}
                              className="ml-2 p-1 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                              aria-label={`Remove ${skill}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-sm">No skills listed yet.</p>
                    )}
                  </div>
                  {isEditing && (
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a skill you want to learn..."
                        value={newSkillToLearn}
                        onChange={(e) => setNewSkillToLearn(e.target.value)}
                        onKeyPress={(e) => { if (e.key === "Enter") { e.preventDefault(); addWantToLearn(); } }}
                        className="flex-1 h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      />
                      <button
                        onClick={addWantToLearn}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6 pt-4">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        {activity.type === "exchange_completed" && <CheckCircle className="h-6 w-6 text-green-500" />}
                        {activity.type === "project_completed" && <Award className="h-6 w-6 text-yellow-500" />}
                        {activity.type === "review_received" && <Star className="h-6 w-6 text-indigo-500" />}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm">No recent activity.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div className="space-y-6 pt-4">
              {/* Account Details Form */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Account Details</h3>
                <form onSubmit={handleUpdateAccount}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={editableProfile.username}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editableProfile.email}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2"
                      >
                        Update Account
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Password Change Form */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordChange.currentPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordChange.newPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={passwordChange.confirmNewPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}