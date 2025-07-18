"use client";

import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AdminSidebar } from "../../components/Admin/siderbar/AdminSiderbar";

export const LayoutAdmin = () => {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
