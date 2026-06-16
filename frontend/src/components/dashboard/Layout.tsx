import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import DashboardHeader from "./DashboardHeader";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <DashboardHeader toggleSidebar={toggleSidebar} />
      <main className="pt-16 lg:ml-64 p-1 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
