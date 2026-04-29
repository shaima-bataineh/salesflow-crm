import { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, Search, Plus, MoreVertical, Mail, Phone } from "lucide-react";
 import axiosInstance from "../api/axiosInstance";

     export default function Users() {
   const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState({
    _id: "",
    username: "",
    email: "",
    password: "",
    role: "sales",
    status: "Active",
      phone: "",
  });
  const [errors, setErrors] = useState({ username: "", email: "", password: "", phone: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const menuRef = useRef(null);

  // Fetch users
  useEffect(() => {
    async function fetchData() {
      try {
        const meRes = await axiosInstance.get("/users/me");
        setCurrentUser(meRes.data);
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
        setFiltered(res.data);
      } catch {
        showToast("Access denied", "error");
      }
    }
    fetchData();
  }, []);

  // Filter users
  useEffect(() => {
    setFiltered(
      users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  if (currentUser && currentUser.role !== "admin") {
    return <p className="text-red-500 text-xl">Access Denied</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateUser = () => {
    const usernameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]*$/;

    if (!newUser.username.trim()) {
      setErrors(prev => ({ ...prev, username: "Username is required" }));
      document.getElementsByName("username")[0].focus();
      return false;
    }
    if (!usernameRegex.test(newUser.username)) {
      setErrors(prev => ({ ...prev, username: "Username must contain letters only" }));
      document.getElementsByName("username")[0].focus();
      return false;
    }

    if (!newUser.email.trim()) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      document.getElementsByName("email")[0].focus();
      return false;
    }
    if (!emailRegex.test(newUser.email)) {
      setErrors(prev => ({ ...prev, email: "Email format is invalid" }));
      document.getElementsByName("email")[0].focus();
      return false;
    }

    if (!isEditing && (!newUser.password || newUser.password.length < 8)) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 8 characters" }));
      document.getElementsByName("password")[0].focus();
      return false;
    }

    if (newUser.phone && !phoneRegex.test(newUser.phone)) {
      setErrors(prev => ({ ...prev, phone: "Phone must contain numbers only" }));
      document.getElementsByName("phone")[0].focus();
      return false;
    }

    return true;
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleSaveUser = async () => {
    if (!validateUser()) return;

    try {
      let res;
      if (isEditing) {
        res = await axiosInstance.put(`/users/${newUser._id}`, newUser);
        setUsers(users.map(u => u._id === newUser._id ? res.data.user : u));
        showToast(`${res.data.user.username} updated successfully`, "success");
      } else {
        res = await axiosInstance.post("/users", newUser);
        setUsers([res.data.user, ...users]);
        showToast(`${res.data.user.username} added successfully`, "success");
      }
      setShowModal(false);
      setNewUser({ _id: "", username: "", email: "", password: "", role: "sales", status: "Active", phone: "" });
      setErrors({ username: "", email: "", password: "", phone: "" });
    } catch {
      showToast("Error saving user", "error");
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setNewUser({ ...user, password: "" });
    setShowModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await axiosInstance.delete(`/users/${userToDelete._id}`);
      setUsers(users.filter(u => u._id !== userToDelete._id));
      showToast(`${userToDelete.username} deleted successfully`, "success");
      setUserToDelete(null);
    } catch {
      showToast("Error deleting user", "error");
    }
  };

  const toggleMenu = (id) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(id);
      setTimeout(() => {
        if (menuRef.current) menuRef.current.scrollIntoView({ block: "nearest" });
      }, 0);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
          <p className="text-gray-500 text-sm sm:text-base">Manage your team members and their permissions</p>
        </div>
        {currentUser?.role === "admin" && (
          <button
            onClick={() => { setShowModal(true); setIsEditing(false); }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Add User</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-[600px] w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              {currentUser?.role === "admin" && <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map(user => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 sm:px-6 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.username.slice(0,2).toUpperCase()}
                  </div>
                  <p className="font-semibold text-gray-900">{user.username}</p>
                </td>
                <td className="px-4 sm:px-6 py-3 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{user.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{user.phone || "-"}</div>
                </td>
                <td className="px-4 sm:px-6 py-3">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.role === "admin" ? "text-red-700 bg-red-50" : "text-orange-700 bg-orange-50"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.status === "Active" ? "text-emerald-700 bg-emerald-50" : "text-gray-600 bg-gray-100"}`}>
                    {user.status}
                  </span>
                </td>
                {currentUser?.role === "admin" && (
                  <td className="px-4 sm:px-6 py-3 relative" ref={menuRef}>
                    <button onClick={() => toggleMenu(user._id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    {openMenuId === user._id && (
                      <div className="absolute right-2 top-10 bg-white border rounded shadow-md z-50 w-32">
                        <button onClick={() => handleEdit(user)} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Edit</button>
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-xl p-6 w-full max-w-md sm:max-w-lg md:max-w-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit User" : "Add User"}</h2>
            <div className="space-y-3">
              <input name="username" value={newUser.username} onChange={handleChange} placeholder="Username" className={`w-full border px-3 py-2 rounded-lg ${errors.username ? "border-red-500" : ""}`} />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}

              <input name="email" value={newUser.email} onChange={handleChange} placeholder="Email" className={`w-full border px-3 py-2 rounded-lg ${errors.email ? "border-red-500" : ""}`} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

              <input name="password" value={newUser.password} onChange={handleChange} placeholder="Password" className={`w-full border px-3 py-2 rounded-lg ${errors.password ? "border-red-500" : ""}`} />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

              <input name="phone" value={newUser.phone} onChange={handleChange} placeholder="Phone" className={`w-full border px-3 py-2 rounded-lg ${errors.phone ? "border-red-500" : ""}`} />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}

              <select name="role" value={newUser.role} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg">
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border w-full sm:w-auto">Cancel</button>
              <button onClick={handleSaveUser} className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 w-full sm:w-auto">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm sm:max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to delete {userToDelete.username}?
            </h2>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button onClick={() => setUserToDelete(null)} className="px-4 py-2 border rounded-lg w-full sm:w-auto">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full sm:w-auto">Delete</button>
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