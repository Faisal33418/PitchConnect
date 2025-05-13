import Link from "next/link";
import { useState, useEffect } from "react";
import { AdminItems, MenuItems } from "./menu-items/menu-items";
import { useRouter } from "next/router";
import { Chat } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import SocialDistanceIcon from "@mui/icons-material/SocialDistance";

const SideBar = () => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState<string>(router.pathname);
  const [sidebarColor, setSidebarColor] = useState<string | null>(
    typeof window !== "undefined"
      ? localStorage.getItem("sidebarColor") || "#F6F8F9"
      : "#F6F8F9"
  );
  const [activeUser, setActiveUser] = useState<any>(null);

  useEffect(() => {
    // Get initial color and dropdown states from localStorage
    if (typeof window !== "undefined") {
      setSidebarColor(localStorage.getItem("sidebarColor") || "#F6F8F9");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setActiveUser(user);
    }
  }, []);

  const handlePath = (e: React.MouseEvent, link: string) => {
    if (router.pathname === link) {
      e.preventDefault();
    } else {
      setActiveLink(link);
    }
  };

  const handleDynamicColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSidebarColor(newColor);
    localStorage.setItem("sidebarColor", newColor);
  };

  const handleResetColor = () => {
    localStorage.removeItem("sidebarColor");
    setSidebarColor("#F6F8F9");
  };

  useEffect(() => {
    const getActiveUser = () => {
      if (typeof window !== "undefined") {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setActiveUser(user);
      }
    };
    getActiveUser();
  }, []);

  return (
    <div className="">
      <Toaster />

      {/* Sidebar - now fixed on the left */}
      <div
        className="relative z-40 w-[240px] h-[90vh]  overflow-y-scroll hide-scrollbar"
        style={{
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div className="h-[calc(88vh)] overflow-y-scroll py-5 px-6 border-r flex flex-col">
          {/* Side-bar items */}
          <div className="flex flex-col justify-between items-center mt-6 w-full">
            <nav className="flex-1 -mx-3 space-y-3 w-full">
              {/* Your existing menu items rendering */}
              {activeUser?.status === "pending" ||
              activeUser?.status === "rejected" ||
              !activeUser?.status ? (
                <h3 className="mt-32 text-red-600 font-semibold">
                  You're approval still pending.
                  <br /> Request to admin for
                  <br />
                  approval.
                </h3>
              ) : (
                <div className="w-[200px] mt-2">
                  {(activeUser?.role === "Investor" ||
                    activeUser?.role === "Admin") && (
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#84919A] tracking-wide ml-4">
                        Investors
                      </span>
                    </div>
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
                          // item.title === "Contract" ||
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
                              <span className="ml-2 text-sm tracking-wide text-[#252C32] hover:text-[#0F5233] group-hover:text-[#0F5233] group-hover:font-semibold">
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
                                <span className="ml-2 text-sm tracking-wide text-[#252C32] hover:text-[#0F5233] group-hover:text-[#0F5233] group-hover:font-semibold">
                                  {item.title}
                                </span>
                              </Link>
                            )}
                        </>
                      );
                    })}
                  </div>
                  {activeUser?.role !== "Admin" && (
                    <>
                      <Link
                        onClick={() => setActiveLink("/chatScreen")}
                        className={`group flex items-center px-4 py-2 text-gray-600 rounded transition-colors duration-300 ${
                          activeLink == "/chatScreen" && "bg-gray-200"
                        } `}
                        href="/chatScreen"
                      >
                        <div className={`flex gap-3 `}>
                          <Chat className="text-gray-400" />
                          Messages
                        </div>
                      </Link>
                    </>
                  )}
                  {activeUser?.role !== "Investor" && (
                    <>
                      <Link
                        onClick={() => setActiveLink("/social-prosperity")}
                        className={`group flex items-center px-4 py-2 text-gray-600 rounded transition-colors duration-300 ${
                          activeLink == "/social-prosperity" && "bg-gray-200"
                        } `}
                        href={
                          activeUser?.role == "Admin"
                            ? "/social-data"
                            : "/social-prosperity"
                        }
                      >
                        <div className="flex gap-3">
                          <SocialDistanceIcon className="text-gray-400" />
                          Social Prosperity
                        </div>
                      </Link>
                    </>
                  )}
                  {activeUser?.role !== "Admin" && (
                    <>
                      <Link
                        onClick={() => setActiveLink("/my-contracts")}
                        className={`group flex items-center px-4 py-2 text-gray-600 rounded transition-colors duration-300 ${
                          activeLink == "/my-contracts" && "bg-gray-200"
                        } `}
                        href={"my-contracts"}
                      >
                        <div className="flex gap-3">
                          <svg
                            width="1.3rem"
                            height="1.3rem"
                            viewBox="0 0 64 64"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="12"
                              y="8"
                              width="40"
                              height="48"
                              rx="4"
                              fill="#F2F2F2"
                              stroke="#333"
                              stroke-width="2"
                            />
                            <line
                              x1="20"
                              y1="20"
                              x2="44"
                              y2="20"
                              stroke="#333"
                              stroke-width="2"
                            />
                            <line
                              x1="20"
                              y1="28"
                              x2="44"
                              y2="28"
                              stroke="#333"
                              stroke-width="2"
                            />
                            <line
                              x1="20"
                              y1="36"
                              x2="36"
                              y2="36"
                              stroke="#333"
                              stroke-width="2"
                            />
                            <path
                              d="M42 48L52 38"
                              stroke="#333"
                              stroke-width="2"
                            />
                            <path
                              d="M50 40L56 44L48 52L44 46L50 40Z"
                              fill="#4CAF50"
                              stroke="#333"
                              stroke-width="2"
                            />
                          </svg>{" "}
                          My Contracts
                        </div>
                      </Link>
                    </>
                  )}
                  {activeUser?.role == "Admin" && (
                    <>
                      <Link
                        onClick={() => setActiveLink("/send-contract")}
                        className={`group flex items-center px-4 py-2 text-gray-600 rounded transition-colors duration-300 ${
                          activeLink == "/send-contract" && "bg-gray-200"
                        } `}
                        href={"/send-contract"}
                      >
                        <div className="flex gap-3">
                          <svg
                            width="1.3rem"
                            height="1.3rem"
                            viewBox="0 0 64 64"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="12"
                              y="8"
                              width="40"
                              height="48"
                              rx="4"
                              fill="#F2F2F2"
                              stroke="#333"
                              stroke-width="2"
                            />
                            <line
                              x1="20"
                              y1="20"
                              x2="44"
                              y2="20"
                              stroke="#333"
                              stroke-width="2"
                            />
                            <line
                              x1="20"
                              y1="28"
                              x2="44"
                              y2="28"
                              stroke="#333"
                              stroke-width="2"
                            />
                            <line
                              x1="20"
                              y1="36"
                              x2="36"
                              y2="36"
                              stroke="#333"
                              stroke-width="2"
                            />
                            <path
                              d="M42 48L52 38"
                              stroke="#333"
                              stroke-width="2"
                            />
                            <path
                              d="M50 40L56 44L48 52L44 46L50 40Z"
                              fill="#4CAF50"
                              stroke="#333"
                              stroke-width="2"
                            />
                          </svg>
                          Send Contract
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Admin section */}
          {activeUser?.role === "Admin" &&
            activeUser?.status !== "pending" &&
            activeUser?.status !== "rejected" && (
              <div className="mt-auto pb-6">
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

                {/* <div className="p-4 flex">
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
                </div> */}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
