import React, { useEffect, useState } from "react";
import axios from "axios";

function DocuSignForm() {
  const [file, setFile] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Admin") {
      setIsAdmin(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !receiverEmail || !receiverName) {
      alert("All fields required");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("receiverEmail", receiverEmail);
    formData.append("receiverName", receiverName);
    formData.append("senderEmail", "sender@example.com");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/docusign/send",
        formData
      );
      alert("✅ Document sent! Envelope ID: " + res.data.envelope.envelopeId);
      setFile(null);
      setReceiverEmail("");
      setReceiverName("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  //   if (!isAdmin) {
  //     return (
  //       <div className="flex h-screen items-center justify-center bg-gray-100 text-center text-xl font-semibold text-red-600">
  //         You do not have permission to access this page.
  //       </div>
  //     );
  //   }

  return (
    <div className="max-w-xl w-full mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Send Document for Signature
      </h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Document
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.docx"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
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
    </div>
  );
}

export default DocuSignForm;
