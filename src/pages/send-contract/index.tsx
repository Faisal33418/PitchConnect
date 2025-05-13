// src/components/MultiContractForm.js
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const MultiContractForm = () => {
  const [formData, setFormData] = useState({
    investorEmails: "",
    entrepreneurEmails: "",
    contractFile: null,
    contractName: "",
    terms: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      contractFile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formDataToSend = new FormData();

      // Process investor emails
      const investorEmails = formData.investorEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      // Process entrepreneur emails
      const entrepreneurEmails = formData.entrepreneurEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      // Validate at least one email exists
      if (investorEmails.length === 0 && entrepreneurEmails.length === 0) {
        throw new Error(
          "Please enter at least one investor or entrepreneur email"
        );
      }

      formDataToSend.append("investorEmails", JSON.stringify(investorEmails));
      formDataToSend.append(
        "entrepreneurEmails",
        JSON.stringify(entrepreneurEmails)
      );
      formDataToSend.append("contractName", formData.contractName);
      formDataToSend.append("terms", formData.terms);

      if (formData.contractFile) {
        formDataToSend.append("contractFile", formData.contractFile);
      }

      const response = await axios.post(
        "http://localhost:8080/api/contracts/multi",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        `Contract sent successfully to ${response.data.sentCount} recipients!`
      );
      setFormData({
        investorEmails: "",
        entrepreneurEmails: "",
        contractFile: null,
        contractName: "",
        terms: "",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Error sending contracts"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Send Contract to Multiple Recipients
      </h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="investorEmails">
            Investor Email
          </label>
          <textarea
            id="investorEmails"
            name="investorEmails"
            value={formData.investorEmails}
            onChange={handleChange}
            placeholder="investor1@example.com"
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label
            className="block text-gray-700 mb-2"
            htmlFor="entrepreneurEmails"
          >
            Entrepreneur Email
          </label>
          <textarea
            id="entrepreneurEmails"
            name="entrepreneurEmails"
            value={formData.entrepreneurEmails}
            onChange={handleChange}
            placeholder="founder1@example.com"
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="contractName">
            Contract Name
          </label>
          <input
            type="text"
            id="contractName"
            name="contractName"
            value={formData.contractName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="terms">
            Terms and Conditions
          </label>
          <textarea
            id="terms"
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="contractFile">
            Contract Document (PDF/DOCX)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="contractFile"
              name="contractFile"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#AF9F91] text-white py-2 px-4 rounded-md hover:bg-[#AF9F91] focus:outline-none focus:ring-2 focus:ring-[#AF9F91] focus:ring-offset-2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Sending..." : "Send to All Recipients"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiContractForm;
