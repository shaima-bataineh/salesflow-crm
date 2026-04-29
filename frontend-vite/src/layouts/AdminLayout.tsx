import { Outlet } from "react-router-dom";
import { useState } from "react";
import { AdminSidebar } from "../components/AdminSidebar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}