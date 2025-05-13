import Footer from "@/components/Footer";
import Navbar from "./nav-bar";
import SideBar from "./side-bar";
import React, { useState, useEffect } from "react";

import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball"; // Used as a placeholder for Dribbble

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex w-full flex-col">
      <Navbar />
      <div className="flex w-full ">
        {user && <SideBar />}
        <div className="w-full h-[90vh] overflow-y-scroll hide-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
