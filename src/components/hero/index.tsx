import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NotificationsActive } from "@mui/icons-material";
import ApprovalStatus from "./Status";
import axios from "axios";
const HeroSection = () => {
  const [user, setUser] = useState(null);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user"));
    setUser(getUser);
  }, []);

  const toggleApprovalMessage = () => {
    setShowApprovalMessage(!showApprovalMessage);
  };

  return (
    <>
      {/* Admin Section */}
      {user?.role === "Admin" ? (
        <section className=" text-white bg-gradient-to-r from-[#141619] via-[#202E3A] to-[#050A44] overflow-hidden py-32 relative ">
          {/* Animated Shapes */}
          <div className="h-full w-full absolute left-0 overflow-hidden top-0">
            <div className="bg-purple-500 h-64 rounded-full w-64 -left-16 -top-16 absolute animate-float opacity-20"></div>
            <div className="bg-blue-500 h-48 rounded-full w-48 absolute animate-float-reverse opacity-20 right-32 top-32"></div>
            <div className="bg-indigo-500 h-32 rounded-full w-32 absolute animate-float bottom-16 left-48 opacity-20"></div>
          </div>

          <div className="container lg:px-8 mx-auto px-6 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold leading-tight lg:text-6xl mb-6">
                ADMIN PANEL: MANAGE USERS OPERATIONS EFFICIENTLY.
              </h1>
              <p className="text-lg lg:text-xl max-w-2xl mb-8 mx-auto">
                Gain insights, control access, and streamline workflows for
                optimal performance.
              </p>
            </div>
          </div>
        </section>
      ) : (
        /* User Section */
        <section className=" text-white  overflow-hidden py-32 relative bg-gradient-to-r from-[#141619] via-[#202E3A] to-[#050A44]">
          {/* Animated Shapes */}
          <div className="h-full w-full absolute left-0 overflow-hidden top-0">
            <div className="bg-teal-400 h-64 rounded-full w-64 -left-16 -top-16 absolute animate-float opacity-20"></div>
            <div className="bg-emerald-400 h-48 rounded-full w-48 absolute animate-float-reverse opacity-20 right-32 top-32"></div>
            <div className="bg-green-400 h-32 rounded-full w-32 absolute animate-float bottom-16 left-48 opacity-20"></div>
          </div>

          <div className="container lg:px-8 mx-auto px-6 relative z-10">
            <div className="text-center">
              {user?.role === "Entrepreneur" ? (
                <>
                  <h1 className="text-4xl font-bold leading-tight lg:text-6xl mb-6">
                    EMPOWERING ENTREPRENEURS TO TURN INNOVATIVE IDEAS INTO
                    REALITY.
                  </h1>
                  <p className="text-lg lg:text-xl max-w-2xl mb-8 mx-auto">
                    Connect with investors, pitch your vision, and take the next
                    step toward success.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold leading-tight lg:text-6xl mb-6 uppercase">
                    Discover startups, invest smartly, and shape the future.
                  </h1>
                  <p className="text-lg lg:text-xl max-w-2xl mb-8 mx-auto">
                    Connect with entrepreneurs, evaluate their visions, and
                    drive the future of successful innovations.
                  </p>
                </>
              )}
              <div className="flex justify-center space-x-4">
                {user?.status == "pending" ? (
                  <></>
                ) : (
                  <>
                    <Link
                      href={
                        user?.role === "Entrepreneur"
                          ? "/entrepreneur-business"
                          : user?.role === "Investor"
                          ? "/find-entrepreneurs"
                          : "/entrepreneur-business"
                      }
                    >
                      <button className="bg-white rounded-lg shadow-lg text-green-600 duration-300 hover:bg-gray-100 hover:shadow-xl px-6 py-3 transition-all">
                        Start Your Journey
                      </button>
                    </Link>
                  </>
                )}

                {/* Bell Icon for Approval Message */}
                <div className="relative">
                  <button
                    onClick={toggleApprovalMessage}
                    className="bg-white p-3 rounded-lg shadow-lg text-green-600 duration-300 hover:bg-gray-100 hover:shadow-xl transition-all"
                  >
                    <NotificationsActive className="text-2xl" />
                  </button>
                  {/* Approval Message Dropdown */}
                  {showApprovalMessage && (
                    <div className="bg-white p-4 rounded-lg shadow-lg text-green-600 w-64 absolute right-0 translate-x-[100%] z-50">
                      <h1>Hello</h1>
                      {/* <p className="text-sm">Your account has been approved!</p> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Add custom animations to the styles */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(20px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }

        @keyframes float-reverse {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(20px) translateX(-20px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default HeroSection;
