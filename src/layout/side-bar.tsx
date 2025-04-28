import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AdminItems, MenuItems } from "./menu-items/menu-items";
import { useRouter } from "next/router";
import MenuIcon from "@mui/icons-material/Menu";
import toast, { Toaster } from "react-hot-toast";
import { Chat } from "@mui/icons-material";

const SideBar = () => {
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const [activeLink, setActiveLink] = useState<string>(router.pathname);
  const [sidebarColor, setSidebarColor] = useState<string | null>(
    typeof window !== "undefined"
      ? localStorage.getItem("sidebarColor") || "#F6F8F9"
      : "#F6F8F9"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Get initial color and dropdown states from localStorage
    if (typeof window !== "undefined") {
      setSidebarColor(localStorage.getItem("sidebarColor") || "#F6F8F9");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setActiveUser(user);
    }

    // Close sidebar when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePath = (e: React.MouseEvent, link: string) => {
    if (router.pathname === link) {
      e.preventDefault();
    } else {
      setActiveLink(link);
      setIsSidebarOpen(false);
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

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Calculate offset between mouse position and element position
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
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

      {/* Draggable Trigger Icon */}
      <div
        ref={triggerRef}
        className="fixed z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg cursor-move hover:bg-gray-100 transition-all"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isSidebarOpen ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          // Only toggle if not dragging
          if (
            Math.abs(e.clientX - (position.x + dragOffset.x)) < 5 &&
            Math.abs(e.clientY - (position.y + dragOffset.y)) < 5
          ) {
            setIsSidebarOpen(!isSidebarOpen);
          }
        }}
      >
        <MenuIcon className="text-gray-600" />
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed z-40 rounded-xl transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-[240px] opacity-100" : "w-0 opacity-0"
        } overflow-hidden`}
        style={{
          backgroundColor: sidebarColor,
          left: `${position.x + 50}px`,
          top: `${position.y}px`,
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div className="h-[max-content] py-5  px-6 border-r flex flex-col">
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
                          item.title === "Contract" ||
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
                    <Link
                      className="group flex items-center px-4 py-2 text-gray-600 rounded transition-colors duration-300"
                      href="/chatScreen"
                    >
                      <div className="flex gap-3">
                        <Chat className="text-gray-400" />
                        Messages
                      </div>
                    </Link>
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
            )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
