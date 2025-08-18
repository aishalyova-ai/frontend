// UserPaymentsPage.jsx
import React, { useState } from "react";

export default function UserPaymentsPage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");

  const handleRequestPayment = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    alert(`Requesting $${amount} via ${method}`);
    // Here you would call your API to request payout
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Request Payment</h1>
        <p className="mb-4 text-gray-700">Current Balance: <strong>$2,800.00</strong></p>

        <label className="block mb-2 text-gray-700">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />

        <label className="block mb-2 text-gray-700">Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="bank">Bank Account</option>
          <option value="paypal">PayPal</option>
        </select>

        <button
          onClick={handleRequestPayment}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Request Payment
        </button>
      </div>
    </div>
  );
}
