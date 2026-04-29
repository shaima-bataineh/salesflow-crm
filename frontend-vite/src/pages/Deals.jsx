import { useEffect, useState } from "react";
import { Search, Plus, Filter, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]); // قائمة العملاء
  const [search, setSearch] = useState("");
  const [showAddDealForm, setShowAddDealForm] = useState(false);
  const [newDeal, setNewDeal] = useState({ title: "", value: "", customerId: "", stage: "Discovery" });

  // Fetch Deals from backend
  const fetchDeals = async () => {
    try {
      const { data } = await axiosInstance.get("/deals");
      setDeals(data);
    } catch (err) {
      console.error("Failed to fetch deals:", err);
      toast.error("Failed to fetch deals");
    }
  };

  // Fetch Customers for select
  const fetchCustomers = async () => {
    try {
      const { data } = await axiosInstance.get("/customers");
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      toast.error("Failed to fetch customers");
    }
  };

  useEffect(() => {
    fetchDeals();
    fetchCustomers();
  }, []);

  const deleteDeal = async (id) => {
    try {
      await axiosInstance.delete(`/deals/${id}`);
      toast.success("Deal deleted successfully!");
      fetchDeals();
    } catch (err) {
      toast.error(err.response?.data?.error || "Delete failed");
    }
  };

  const handleAddDeal = async (e) => {
  e.preventDefault();

  // تحقق من الحقول المطلوبة قبل الإرسال
  if (!newDeal.title || !newDeal.value || !newDeal.leadId) {
    toast.error("Please fill in all required fields: Title, Value, Lead");
    return;
  }

  try {
    const requestData = {
      title: newDeal.title,
      value: Number(newDeal.value),     
      customer: newDeal.customerId || null, 
      lead: newDeal.leadId,              
    };

    console.log("Sending to backend:", requestData);

    await axiosInstance.post("/deals", requestData);

    toast.success("Deal added successfully!", {
      style: { backgroundColor: "#10b981", color: "#ffffff", fontWeight: "bold" }
    });

    setShowAddDealForm(false);
    setNewDeal({ title: "", value: "", customerId: "", leadId: "", stage: "Discovery" });
    fetchDeals();
  } catch (err) {
    console.log("Error response:", err.response?.data);
    toast.error(err.response?.data?.error || "Failed to add deal");
  }
};
  const getStageColor = (stage) => {
    const colors = {
      Discovery: "text-blue-700 bg-blue-50",
      Proposal: "text-purple-700 bg-purple-50",
      Negotiation: "text-orange-700 bg-orange-50",
      "Closed Won": "text-emerald-700 bg-emerald-50",
      "Closed Lost": "text-gray-700 bg-gray-100",
    };
    return colors[stage] || "text-gray-700 bg-gray-100";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "won":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "lost":
        return <XCircle className="w-5 h-5 text-gray-400" />;
      case "hot":
        return <TrendingUp className="w-5 h-5 text-rose-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const filteredDeals = deals.filter(
    (deal) =>
      deal.title.toLowerCase().includes(search.toLowerCase()) ||
      deal.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deals Pipeline</h1>
          <p className="text-gray-500">Track and manage your sales opportunities</p>
        </div>
        <button
          onClick={() => setShowAddDealForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Deal</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by deal name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Deal
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeals.map((deal) => (
                <tr key={deal._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">{getStatusIcon(deal.status)}</div>
                      <div>
                        <p className="font-semibold text-gray-900">{deal.title}</p>
                        <p className="text-sm text-gray-500">{deal.customer?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">${deal.value}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStageColor(deal.stage)}`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => deleteDeal(deal._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Deal Modal */}
      {showAddDealForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New Deal</h2>
            <form onSubmit={handleAddDeal}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="w-full mb-2 p-2 border rounded"
                value={newDeal.title}
                onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
              />
              <input
                type="number"
                name="value"
                placeholder="Value"
                className="w-full mb-2 p-2 border rounded"
                value={newDeal.value}
                onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
              />
              <select
                className="w-full mb-2 p-2 border rounded"
                value={newDeal.customerId}
                onChange={(e) => setNewDeal({ ...newDeal, customerId: e.target.value })}
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <select
                className="w-full mb-2 p-2 border rounded"
                value={newDeal.stage}
                onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
              >
                <option value="Discovery">Discovery</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="bg-emerald-500 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDealForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}