import React, { useState } from "react";
import axios from "axios";

function DocuSignForm() {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(""); // To handle errors

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!receiverEmail || !receiverName) {
      alert("All fields required");
      return;
    }

    setIsSubmitting(true);
    setError(""); // Clear any previous errors

    const formData = {
      receiverEmail,
      receiverName,
      templateId: "3c5d6bf3-d5a2-4630-89a8-17ee5aabe5c2", // Pass your predefined template ID
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/docusign/send",
        formData
      );
      alert("✅ Document sent! Envelope ID: " + res.data.envelope.envelopeId);
      setReceiverEmail("");
      setReceiverName("");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(
        "❌ Failed to send: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Send Document for Signature
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Receiver Name
          </label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            placeholder="Receiver Name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Receiver Email
          </label>
          <input
            type="email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            placeholder="Receiver Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isSubmitting ? "Sending..." : "Send for Signature"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
    </div>
  );
}

export default DocuSignForm;
