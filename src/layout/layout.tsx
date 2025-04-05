import Footer from "@/components/Footer";
import Navbar from "./nav-bar";
import SideBar from "./side-bar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="flex w-full flex-col">
        <Navbar />
        <div className="flex w-full">
          <SideBar />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
