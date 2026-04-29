import { Outlet } from "react-router-dom";
import { useState } from "react";
import { SalesSidebar } from "../components/SalesSaidbar"; // استدعاء السايدبار الجديد


export default function SalesLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SalesSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}