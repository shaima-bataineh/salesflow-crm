import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  Target,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AdminSidebar({ collapsed, setCollapsed }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeColor = "bg-emerald-500 text-white";
  const hoverColor = "hover:bg-emerald-50 hover:text-emerald-600";
  const gradientColor = "from-emerald-500 to-teal-600";

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/customers", label: "Customers", icon: UserCheck },
    { to: "/admin/leads", label: "Leads", icon: Target },
    { to: "/admin/deals", label: "Deals", icon: Briefcase },
  ];

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-sm z-40 flex items-center justify-between px-4 py-3">
        <button onClick={() => setMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-gray-800">SalesFlow</h1>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200
          flex flex-col justify-between z-50
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${gradientColor} rounded-xl flex items-center justify-center`}
              >
                <span className="text-white font-bold text-lg">sf</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">SalesFlow</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          )}

          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block">
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>

          <button onClick={() => setMobileOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {!collapsed && (
            <p className="text-xs uppercase text-gray-400 font-semibold px-4 mb-3">
              Management
            </p>
          )}

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive ? activeColor : `text-gray-600 ${hoverColor}`}`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex flex-col gap-3">
          {!collapsed && <div className="text-xs text-gray-400">© 2026 SalesFlow</div>}

          <button
            onClick={logout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-xl
              bg-gradient-to-r ${gradientColor}
              hover:opacity-90`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && "Log Out"}
          </button>
        </div>
      </aside>
    </>
  );
}