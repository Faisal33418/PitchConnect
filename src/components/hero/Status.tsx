import { MenuItems } from "@/layout/menu-items/menu-items";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ApprovalStatus = () => {
  const router = useRouter();

  const [activeUser, setActiveUser] = useState(null);
  const [activeLink, setActiveLink] = useState<string>(router.pathname);

  const [sidebarColor, setSidebarColor] = useState(
    localStorage.getItem("sidebarColor") || "#F6F8F9"
  );
  useEffect(() => {
    // Get initial color and dropdown states from localStorage
    setSidebarColor(localStorage.getItem("sidebarColor") || "#F6F8F9");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setActiveUser(user);
  }, []);

  const handlePath = (e: React.MouseEvent, link: string) => {
    if (router.pathname === link) {
      e.preventDefault();
    } else {
      setActiveLink(link); // Set the clicked link as active
    }
  };

  return (
    <>
      {activeUser?.status === "pending" ||
      activeUser?.status === "rejected" ||
      !activeUser?.status ? (
        <>
          <h3 className=" text-red-600 font-semibold">
            You're approval still pending. Request to admin for approval.
          </h3>
        </>
      ) : (
        <>
          <div className="w-[200px] mt-2">
            {/* Dropdown Header */}
            {/* <button
                                              className="w-full flex justify-between items-center px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                                              onClick={handleDropDown}
                                          >
                                              <span className="text-sm font-semibold">Idea Pitch Room</span>
                                              <svg
                                                  className={`w-5 h-5 transform transition-transform duration-300 ${(isOpen) ? 'rotate-180' : 'rotate-0'}`}
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  viewBox="0 0 20 20"
                                                  fill="currentColor"
                                              >
                                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                              </svg>
                                          </button> */}
            {/* Dropdown Items */}
            {/* {(isOpen) && (
                                              <> */}
            {/* Confirming Investor */}
            {(activeUser?.role === "Investor" ||
              activeUser?.role === "Admin") && (
              <span className="text-[12px] text-[#84919A] tracking-wide ml-4">
                Investors
              </span>
            )}
            <div className="mt-2 space-y-1">
              {MenuItems?.map((item, key) => {
                const showItem =
                  (item.title === "All Pitches" &&
                    (activeUser?.role === "Investor" ||
                      activeUser?.role === "Admin")) ||
                  ((item.title === "Entrepreneur Profile" ||
                    item.title === "Idea Pitches" ||
                    item.title === "Featured Ideas" ||
                    item.title === "Social Properity" ||
                    item.title === "Interprated Communication") &&
                    (activeUser?.role === "Entrepreneur" ||
                      activeUser?.role === "Admin"));
                if (!showItem) return null;

                return (
                  <>
                    {(activeUser?.role === "Entrepreneur" ||
                      activeUser?.role === "Admin") &&
                      item.title === "Idea Pitches" && (
                        <span className="text-[12px] text-[#84919A] tracking-wide ml-4">
                          Entrepreneurs
                        </span>
                      )}
                    {activeUser?.role !== "Admin" &&
                    item.title !== "Idea Pitches" ? (
                      <></>
                    ) : (
                      <Link
                        key={key}
                        className={`group flex items-center px-4 py-2 text-gray-600 rounded transition-colors duration-300 ${
                          activeLink === item.link
                            ? "bg-[#DFE9E6]"
                            : "hover:bg-[#DFE9E6]"
                        }`}
                        href={item.link}
                        onClick={(e) => handlePath(e, item.link)}
                      >
                        {item.icon}
                        <span
                          className={`ml-2 text-sm tracking-wide text-[#252C32] hover:text-[#0F5233] group-hover:text-[#0F5233] group-hover:font-semibold`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    )}
                    {activeUser?.role === "Investor" &&
                      activeUser?.role !== "Admin" &&
                      item.title === "All Pitches" && (
                        <Link
                          key={key}
                          className={`group flex items-center px-4 py-2 text-gray-600 rounded transition-colors duration-300 ${
                            activeLink === item.link
                              ? "bg-[#DFE9E6]"
                              : "hover:bg-[#DFE9E6]"
                          }`}
                          href={item.link}
                          onClick={(e) => handlePath(e, item.link)}
                        >
                          {item.icon}
                          <span
                            className={`ml-2 text-sm tracking-wide text-[#252C32] hover:text-[#0F5233] group-hover:text-[#0F5233] group-hover:font-semibold`}
                          >
                            {item.title}
                          </span>
                        </Link>
                      )}
                  </>
                );
              })}
            </div>
            {/* </>
                                          )} */}
          </div>
        </>
      )}
    </>
  );
};

export default ApprovalStatus;
