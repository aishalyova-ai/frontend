import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Video,
  ArrowLeft,
  Phone,
  MoreVertical,
} from "lucide-react";
import { fetchMessages, sendMessage, startChat, uploadFile } from "../../api/ChatApi";
import { useAuth } from "../../context/AuthContext";

export default function ChatPage() {
  const { user, token, authLoading } = useAuth();
  const { chatId: urlChatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { partnerId } = location.state || {};

  const [chatId, setChatId] = useState(urlChatId || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState({
    partnerName: "Loading...",
    partnerPic: "/default-avatar.png",
  });

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const renderMessageContent = (msg) => {
    if (msg.content) return <span>{msg.content}</span>;
    if (msg.imageUrl)
      return <img src={msg.imageUrl} alt="sent" className="max-w-xs rounded-lg" />;
    if (msg.fileUrl)
      return (
        <a
          href={msg.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Download file
        </a>
      );
    return <span>Unsupported message type</span>;
  };

  useEffect(() => {
    if (authLoading) return;

    const initializeChat = async () => {
      if (!token || !user) {
        toast.error("Please log in to access chat.");
        navigate("/signin");
        return;
      }

      let resolvedPartnerId = partnerId || urlChatId;

      try {
        // Fetch partner details
        const res = await fetch(`http://localhost:8080/api/users/${resolvedPartnerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch partner details");
        const data = await res.json();

        setPartnerDetails({
          partnerName: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.username || "Unknown User",
          partnerPic: data.avatarUrl || data.profilePic || "/default-avatar.png",
        });

        // Start chat if needed
        let currentChatId = chatId || urlChatId;
        if (!currentChatId || currentChatId === "undefined") {
          const chat = await startChat(user.id, resolvedPartnerId, token);
          currentChatId = chat.id;
          setChatId(currentChatId);
          navigate(`/dashboard/user/chat-page/${currentChatId}`, {
            state: { partnerId: resolvedPartnerId },
            replace: true,
          });
        }

        // Fetch existing messages
        const msgs = await fetchMessages(currentChatId, token);
        setMessages(msgs || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load partner details or chat.");
        setError("Failed to load chat.");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [urlChatId, partnerId, token, user, navigate, authLoading, chatId]);

  useEffect(() => {
    if (!chatId || chatId === "undefined" || !token) return;

    const loadNewMessages = async () => {
      try {
        const lastMessageId = messages.length ? messages[messages.length - 1].id : null;
        const newMessages = await fetchMessages(chatId, token, lastMessageId);
        if (newMessages?.length) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((msg) => msg.id));
            const uniqueNewMessages = newMessages.filter((msg) => !existingIds.has(msg.id));
            return [...prev, ...uniqueNewMessages];
          });
        }
      } catch (err) {
        console.error("Failed to fetch new messages:", err);
      }
    };

    pollingRef.current = setInterval(loadNewMessages, 5000);
    return () => clearInterval(pollingRef.current);
  }, [chatId, token, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setTyping(true);
    setTimeout(() => setTyping(false), 1500);
  };

  const handleSend = async () => {
    if (!input.trim() || !token || !chatId || chatId === "undefined" || !user) return;
    try {
      const newMsg = await sendMessage(chatId, user.id, input.trim(), token);
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Could not send message. Try again.");
    }
  };

  const handleUploadFile = async (file) => {
    if (!file || !token || !chatId || chatId === "undefined" || !user) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }
    setLoading(true);
    try {
      const newMsg = await uploadFile(chatId, user.id, file, token);
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error("File upload failed:", err);
      toast.error("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (type) => {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    if (type === "image") inputFile.accept = "image/*";
    if (type === "audio") inputFile.accept = "audio/*";
    if (type === "video") inputFile.accept = "video/*";
    inputFile.onchange = () => {
      if (inputFile.files.length > 0) handleUploadFile(inputFile.files[0]);
    };
    inputFile.click();
  };

  const renderMessage = (msg) => {
    const isMine = msg.senderId === user?.id;
    const senderAvatar = isMine
      ? (user?.avatarUrl || user?.profilePic || "/default-avatar.png")
      : (msg.senderProfilePicUrl || "/default-avatar.png");

    return (
      <div
        key={msg.id || `${msg.senderId}-${msg.timestamp}`}
        className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}
      >
        <div className={`p-2 rounded-lg max-w-xs ${isMine ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
          {renderMessageContent(msg)}
          <p className="text-[10px] text-blue-700 mt-1 text-right">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-blue-50">
      <header className="bg-blue-600 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14 text-white">
          <ArrowLeft
            className="w-4 h-4 mr-1 cursor-pointer"
            aria-label="Back"
            onClick={() => navigate("/dashboard/user/messages")}
          />
          <h1 className="text-xl font-bold">SkillSwap</h1>
        </div>
      </header>

      <div className="bg-blue-100 p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-3">
          <img
            src={partnerDetails.partnerPic}
            alt={partnerDetails.partnerName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-blue-900">{partnerDetails.partnerName}</h2>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-blue-800">
          <button aria-label="Call"><Phone className="w-4 h-4" /></button>
          <button aria-label="Share image"><ImageIcon className="w-4 h-4" /></button>
          <button aria-label="More options"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading || authLoading ? (
          <p className="text-center text-blue-700">Loading messages...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-blue-700">No messages yet</p>
        ) : (
          messages.map((msg) => renderMessage(msg))
        )}
        {typing && <p className="text-xs text-blue-700 italic">Typing...</p>}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 bg-blue-100 border-t flex items-center gap-2">
        <button onClick={() => handleUpload("file")} aria-label="Upload file">
          <Paperclip className="w-5 h-5 text-blue-800" />
        </button>
        <button onClick={() => handleUpload("image")} aria-label="Upload image">
          <ImageIcon className="w-5 h-5 text-blue-800" />
        </button>
        <button onClick={() => handleUpload("audio")} aria-label="Upload audio">
          <Mic className="w-5 h-5 text-blue-800" />
        </button>
        <button onClick={() => handleUpload("video")} aria-label="Upload video">
          <Video className="w-5 h-5 text-blue-800" />
        </button>
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          aria-label="Message input"
        />
        <button onClick={handleSend} disabled={loading || !input.trim()} aria-label="Send message">
          <Send className={`w-5 h-5 ${loading || !input.trim() ? "text-gray-400" : "text-blue-600"}`} />
        </button>
      </footer>
    </div>
  );
}
