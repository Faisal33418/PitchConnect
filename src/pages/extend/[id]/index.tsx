import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

const ExtendService = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { id } = router.query;

  const updateBid = async () => {
    if (!id) {
      toast.error("Missing entrepreneur ID");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/pconnect-app/entrepreneur/update-time/${id}`
      );

      if (response.status === 200) {
        toast.success("Service extended successfully!");
        // Optional: redirect after success
        // router.push('/success-page');
      } else {
        throw new Error("Failed to extend service");
      }
      setSuccess(true);
    } catch (error) {
      console.error("Extension error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to extend service"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-[60vh] flex items-center justify-center overflow-y-hidden bg-blue-50 overflow-hidden">
      {/* Blob Animation */}
      <motion.div
        className="absolute w-96 h-96 bg-blue-300 opacity-30 rounded-full -top-24 -left-24 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-purple-300 opacity-30 rounded-full bottom-10 right-10 blur-3xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />

      {/* Card Content */}
      <div className="relative overflow-hidden bg-white shadow-lg rounded-2xl p-8 max-w-md text-center mx-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Extend Your Service
        </h2>
        <p className="text-gray-600 mt-3">
          Continue enjoying premium benefits. Renew now to keep your access
          uninterrupted.
        </p>

        <button
          onClick={updateBid}
          disabled={loading || success}
          className={`mt-6 px-6 py-3 bg-gradient-to-r ${
            loading || success
              ? "bg-gray-400 cursor-not-allowed"
              : "from-blue-400 hover:scale-105 to-purple-400"
          } text-white font-medium rounded-lg shadow-md transition-transform duration-300`}
        >
          {loading ? "Processing..." : "Extend Now"}
        </button>
      </div>
    </div>
  );
};

export default ExtendService;
