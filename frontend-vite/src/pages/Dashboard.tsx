import { StatCard } from '../components/StatCard';
import { Users, UserCheck, Briefcase, TrendingUp, DollarSign, Target } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const filteredMonthStats = selectedMonth
    ? stats?.monthlyStats?.find((m: any) => m.month === selectedMonth)
    : null;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      }
    };
    fetchDashboard();
  }, []);

  if (!stats)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading Dashboard...</p>
      </div>
    );

  const isAdmin = stats.role === "admin";
  const primaryColor = "#10b981";

  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      trend: "up" as const,
      trendValue: "0%",
      show: isAdmin,
    },
    {
      title: "Total Customers",
      value: filteredMonthStats?.customers || stats.totalCustomers,
      icon: UserCheck,
      color: "bg-purple-500",
      trend: "up" as const,
      trendValue: "0%",
      show: true,
    },
    {
      title: "Total Deals",
      value: filteredMonthStats?.deals || stats.totalDeals,
      icon: Briefcase,
      color: "bg-orange-500",
      trend: "up" as const,
      trendValue: "0%",
      show: true,
    },
    {
      title: "Pending Deals",
      value: filteredMonthStats?.pendingDeals || stats.pendingDeals,
      icon: TrendingUp,
      color: "bg-yellow-500",
      trend: "up" as const,
      trendValue: "0%",
      show: true,
    },
    {
      title: "Revenue",
      value: `$${(
        filteredMonthStats?.revenue || stats.totalRevenue
      ).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-500",
      trend: "up" as const,
      trendValue: "0%",
      show: true,
    },
    {
      title: "Total Leads",
      value: filteredMonthStats?.leads || stats.totalLeads,
      icon: Target,
      color: "bg-pink-500",
      trend: "up" as const,
      trendValue: "0%",
      show: true,
    },
  ].filter((stat) => stat.show);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border">
          <p className="font-semibold text-sm mb-1">{label}</p>
          {payload.map((item: any) => (
            <p key={item.dataKey} className="text-sm">
              {item.dataKey}: ${Number(item.value).toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Welcome back! Here’s your system summary
            </p>
          </div>

          {selectedMonth && (
            <button
              className="px-4 py-2 text-sm sm:text-base text-white rounded-xl
              bg-emerald-500 hover:bg-emerald-600 transition shadow-md"
              onClick={() => setSelectedMonth(null)}
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border">
          <p className="text-sm sm:text-base text-gray-600">
            You are logged in as{" "}
            <span className="font-semibold text-emerald-600">
              {isAdmin ? "Administrator" : "Sales User"}
            </span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Deals Chart */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Monthly Deals
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={stats.monthlyStats}
                onClick={(e: any) => {
                  if (e?.activeLabel) setSelectedMonth(e.activeLabel);
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="deals"
                  stroke={primaryColor}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Monthly Revenue
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={stats.monthlyStats}
                onClick={(e: any) => {
                  if (e?.activeLabel) setSelectedMonth(e.activeLabel);
                }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={primaryColor}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}