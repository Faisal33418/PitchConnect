import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();
  const { id, session_id } = router.query;
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (id && session_id) {
      axios
        .get(
          `http://localhost:8080/api/v1/pconnect-app/entrepreneur/feature-success/${id}?session_id=${session_id}`
        )
        .then(() => {
          toast.success("Your idea has been featured!");
        })
        .catch((error) => {
          console.error("Error featuring idea:", error);
          toast.error("Error processing your request.");
        });
    }
  }, [id, session_id]);

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-10 rounded-2xl shadow-xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            type: "spring",
            stiffness: 100,
          }}
          className="flex justify-center mb-4"
        >
          <CheckCircle className="text-green-400 w-16 h-16" />
        </motion.div>

        <h2 className="text-3xl font-bold">Payment Successful!</h2>
        <p className="text-gray-400 mt-2">
          Your idea has been successfully featured.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 bg-green-500 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition"
          onClick={() => router.push("/")}
        >
          Return Home
        </motion.button>
      </motion.div>
    </div>
  );
}
