import React, { useState } from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";

// Modal component to display messages
const MessageModal = ({ message, onClose }) => {
  if (!message) return null;

  const isSuccess = message.type === 'success';
  const icon = isSuccess ? <CheckCircle size={48} /> : <AlertTriangle size={48} />;
  const color = isSuccess ? 'text-green-500' : 'text-yellow-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative transform transition-all scale-100 opacity-100">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition">
          <X size={24} />
        </button>
        <div className={`flex flex-col items-center justify-center gap-4 ${color}`}>
          {icon}
          <p className="text-center font-semibold text-gray-800">{message.text}</p>
        </div>
      </div>
    </div>
  );
};

// Main UserPaymentsPage component
const UserPaymentsPage = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [accountNumber, setAccountNumber] = useState("");
  const [message, setMessage] = useState(null);

  const handleRequestPayment = () => {
    // Basic validation for amount
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount.' });
      return;
    }
    
    // Validation for account number when bank is selected
    if (method === 'bank' && !accountNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter your account number.' });
      return;
    }

    // Display a success message with the details
    setMessage({
      type: 'success',
      text: `Requesting Tsh${Number(amount).toLocaleString()} via ${method} for account: ${accountNumber || 'N/A'}.`
    });
    
    // In a real application, you would call your API here
    // Example:
    // try {
    //   await axios.post('/api/payout', { amount, method, accountNumber });
    //   setMessage({ type: 'success', text: 'Payment request submitted successfully!' });
    // } catch (error) {
    //   setMessage({ type: 'error', text: 'Failed to submit payment request. Please try again.' });
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4 text-center">Request Payment</h1>
        <p className="mb-6 text-gray-700 text-center">Current Balance: <strong>Tsh2,800,000.00</strong></p>

        <label className="block mb-2 text-gray-700 font-medium">Amount (Tsh)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="e.g., 50000"
        />

        <label className="block mb-2 text-gray-700 font-medium">Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          <option value="bank">Bank Account</option>
          <option value="paypal">PayPal</option>
        </select>

        {/* Account Number field only visible for 'bank' method */}
        {method === 'bank' && (
          <>
            <label className="block mb-2 text-gray-700 font-medium">Bank Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              placeholder="e.g., 1234567890"
            />
          </>
        )}

        <button
          onClick={handleRequestPayment}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          Request Payment
        </button>
      </div>

      <MessageModal
        message={message}
        onClose={() => setMessage(null)}
      />
    </div>
  );
};

export default UserPaymentsPage;
