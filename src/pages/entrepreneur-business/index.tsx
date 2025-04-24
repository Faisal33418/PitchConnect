import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState, useEffect } from "react";
import CompanyInfo from "../company-info";
import DocumentUpload from "../document-upload";
import VideoImage from "../video-image";
import { toast } from "react-toastify";

const EntrepreneurBusiness = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTxt, setSearchTxt] = useState("");
  const [getUser, setGetUser] = useState(null);
  const [errors, setErrors] = useState({}); // Stores validation errors

  // Fetch user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setGetUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Function to validate search input
  const validateSearchInput = (text) => {
    const searchPattern = /^[a-zA-Z0-9\s@.]*$/;
    return searchPattern.test(text);
  };

  // Handle search input change with validation
  const handleSearchChange = (e) => {
    const text = e.target.value;
    if (validateSearchInput(text)) {
      setSearchTxt(text);
      setErrors((prev) => ({ ...prev, search: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        search: "Invalid characters in search.",
      }));
    }
  };

  // Validate form fields dynamically
  const validateField = (name, value, type) => {
    let errorMessage = "";

    if (type === "text" && !/^[a-zA-Z\s]+$/.test(value)) {
      errorMessage = "Only letters are allowed.";
    } else if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorMessage = "Invalid email format.";
    } else if (type === "number" && isNaN(value)) {
      errorMessage = "Only numbers are allowed.";
    } else if (value.trim() === "") {
      errorMessage = "This field is required.";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  // Toggle accordion sections
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full z-30 relative mx-auto p-10 pt-6  bg-gradient-to-r from-[#141619] via-[#202E3A] to-[#050A44] min-h-screen">
      {/* Search Bar */}
      <form className="mb-10 z-10">
        <div className="flex flex-col max-w-md mx-auto">
          <div className="flex border-2 border-blue-500 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <input
              type="text"
              value={searchTxt}
              onChange={handleSearchChange}
              placeholder={`Search by pitchTitle ${
                getUser?.role === "Admin" ? "or entrepreneur email" : ""
              }...`}
              className="w-full outline-none bg-white text-gray-600 text-md px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.search && (
            <p className="text-red-500 text-sm mt-1">{errors.search}</p>
          )}
        </div>
      </form>

      {/* Accordion for CompanyInfo */}
      <div className="border-b border-gray-300 mb-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <button
          className="w-full flex justify-between items-center text-left px-6 py-4 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 focus:outline-none rounded-t-lg"
          onClick={() => toggleAccordion(0)}
        >
          <span className="text-lg font-semibold text-gray-700">
            Company Info
          </span>
          {activeIndex === 0 ? (
            <KeyboardArrowUpIcon className="text-gray-600" />
          ) : (
            <KeyboardArrowDownIcon className="text-gray-600" />
          )}
        </button>
        {activeIndex === 0 && (
          <div className="p-6 w-[80vw] mx-auto">
            <CompanyInfo validateField={validateField} errors={errors} />
          </div>
        )}
      </div>

      {/* Accordion for DocumentUpload */}
      <div className="border-b border-gray-300 mb-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <button
          className="w-full flex justify-between items-center text-left px-6 py-4 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 focus:outline-none rounded-t-lg"
          onClick={() => toggleAccordion(1)}
        >
          <span className="text-lg font-semibold text-gray-700">
            Document Upload
          </span>
          {activeIndex === 1 ? (
            <KeyboardArrowUpIcon className="text-gray-600" />
          ) : (
            <KeyboardArrowDownIcon className="text-gray-600" />
          )}
        </button>
        {activeIndex === 1 && (
          <div className="p-6 mx-auto">
            <DocumentUpload validateField={validateField} errors={errors} />
          </div>
        )}
      </div>

      {/* Accordion for VideoImage */}
      <div className="border-b border-gray-300 mb-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <button
          className="w-full flex justify-between items-center text-left px-6 py-4 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 focus:outline-none rounded-t-lg"
          onClick={() => toggleAccordion(2)}
        >
          <span className="text-lg font-semibold text-gray-700">
            Video/Image
          </span>
          {activeIndex === 2 ? (
            <KeyboardArrowUpIcon className="text-gray-600" />
          ) : (
            <KeyboardArrowDownIcon className="text-gray-600" />
          )}
        </button>
        {activeIndex === 2 && (
          <div className="p-6 mx-auto">
            <VideoImage validateField={validateField} errors={errors} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EntrepreneurBusiness;
