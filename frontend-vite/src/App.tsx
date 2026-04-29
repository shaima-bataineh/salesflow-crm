import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./layouts/AdminLayout";
import SalesLayout from "./layouts/SalesLayout";
import React, { useEffect, useState } from "react";
import axiosInstance from "./api/axiosInstance";
import Services from "./pages/Services";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import AdminDashboard from "./pages/Dashboard";
import SalesDashboard from "./pages/SalesDashboard";
import Users from "./pages/Users";
import Deals from "./pages/Deals";
import Leads from "./pages/Leads";
import Customers from "./pages/Customers";
import { SalesSidebar } from "./components/SalesSaidbar";

interface User {
  id: string;
  role: "admin" | "sales";
}

export default function App() {
  useEffect(() => {
    document.title = "SF - SalesFlow";
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me", { withCredentials: true });
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const ProtectedRoute = ({
    children,
    role,
  }: {
    children: React.ReactNode;
    role?: "admin" | "sales";
  }) => {
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/login" />;
    return <>{children}</>;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout currentUser={user!} />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="customers" element={<Customers />} />
          <Route path="deals" element={<Deals />} />
          <Route path="leads" element={<Leads />} />
        </Route>

        {/* Sales Routes */}
        <Route
  path="/sales"
  element={
    <ProtectedRoute role="sales">
      <SalesLayout currentUser={user!} />
    </ProtectedRoute>
  }
>
  <Route index element={<SalesDashboard />} />
  <Route path="services" element={<Services />} />
</Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}