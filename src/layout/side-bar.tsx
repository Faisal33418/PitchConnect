import Link from "next/link";
import { useState, useEffect } from "react";
import { AdminItems, MenuItems } from "./menu-items/menu-items";
import { useRouter } from "next/router";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import toast, { Toaster } from "react-hot-toast";
import APIs from "@/utils/api-handler";

const SideBar = () => {
  const router = useRouter();

  const [activeLink, setActiveLink] = useState<string>(router.pathname);
  const [sidebarColor, setSidebarColor] = useState<string | null>(
    localStorage.getItem("sidebarColor") || "#F6F8F9"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeUser, setActiveUser] = useState(null);
  const [authId, setAuthId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDropDown = () => setIsOpen(!isOpen);

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

  // Dynamic color handlergin
  const handleDynamicColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSidebarColor(newColor);
    localStorage.setItem("sidebarColor", newColor);
  };

  // Reset dynamic color
  const handleResetColor = () => {
    localStorage.removeItem("sidebarColor");
    setSidebarColor("#F6F8F9"); // Reset to default color
  };
  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar state
  };

  useEffect(() => {
    const getActiveUser = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setActiveUser(user);
    };
    getActiveUser();
  }, []);

  return (
    <div className="">
      <Toaster />
      <div className="sticky top-0 h-[calc(100vh-65px)]">
        {/* Sidebar container */}
        <aside
          className={`border transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-[240px]" : "w-0"
          } overflow-hidden h-[100vh] px-6 border-r rtl:border-r-0 rtl:border-l flex border`}
          style={{ backgroundColor: sidebarColor }}
        >
          {/* Side-bar items */}
          <div
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } flex flex-col justify-between items-center mt-6 fixed`}
          >
            <nav className="flex-1 -mx-3 space-y-3">
              {/* Confirming status logics */}
              {activeUser?.status === "pending" ||
              activeUser?.status === "rejected" ||
              !activeUser?.status ? (
                <>
                  <h3 className="mt-32 text-red-600 font-semibold">
                    You're approval still pending.
                    <br /> Request to admin for
                    <br />
                    approval.
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
                      {MenuItems.map((item, key) => {
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
            </nav>
          </div>

          {/* Confirming admin role and status */}
          {activeUser?.role === "Admin" ? (
            activeUser?.status === "pending" ||
            activeUser?.status === "rejected" ? (
              ""
            ) : (
              <>
                {/* Admin side-bar items */}
                <div
                  className={`${
                    isSidebarOpen ? "block" : "hidden"
                  } fixed top-[440px]`}
                >
                  <hr className="mt-6 mb-6" />
                  <span className="text-[12px] text-[#84919A] tracking-wide">
                    Admin
                  </span>
                  <div className="mt-2">
                    {AdminItems.map((item, key) => (
                      <Link
                        className={`group flex px-3 h-8 ml-[-10px] w-[208px] rounded text-gray-600 transition-colors duration-300 ${
                          activeLink === item.link
                            ? "bg-[#DFE9E6]"
                            : "hover:bg-[#DFE9E6]"
                        }`}
                        href={item.link}
                        onClick={(e) => handlePath(e, item.link)}
                        key={key}
                      >
                        <span className="ml-[-6px] mt-[4.8px] flex">
                          {item.icon}
                          <span className="text-sm font-small tracking-wide text-[#252C32] hover:text-[#0F5233] group-hover:text-[#0F5233] group-hover:font-semibold mx-2">
                            {item.title}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Color picker and reset button */}
                  <div className="p-4 flex">
                    <input
                      type="color"
                      placeholder="dynamic layout"
                      className="hover:cursor-pointer hover:border hover:border-black hover:rounded-xl w-14"
                      onChange={handleDynamicColor}
                    />
                    <button
                      className="ml-4 font-semibold text-sm text-gray-400 hover:cursor-pointer hover:font-extrabold"
                      onClick={handleResetColor}
                    >
                      Reset Color
                    </button>
                  </div>
                </div>
              </>
            )
          ) : (
            ""
          )}
        </aside>

        {/* Sidebar toggle button */}
        <button
          className="fixed top-[69px] left-3 transition"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <ArrowCircleLeftIcon /> : <ArrowCircleRightIcon />}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
