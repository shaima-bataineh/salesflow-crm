import { useEffect, useState } from "react";
import { Search, Plus, Mail, Phone, Star, MoreVertical } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", company: "" });
  const [errors, setErrors] = useState({});

  // Fetch Leads from backend
  const fetchLeads = async () => {
    try {
      const { data } = await axiosInstance.get("/leads");
      value:0;
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      toast.error("Failed to fetch leads");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Validate field while typing
  const validateField = (name, value) => {
    let message = "";

    if (name === "name") {
      if (!value.trim()) message = "Name is required";
      else if (!/^[A-Za-z\s]+$/.test(value)) message = "Name must contain only letters";
    }

    if (name === "email") {
      if (!value.trim()) message = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = " email format must be example@gmail.com";
    }

    if (name === "phone") {
      if (value && !/^\d{10}$/.test(value)) message = "Phone must be exactly 10 digits";
    }

    setErrors(prev => ({ ...prev, [name]: message }));
  };

  // Add new Lead
  const handleAddLead = async (e) => {
    e.preventDefault();

    // Validate all fields on submit
    validateField("name", newLead.name);
    validateField("email", newLead.email);
    validateField("phone", newLead.phone);

    // Stop if any error exists
    if (
      (newLead.name && errors.name) ||
      (newLead.email && errors.email) ||
      (newLead.phone && errors.phone)
    ) return;

    try {
      const { data } = await axiosInstance.post("/leads", newLead);

      // Clear form
      setShowAddLeadForm(false);
      setNewLead({ name: "", email: "", phone: "", company: "" });
      setErrors({});

      // Add new lead to state
      setLeads(prev => [data, ...prev]);
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  const handleConvertLead = async (leadId) => {
    try {
      const { data } = await axiosInstance.post(
        `/leads/${leadId}/convert`,
        {
          value: 0   
        }
      );

      // Remove lead from state
      setLeads((prevLeads) =>
        prevLeads.filter((lead) => lead._id !== leadId)
      );

      toast.success("Lead converted to Customer & Deal!", {
        style: { backgroundColor: "#10b981", color: "#ffffff", fontWeight: "bold" }
      });

      setLeads(prev =>
        prev.map(l =>
          l._id === leadId ? { ...l, status: "converted" } : l
        )
      );

    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.error || "Failed to convert lead");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-orange-500";
    return "text-gray-500";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hot":
        return "text-rose-700 bg-rose-50";
      case "Warm":
        return "text-orange-700 bg-orange-50";
      case "Cold":
        return "text-blue-700 bg-blue-50";
      case "converted":
        return "text-emerald-700 bg-emerald-50";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  // فلتر على الاسم  
  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(search.toLowerCase()) 
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads Management</h1>
          <p className="text-gray-500">Track and nurture your potential customers</p>
        </div>
        <button
          onClick={() => setShowAddLeadForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="text"
              placeholder="Search by leads name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLeads.map((lead) => (
          <div
            key={lead._id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{lead.name}</h3>
                <p className="text-sm text-gray-500">{lead.company}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{lead.phone}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
            </div>

            {/* Convert Button */}
            {lead.status !== "converted" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleConvertLead(lead._id)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all text-sm font-medium"
                >
                  Convert to Customer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Lead Modal */}
      {showAddLeadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New Lead</h2>
            <form onSubmit={handleAddLead}>
              <div>
                <input
                  type="text"
                  id="lead-name"
                  placeholder="Name"
                  className="w-full mb-1 p-2 border rounded"
                  value={newLead.name}
                  onChange={(e) => {
                    setNewLead({ ...newLead, name: e.target.value });
                    validateField("name", e.target.value);
                  }}
                  required
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  id="email-lead"
                  placeholder="Email"
                  className="w-full mb-1 p-2 border rounded"
                  value={newLead.email}
                  onChange={(e) => {
                    setNewLead({ ...newLead, email: e.target.value });
                    validateField("email", e.target.value);
                  }}
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="text"
                  id="phone-lead"
                  placeholder="Phone"
                  className="w-full mb-1 p-2 border rounded"
                  value={newLead.phone}
                  onChange={(e) => {
                    setNewLead({ ...newLead, phone: e.target.value });
                    validateField("phone", e.target.value);
                  }}
                />
                {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
              </div>

              <div>
                <input
                  type="text"
                  id="lead-company"
                  placeholder="Company"
                  className="w-full mb-2 p-2 border rounded"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLeadForm(false)}
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