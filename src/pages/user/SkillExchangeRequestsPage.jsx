import React, { useState, useEffect, useCallback} from "react";
import { Check, X, MessageSquare, UserCircle, Star, LucideArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";


const Modal = ({ message, onConfirm, onCancel }) => {
  if (!message) return null;

  const isConfirmation = typeof onConfirm === 'function';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4 transform scale-100 transition-transform duration-300 ease-out">
        <p className="text-gray-800 text-lg font-medium">{message}</p>
        <div className="flex justify-end gap-2">
          {isConfirmation && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm || onCancel}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${isConfirmation ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isConfirmation ? 'Confirm' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ExchangeDetails component now accepts the token and user as props
const ExchangeDetails = ({ exchangeId, currentUserId, token, onBack }) => {
  const [exchange, setExchange] = useState(null);
  const [partner, setPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchExchangeAndPartnerData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the exchange details with the authorization token
        const exchangeResponse = await fetch(`${BASE_URL}/api/exchanges/${exchangeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Check for specific error status codes for better user feedback
        if (!exchangeResponse.ok) {
          if (exchangeResponse.status === 401) {
            throw new Error('Authentication failed. The token may be invalid or expired.');
          } else if (exchangeResponse.status === 403) {
            throw new Error('You do not have permission to view this exchange.');
          }
          throw new Error('Failed to fetch exchange data.');
        }
        const fetchedExchange = await exchangeResponse.json();
        setExchange(fetchedExchange);

        // Determine the partner's ID based on the current user
        // Added checks to ensure requester and partner objects exist before accessing properties
        if (!fetchedExchange.requester || !fetchedExchange.partner) {
          throw new Error("Invalid exchange data: requester or partner information is missing.");
        }
        const partnerId = fetchedExchange.requester.id === currentUserId
          ? fetchedExchange.partner.id
          : fetchedExchange.requester.id;

        // Fetch the partner's profile with the authorization token
        const partnerResponse = await fetch(`${BASE_URL}/api/users/${partnerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Check for specific error status codes for better user feedback
        if (!partnerResponse.ok) {
          if (partnerResponse.status === 401) {
            throw new Error('Authentication failed for the partner profile.');
          } else if (partnerResponse.status === 403) {
            throw new Error('You do not have permission to view this partner\'s profile.');
          }
          throw new Error('Failed to fetch partner data.');
        }
        const fetchedPartner = await partnerResponse.json();
        setPartner(fetchedPartner);

      } catch (err) {
        console.error('Failed to fetch data:', err);
        // Use the specific error message from the thrown error
        setError(err.message || 'Failed to load exchange details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (exchangeId && currentUserId && token) {
      fetchExchangeAndPartnerData();
    }
  }, [exchangeId, currentUserId, token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!exchange || !partner) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl text-gray-700">No data available.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-200">
        <div className="flex items-center mb-6">
          <button
            className="text-gray-500 hover:text-indigo-600 transition-colors mr-4"
            onClick={onBack}
            aria-label="Go back"
          >
            <LucideArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Exchange Details (ID: {exchange.id})
          </h1>
        </div>

        <div className="space-y-6">
          {/* Partner Profile Information */}
          <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
            <div className="flex items-center mb-4">
              <UserCircle className="w-10 h-10 text-indigo-500 mr-3" />
              <h2 className="text-2xl font-semibold text-indigo-800">
                Partner Profile
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="font-medium text-gray-600">Full Name:</p>
                <p className="font-bold text-indigo-600">{`${partner.firstName} ${partner.lastName}`}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Location:</p>
                <p>{partner.location}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-medium text-gray-600">Bio:</p>
                <p>{partner.bio}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Skills:</p>
                <p>{partner.skills.join(', ')}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Experience:</p>
                <p>{partner.experience}</p>
              </div>
            </div>
          </div>

          {/* Exchange Skills */}
          <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
            <h2 className="text-2xl font-semibold text-yellow-800 mb-4">
              Exchange Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="font-medium text-gray-600">Skill Offered:</p>
                <p>{exchange.skillOffered}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Skill Wanted:</p>
                <p>{exchange.skillWanted}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-medium text-gray-600">Status:</p>
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded-full capitalize">
                  {exchange.status.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Request Message */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Request Message
            </h2>
            <p className="text-gray-700 italic">
              {exchange.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


// Main App component
const App = () => {
  // This wrapper is now correctly using a single AuthProvider, which you should define in a separate file.
  // This App component is no longer self-sufficient for authentication but relies on the imported context.
  return (
    <MainContent />
  );
};

const MainContent = () => {
  const { user, token, authLoading, logout } = useAuth(); // Assuming logout is also provided by the central AuthProvider

  const [tab, setTab] = useState("incoming");
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ message: null, onConfirm: null });

  const [selectedExchangeId, setSelectedExchangeId] = useState(null);

  const BASE_URL = "http://localhost:8080";

  const showModal = (message, onConfirm = null) => {
    setModal({ message, onConfirm });
  };

  const closeModal = () => {
    setModal({ message: null, onConfirm: null });
  };

  const fetchRequests = useCallback(async () => {
    if (!user || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [inRes, sRes, accRes, rejRes] = await Promise.all([
        fetch(`${BASE_URL}/api/exchanges/received/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/exchanges/sent/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/exchanges/accepted/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/exchanges/rejected/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Check for 401 Unauthorized responses and handle appropriately
      if (!inRes.ok || !sRes.ok || !accRes.ok || !rejRes.ok) {
        // You might want to log the user out if any request returns 401
        if ([inRes, sRes, accRes, rejRes].some(res => res.status === 401)) {
          logout(); // assuming your AuthProvider provides a logout function
          throw new Error('Authentication failed. Please log in again.');
        }
        // Handle other non-ok responses
        throw new Error('Failed to fetch one or more request lists.');
      }

      const [inData, sData, accData, rejData] = await Promise.all([
        inRes.json(),
        sRes.json(),
        accRes.json(),
        rejRes.json(),
      ]);

      console.log("Incoming requests:", inData);
      console.log("Sent requests:", sData);
      console.log("Accepted exchanges:", accData);
      console.log("Rejected exchanges:", rejData);

      setIncoming(Array.isArray(inData) ? inData : []);
      setSent(Array.isArray(sData) ? sData : []);
      setAccepted(Array.isArray(accData) ? accData : []);
      setRejected(Array.isArray(rejData) ? rejData : []);
    } catch (err) {
      console.error("Failed to load requests:", err);
      setError(err.message || "Failed to load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, token, logout]);

  useEffect(() => {
    if (user && token) {
      fetchRequests();
    }
  }, [fetchRequests, user, token]);

  const handleViewDetails = (exchangeId) => {
    setSelectedExchangeId(exchangeId);
  };

  const handleBack = () => {
    setSelectedExchangeId(null);
  };

  const handleAction = async (id, action) => {
    if (!token) return;
  
    // Special handling for the 'accept' action
    if (action === "accept") {
      try {
        const response = await fetch(`${BASE_URL}/api/exchanges/${id}/accept`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) {
          if (response.status === 401) {
            logout();
            throw new Error('Authentication failed. Please log in again.');
          }
          throw new Error('Failed to accept request.');
        }
  
       const updatedExchange = await response.json();
const partner = updatedExchange.requester?.id === user?.id ? updatedExchange.partner : updatedExchange.requester;

// Navigate to generic Messages page with partner info
navigate(`/dashboard/user/messages`, {
  state: {
    partnerId: partner?.id,
    partnerName: `${partner?.firstName} ${partner?.lastName}`,
    partnerPic: partner?.profilePicture,
    currentUserPic: user?.profilePicture,
  },
});

  
      } catch (error) {
        console.error(`Failed to accept request (ID: ${id}):`, error);
        showModal(error.message || `Failed to accept request. Please check the console for details.`);
      }
      return;
    }
  
    // Handle other actions with a modal confirmation
    if (["decline", "cancel", "withdraw"].includes(action)) {
      showModal(`Are you sure you want to ${action} this request?`, async () => {
        closeModal();
        await performAction(id, action);
      });
      return;
    }
  
    // Fallback for actions that don't need confirmation
    await performAction(id, action);
  };
  
  const performAction = async (id, action) => {
    try {
      const response = await fetch(`${BASE_URL}/api/exchanges/${id}/${action}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to ${action} request.`);
      }
      
      showModal(`Request ${action}d successfully.`);
      fetchRequests();
    } catch (error) {
      console.error(`Failed to ${action} request (ID: ${id}):`, error);
      showModal(error.message || `Failed to ${action} request. Please check the console for details.`);
    }
  };
    const navigate = useNavigate();

  const renderButtons = (req, currentTab) => {
    // Determine the partner for the chat link
    const partner = req.requester?.id === user?.id ? req.partner : req.requester;
  // Use the updated field from your backend
  const chatId = req.chatId; // <

    return (
      <div className="flex gap-2 mt-2 flex-wrap">
        <button
          onClick={() => handleViewDetails(req.id)}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1 hover:bg-blue-200 transition-colors"
        >
          <UserCircle className="w-3 h-3" /> View Profile
        </button>
        {currentTab === "accepted" && req.status === "ACCEPTED" && (
          <>
           <button
  onClick={() => {
    navigate(`/dashboard/user/messages`, {
      state: {
        partnerId: partner?.id,
        partnerName: `${partner?.firstName} ${partner?.lastName}`,
        partnerPic: partner?.profilePicture,
        currentUserPic: user?.profilePicture
      }
    });
  }}
  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1 hover:bg-green-200 transition-colors"
>
  <MessageSquare className="w-3 h-3" /> Chat
</button>


            <button
              onClick={() => handleAction(req.id, "withdraw")}
              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center gap-1 hover:bg-red-200 transition-colors"
            >
              <X className="w-3 h-3" /> Withdraw
            </button>
            <button
              onClick={() => showModal("Rating feature to be implemented...")}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center gap-1 hover:bg-yellow-200 transition-colors"
            >
              <Star className="w-3 h-3" /> Rate
            </button>
          </>
        )}
      </div>
    );
  };

  const renderRequest = (req, currentTab) => {
    // Use nested requester and partner objects properly:
    const otherUserName =
      req.requester?.id === user?.id
        ? `${req.partner?.firstName} ${req.partner?.lastName}`
        : `${req.requester?.firstName} ${req.requester?.lastName}`;

    let message;
    if (currentTab === "accepted") {
      message = `You accepted an exchange with `;
    } else if (currentTab === "sent") {
      message = `You sent a request to `;
    } else if (currentTab === "incoming") {
      message = `wants to exchange with you`;
    } else if (currentTab === "rejected") {
      message = `You rejected an exchange from `;
    }

    return (
      <div
        key={req.id}
        className="bg-white rounded-2xl p-4 mb-4 flex justify-between items-center shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <div>
          <p className="text-gray-700">
            {currentTab === "incoming" ? (
              <>
                <strong className="text-indigo-600">{otherUserName}</strong> {message}
              </>
            ) : (
              <>
                {message} <strong className="text-indigo-600">{otherUserName}</strong>
              </>
            )}
          </p>
          <p className="text-sm mt-1 text-gray-500">
            Offer: {req.skillOffered} | Want: {req.skillWanted}
          </p>
          <div className="flex items-center mt-2 space-x-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                req.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : req.status === "ACCEPTED"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {req.status.toLowerCase()}
            </span>
            <span className="text-xs text-gray-400">Request ID: {req.id}</span>
          </div>
          {renderButtons(req, currentTab)}
        </div>
        <div className="flex items-center gap-2">
          {tab === "incoming" && req.status === "PENDING" && (
            <>
              <button
                onClick={() => handleAction(req.id, "accept")}
                className="bg-green-500 rounded-full p-2 text-white hover:bg-green-600 transition-colors"
                title="Accept Request"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleAction(req.id, "decline")}
                className="bg-red-500 rounded-full p-2 text-white hover:bg-red-600 transition-colors"
                title="Decline Request"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {tab === "sent" && req.status === "PENDING" && (
            <button
              onClick={() => handleAction(req.id, "cancel")}
              className="bg-gray-500 rounded-full p-2 text-white hover:bg-gray-600 transition-colors"
              title="Cancel Request"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  if (authLoading) return <div className="p-4 text-center">Authenticating...</div>;
  if (!user) return <div className="p-4 text-center">Please log in to view your requests.</div>;
  if (loading) return <div className="p-4 text-center">Loading requests...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
  
  if (selectedExchangeId) {
    return (
      <ExchangeDetails
        exchangeId={selectedExchangeId}
        currentUserId={user.id}
        token={token}
        onBack={handleBack}
      />
    );
  }

  const list = {
    incoming,
    sent,
    accepted,
    rejected,
  }[tab];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 max-w-3xl mx-auto font-sans">
      <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">
        Skill Exchange Requests
      </h2>
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {["incoming", "sent", "accepted", "rejected"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="p-12 bg-white text-center rounded-2xl shadow-md">
          <p className="text-gray-600">
            {tab === "incoming"
              ? "No new requests."
              : tab === "sent"
              ? "No sent requests."
              : tab === "accepted"
              ? "No accepted exchanges."
              : "No rejected requests."}
          </p>
        </div>
      ) : (
        list.map((req) => renderRequest(req, tab))
      )}

      <Modal message={modal.message} onConfirm={modal.onConfirm} onCancel={closeModal} />
      {user && (
        <div className="text-center mt-8">
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
