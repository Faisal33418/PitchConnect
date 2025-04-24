import React, { useState, useEffect } from "react";
import APIs from "@/utils/api-handler";
import { PlayCircleOutline, DownloadOutlined, Star } from "@mui/icons-material"; // MUI Icons
import { Modal } from "@mui/material"; // Modal from MUI
import moment from "moment";
import axios from "axios";
import BidModal from "./BidModal";
import ChatModel from "./ChatModel";

const CountdownTimer = ({ featureTime, entrepreneurId }) => {
  const calculateTimeLeft = () => {
    const difference = moment(featureTime).valueOf() - Date.now();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return null;
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (!newTimeLeft) {
        clearInterval(timer);
        removeFeature();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [featureTime]);

  const removeFeature = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/v1/pconnect-app/entrepreneur/remove-featured/${entrepreneurId}`
      );

      console.log("Feature removed successfully.");
    } catch (error) {
      console.error("Failed to remove feature:", error);
    }
  };

  return (
    <div className="text-red-500 text-sm font-bold">
      {timeLeft
        ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
        : "Feature Expired"}
    </div>
  );
};

const FindEntrepreneurs = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const placeholderImage = "/find-entrepreneur/no-media-found.png";

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      const token = localStorage.getItem("token");
      const endPoint = "entrepreneur/find";
      const headers = { Authorization: `Bearer ${token}` };

      const apiResponse = await APIs(
        endPoint,
        null,
        "GET",
        headers,
        null,
        false
      );
      if (apiResponse?.status === 200) {
        const sortedEntrepreneurs = apiResponse.data.data.sort(
          (a, b) => b.featured - a.featured
        );
        setEntrepreneurs(sortedEntrepreneurs);
      } else {
        console.error("Failed to fetch entrepreneurs");
      }
    };
    fetchEntrepreneurs();
  }, []);

  useEffect(() => {
    console.log("useEffect triggered"); // Log to check if the effect runs

    const sendMail = async () => {
      console.log("Attempting to send mail..."); // Debugging log
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/pconnect-app/entrepreneur/send-mail"
        );
        console.log("Feature removed successfully:", response.data);
      } catch (error) {
        console.error("Failed to remove feature:", error);
      }
    };
    const removeIdea = async () => {
      console.log("Attempting to send mail..."); // Debugging log
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/pconnect-app/entrepreneur/delete-idea"
        );
        console.log("Deleting Idea", response.data);
      } catch (error) {
        console.error("Failed to delete:", error);
      }
    };

    sendMail();
    removeIdea();
  }, []);

  const filteredCompanies = entrepreneurs
    .flatMap((entrepreneur) =>
      entrepreneur.companies.map((company) => ({
        ...company,
        entrepreneurName: entrepreneur.fullName,
        entrepreneurProfilePicture: entrepreneur.profilePicture,
      }))
    )
    .filter((company) =>
      company.pitchTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleOpenModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-2xl text-center font-bold mb-6">
        Find Your Entrepreneur
      </h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by Business Title"
          className="border border-gray-300 p-3 rounded-lg w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Companies List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredCompanies.map((company, index) => (
          <div
            key={company._id}
            className="bg-white p-6 rounded-lg shadow-md relative"
          >
            {entrepreneurs[index]?.featured &&
            entrepreneurs[index]?.featured !== undefined ? (
              <div className="flex w-max ☻2 items-center ms-auto">
                <Star
                  sx={{
                    color: "gold",
                    // position: "absolute",
                    // top: "5px",
                    // right: "5px",
                  }}
                />
                <h4 className="text-sm text-yellow-400 font-semibold">
                  Featured
                </h4>
              </div>
            ) : (
              ""
            )}
            <div
              className="group relative"
              onMouseEnter={() =>
                setHoveredVideoId(company.videoImages[0]?._id)
              }
              onMouseLeave={() => setHoveredVideoId(null)}
            >
              <img
                src={
                  company.videoImages[0]?.logoBanner[0]
                    ? `${process.env.NEXT_PUBLIC_HOSTNAME}${company.videoImages[0]?.logoBanner[0]}`
                    : placeholderImage
                }
                alt="Banner"
                className="h-48 rounded-lg w-full object-cover"
              />
              {hoveredVideoId === company.videoImages[0]?._id && (
                <PlayCircleOutline
                  fontSize="large"
                  className="m-auto text-white absolute cursor-pointer group-hover:opacity-100 inset-0 opacity-80"
                  onClick={() =>
                    company.videoImages[0] &&
                    window.open(
                      `${process.env.NEXT_PUBLIC_HOSTNAME}${company.videoImages[0]?.video[0]}`,
                      "_blank"
                    )
                  }
                />
              )}
            </div>

            {/* Company Info */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">
                {company.pitchTitle || "No Title"}
              </h3>
              <p className="text-gray-600">
                {company.shortSummary || "No summary available"}
              </p>
              <p className="text-green-500 font-bold">
                Investment Range: {company.investmentRange || "N/A"}
              </p>
              <button
                className="flex text-blue-500 w-full items-center mt-2"
                onClick={() => handleOpenModal(company)}
              >
                <div className="flex justify-between w-full items-center">
                  <div className="flex flex-col">
                    <div className="flex">
                      Read More <PlayCircleOutline className="ml-2" />
                    </div>
                  </div>
                  {entrepreneurs[index]?.featured &&
                  entrepreneurs[index]?.featured !== undefined ? (
                    <CountdownTimer
                      featureTime={entrepreneurs[index]?.featureTime}
                      entrepreneurId={entrepreneurs[index]?._id} // Pass entrepreneur ID
                    />
                  ) : (
                    ""
                  )}
                </div>
              </button>
              <div className="flex items-center my-2 gap-2">
                {JSON.parse(localStorage.getItem("user"))?.role !== "Admin" && (
                  <BidModal id={entrepreneurs[index]?._id} />
                )}

                {JSON.parse(localStorage.getItem("user"))?.role !== "Admin" &&
                  entrepreneurs[index]?.bid?.investor === user?._id && (
                    <ChatModel
                      receiver={entrepreneurs[index]?._id}
                      name={entrepreneurs[index]?.fullName}
                      image={entrepreneurs[index]?.profilePicture?.[0]}
                    />
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Company Details */}
      {selectedCompany && (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <div className="bg-white p-8 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              {selectedCompany.pitchTitle}
            </h2>
            <p>
              <strong>Entrepreneur:</strong> {selectedCompany.entrepreneurName}
            </p>
            <p>
              <strong>Summary:</strong> {selectedCompany.shortSummary || "N/A"}
            </p>
            <p>
              <strong>Investment Range:</strong>{" "}
              {selectedCompany.investmentRange || "N/A"}
            </p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Documents</h3>
              {selectedCompany.documents?.length > 0 ? (
                selectedCompany.documents.map((doc) => (
                  <div key={doc._id} className="flex gap-2 items-center mt-2">
                    {doc.documents.map((file) => (
                      <div key={file} className="flex group relative">
                        <span className="flex gap-2">
                          <a
                            href={`${process.env.NEXT_PUBLIC_HOSTNAME}${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                          >
                            {file.split(".").pop().toUpperCase()} Document
                          </a>
                          <DownloadOutlined
                            className="text-gray-400 cursor-pointer group-hover:text-blue-500"
                            onClick={() =>
                              window.open(
                                `${process.env.NEXT_PUBLIC_HOSTNAME}${file}`,
                                "_blank"
                              )
                            }
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p>No documents available</p>
              )}
            </div>
            <center>
              <button
                className="bg-red-500 rounded text-white w-24 mt-4 py-2"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </center>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FindEntrepreneurs;
