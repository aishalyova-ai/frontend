import React, { useState, useEffect } from "react";
import { UserCircle, LucideArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ExchangeDetails = ({ exchangeId, currentUserId, token, onBack }) => {
  const [exchange, setExchange] = useState(null);
  const [partner, setPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchExchangeAndPartnerData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch exchange details
        const exchangeResponse = await fetch(`${BASE_URL}/api/exchanges/${exchangeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!exchangeResponse.ok) {
          throw new Error(`Failed to fetch exchange data (status: ${exchangeResponse.status})`);
        }

        const fetchedExchange = await exchangeResponse.json();
        setExchange(fetchedExchange);

        // Ensure requester and partner exist
        if (!fetchedExchange.requester || !fetchedExchange.partner) {
          throw new Error("Exchange data is incomplete: missing requester or partner.");
        }

        // Determine the partner ID
       const partnerId =
  fetchedExchange.requesterId === currentUserId
    ? fetchedExchange.partnerId
    : fetchedExchange.requesterId;

        if (!partnerId) {
          throw new Error("Partner ID is missing. Cannot fetch partner profile.");
        }

        // Fetch partner profile safely
        const partnerResponse = await fetch(`${BASE_URL}/api/users/${partnerId}`, {
  headers: { Authorization: `Bearer ${token}` }
});


        if (!partnerResponse.ok) {
          throw new Error(`Failed to fetch partner data (status: ${partnerResponse.status})`);
        }

        const fetchedPartner = await partnerResponse.json();
        setPartner(fetchedPartner);

      } catch (err) {
        console.error("Error fetching exchange or partner:", err);
        setError(err.message || "Failed to load exchange details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (exchangeId && currentUserId && token) {
      fetchExchangeAndPartnerData();
    }
  }, [exchangeId, currentUserId, token]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!exchange || !partner) return <div>No data available.</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="mr-4 text-gray-500 hover:text-indigo-600">
            <LucideArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Exchange Details (ID: {exchange.id})
          </h1>
        </div>

        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 mb-6">
          <div className="flex items-center mb-4">
            <UserCircle className="w-10 h-10 text-indigo-500 mr-3" />
            <h2 className="text-xl font-semibold text-indigo-800">Partner Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="font-medium text-gray-600">Full Name:</p>
              <p className="font-bold text-indigo-600">{`${partner.firstName} ${partner.lastName}`}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Location:</p>
              <p>{partner.location || "N/A"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium text-gray-600">Bio:</p>
              <p>{partner.bio || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Skills:</p>
              <p>{partner.skills?.join(", ") || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Experience:</p>
              <p>{partner.experience || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Exchange Details</h2>
          <p>Skill Offered: {exchange.skillOffered}</p>
          <p>Skill Wanted: {exchange.skillWanted}</p>
          <p>Status: {exchange.status}</p>
          <p>Message: {exchange.message}</p>
        </div>
      </div>
    </div>
  );
};

export default ExchangeDetails;
