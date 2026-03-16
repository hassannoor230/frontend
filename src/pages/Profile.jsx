import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FiLoader } from "react-icons/fi";

const Profile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/auth/me");
      setForm((prev) => ({
        ...prev,
        name: data.data.name || "",
        phone: data.data.phone || "",
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await API.put("/auth/profile", {
        name: form.name,
        phone: form.phone,
      });
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match!");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setSaving(true);
    try {
      await API.put("/auth/profile", {
        currentPassword: form.currentPassword,
        password: form.newPassword,
      });
      setSuccess("Password changed successfully!");
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  const getRoleColor = (role) => {
    if (role === "admin") return "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
    if (role === "cashier") return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    return "bg-orange-500/20 text-orange-300 border border-orange-500/30";
  };

  const getRoleIcon = (role) => {
    if (role === "admin") return "👑";
    if (role === "cashier") return "🧾";
    return "📦";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center py-16 text-gray-500">
          <FiLoader className="text-4xl mb-2 mx-auto animate-spin text-gray-400" />
          <span className="text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-md shadow-black/20 border border-gray-700">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-800 rounded-2xl shadow-md shadow-black/20 border border-gray-700 p-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-4xl font-bold text-indigo-400">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getRoleColor(user?.role)}`}>
                {getRoleIcon(user?.role)} {user?.role}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success / Error Messages */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
          ❌ {error}
        </div>
      )}

      {/* Update Info */}
      <div className="bg-gray-800 rounded-2xl shadow-md shadow-black/20 border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="font-bold text-white">Personal Information</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Update your name and phone number
          </p>
        </div>

        <form onSubmit={handleUpdateInfo} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Email - readonly */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="03001234567"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60 shadow-md shadow-indigo-500/20"
          >
            {saving ? "Saving..." : "Update Info"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-gray-800 rounded-2xl shadow-md shadow-black/20 border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="font-bold text-white">Change Password</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Keep your account secure
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              required
              placeholder="••••••••"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
              placeholder="••••••••"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              placeholder="••••••••"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />

            {/* Password Match Indicator */}
            {form.newPassword && form.confirmPassword && (
              <p className={`text-xs mt-1 ${form.newPassword === form.confirmPassword
                  ? "text-emerald-400"
                  : "text-red-400"
                }`}>
                {form.newPassword === form.confirmPassword
                  ? "✅ Passwords match"
                  : "❌ Passwords do not match"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-red-500/90 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60 shadow-md shadow-red-500/20"
          >
            {saving ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;