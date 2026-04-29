import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react"; // أضف هذا

import { Search, Plus, MoreVertical, MapPin, Building2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    status: "Active",
    deals: 0,
    revenue: 0,
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, customerId: "", customerName: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  // Fetch customers
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await axiosInstance.get("/customers");
        if (Array.isArray(res.data)) {
          setCustomers(res.data);
          setFiltered(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchCustomers();
  }, []);

  useEffect(() => {
    setFiltered(
      customers.filter((c) =>
        c?.name?.toLowerCase()?.includes(search?.toLowerCase() || "")
      )
    );
  }, [search, customers]);

  // تحقق لكل حقل
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "name":
        if (!value) return "Name is required";
        if (value.length < 3) return "Name must be at least 3 characters";
        return "";
      case "email":
        if (!value) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Email must be in the format example@mail.com";
        return "";
      case "phone":
        if (!value) return "Phone is required";
        if (value.length !== 10) return "Phone must be 10 digits";
        return "";
      case "company":
        if (!value) return "Company is required";
        return "";
      case "location":
        if (!value) return "Location is required";
        return "";
      default:
        return "";
    }
  };

  // Handle input change in modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });

    // تحقق مباشر للحقل الحالي
    const error = validateField(name, value);
    setErrorMessages((prev) => ({ ...prev, [name]: error }));
  };

  // Save customer (add or update)
  const handleSaveCustomer = async () => {
    const validationErrors = {};
    Object.keys(newCustomer).forEach((key) => {
      const error = validateField(key, newCustomer[key]);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessages(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      const fieldElement = document.getElementById(firstErrorField);
      if (fieldElement) fieldElement.focus();
      return;
    }

    try {
      let res;
      if (newCustomer._id) {
        res = await axiosInstance.put(`/customers/${newCustomer._id}`, newCustomer);
        setCustomers(prev => prev.map(c => c._id === newCustomer._id ? { ...c, ...newCustomer } : c));
        setToast({ show: true, message: `Customer "${newCustomer.name}" updated successfully`, type: "success" });
      } else {
        const customerToSend = { ...newCustomer };
        delete customerToSend._id;
        res = await axiosInstance.post("/customers", customerToSend);
        setCustomers([res.data, ...customers]);
        setToast({ show: true, message: `Customer "${newCustomer.name}" added successfully`, type: "success" });
      }

      setShowModal(false);
      setNewCustomer({
        _id: "",
        name: "",
        email: "",
        phone: "",
        company: "",
        location: "",
        status: "Active",
        deals: 0,
        revenue: 0,
      });
      setErrorMessages({});
      setTimeout(() => setToast({ ...toast, show: false }), 3000);

    } catch (err) {
      console.error("Save customer failed:", err.response?.data || err.message);
      setToast({ show: true, message: err.response?.data?.error || "Error saving customer", type: "error" });
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
    }
  };

  // Edit customer
  const handleEdit = (customer) => {
    setIsEditing(true);
    setNewCustomer({ ...customer });
    setShowModal(true);
    setOpenMenuId(null);
  };

  // Open confirm delete modal
  const confirmDeleteCustomer = (customer) => {
    setConfirmDelete({ show: true, customerId: customer._id, customerName: customer.name });
    setOpenMenuId(null);
  };

  // Delete confirmed
  const handleDeleteConfirmed = async () => {
    try {
      await axiosInstance.delete(`/customers/${confirmDelete.customerId}`);
      setCustomers(customers.filter(c => c._id !== confirmDelete.customerId));
      setToast({ show: true, message: `Customer "${confirmDelete.customerName}" deleted successfully`, type: "success" });
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: err.response?.data?.error || "Error deleting customer", type: "error" });
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
    } finally {
      setConfirmDelete({ show: false, customerId: "", customerName: "" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
          <p className="text-gray-500">Manage and track your customer relationships</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setIsEditing(false); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((customer) => (
          <div key={customer._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
            <div className="flex items-start justify-between mb-4 relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {customer.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
                  <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    <Building2 className="w-3 h-3" />
                    {customer.company || "No Company"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleMenu(customer._id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
              {openMenuId === customer._id && (
                <div className="absolute right-2 top-10 bg-white border rounded shadow-md z-50">
                  <button onClick={() => handleEdit(customer)} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Edit</button>
                  <button onClick={() => confirmDeleteCustomer(customer)} className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600">Delete</button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{customer.location || ""}</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {customer.email}
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Deals</p>
                  <p className="font-bold text-gray-900">{customer.deals || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="font-bold text-emerald-600">${customer.revenue || 0}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  customer.status === "Active" ? "text-emerald-700 bg-emerald-50" :
                  customer.status === "Prospect" ? "text-orange-700 bg-orange-50" :
                  "text-gray-700 bg-gray-100"
                }`}>
                  {customer.status || "Active"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Customer" : "Add Customer"}</h2>
            <div className="space-y-3">
              {["name","email","phone","company","location"].map((field) => (
                <div key={field}>
                  <input
                    name={field}
                    id={field}
                    value={newCustomer[field]}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                  {errorMessages[field] && <p className="text-red-500 text-sm mt-1">{errorMessages[field]}</p>}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button onClick={handleSaveCustomer} className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete <span className="font-semibold">{confirmDelete.customerName}</span>?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setConfirmDelete({ show: false, customerId: "", customerName: "" })} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button onClick={handleDeleteConfirmed} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
  <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-white ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
    {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
    <span>{toast.message}</span>
  </div>
)}
    </div>
  );
}