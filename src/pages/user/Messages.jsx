import React, { useState, useEffect, useMemo } from "react";
import { Search, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserChats, startChat } from "../../api/ChatApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function ChatListPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      toast.error("Please log in to view messages.");
      navigate("/signin");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/notifications/user/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error(`Failed to fetch notifications: ${res.status}`);
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        toast.error("Failed to load notifications.");
      }
    };

    const fetchChats = async () => {
      try {
        const data = await fetchUserChats(user.id, token);
        const filteredData = data.filter((conv) => conv.id && conv.id !== "undefined");
        setConversations(filteredData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to load conversations");
        setLoading(false);
      }
    };

    fetchNotifications();
    fetchChats();
  }, [user, token, navigate]);

  // Count unread notifications per chat
  const unreadCounts = useMemo(() => {
    const counts = {};
    notifications.forEach((n) => {
      const chatId = n.chatId || n.senderId;
      if (!counts[chatId]) counts[chatId] = 0;
      if (!n.read) counts[chatId] += 1;
    });
    return counts;
  }, [notifications]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const q = searchQuery.toLowerCase();
      const name = conv.partnerName?.toLowerCase() || "";
      return name.includes(q);
    });
  }, [conversations, searchQuery]);

  const handleNotificationClick = async (notification, event) => {
    if (!notification.chatId || notification.chatId === "undefined" || !notification.senderId) {
      event.preventDefault();
      try {
        const chat = await startChat(user.id, notification.senderId, token);
        if (chat?.id) {
          await fetch(`http://localhost:8080/api/notifications/${notification.id}/read`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
          });
          navigate(`/dashboard/user/chat-page/${chat.id}`, {
            state: {
              chatId: chat.id,
              partnerId: notification.senderId,
              partnerName: notification.senderName || "Unknown User",
              partnerAvatar: notification.senderAvatar || "/default-avatar.png",
              currentUserPic: user.avatarUrl || "/default-avatar.png",
            },
          });
        }
      } catch (err) {
        console.error("Failed to start chat:", err);
        toast.error("Failed to start chat from notification.");
      }
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-indigo-600">SkillSwap</h1>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          {notifications.length ? (
            <ul className="space-y-2 mt-2">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  to={`/dashboard/user/chat-page/${n.chatId || n.senderId}`}
                  state={{
                    chatId: n.chatId || null,
                    partnerId: n.senderId,
                    partnerName: n.senderName || "Unknown User",
                    partnerAvatar: n.senderAvatar || "/default-avatar.png",
                    currentUserPic: user.avatarUrl || "/default-avatar.png",
                  }}
                  onClick={(e) => handleNotificationClick(n, e)}
                  className="block bg-white p-3 border rounded shadow-sm text-sm hover:bg-indigo-50 transition"
                >
                  <span className="font-medium">
                    {n.type ? n.type.replace("EXCHANGE_", "").replace("_", " ") : "Notification"}
                  </span>
                  : {n.message || "No message"}
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No new notifications</p>
          )}
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => {
            const partnerId = conv.userIds.find((id) => id !== user.id) || null;
            const unread = unreadCounts[conv.id || partnerId] || 0;
            return (
              <Link
                key={conv.id}
                to={`/dashboard/user/chat-page/${conv.id}`}
                state={{
                  chatId: conv.id,
                  partnerId,
                  partnerName: conv.partnerName || "Unknown User",
                  partnerAvatar: conv.partnerAvatar || "/default-avatar.png",
                  currentUserPic: user.avatarUrl || "/default-avatar.png",
                }}
                className="block bg-white rounded p-4 mb-4 shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{conv.partnerName || "Unknown User"}</h3>
                  {unread > 0 && (
                    <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                      {unread}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {conv.lastMessage || "No messages yet"}
                </p>
              </Link>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-lg shadow-sm">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No conversations yet. Browse skills to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
