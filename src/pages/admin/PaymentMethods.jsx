import { useEffect, useState } from "react";
import API from "../../api/axios";

const PaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", note: "" });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const { data } = await API.get("/payment-methods");
      setMethods(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post("/payment-methods", form);
      setShowModal(false);
      setForm({ name: "", note: "" });
      fetchMethods();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment method?")) return;
    try {
      await API.delete(`/payment-methods/${id}`);
      fetchMethods();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const getIcon = (name) => {
    const n = name?.toLowerCase();
    if (n?.includes("cash")) return "💵";
    if (n?.includes("card")) return "💳";
    if (n?.includes("online")) return "📱";
    return "🔄";
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md shadow-black/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Methods</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage accepted payment methods
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-indigo-500/20"
        >
          + Add Method
        </button>
      </div>

      {/* Default Methods */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { name: "Cash", icon: "💵", color: "bg-emerald-500/10 border border-emerald-500/20" },
          { name: "Card", icon: "💳", color: "bg-blue-500/10 border border-blue-500/20" },
          { name: "Online", icon: "📱", color: "bg-purple-500/10 border border-purple-500/20" },
          { name: "Other", icon: "🔄", color: "bg-gray-900/50" },
        ].map((m) => (
          <div key={m.name} className={`${m.color} rounded-2xl p-4 text-center`}>
            <div className="text-3xl mb-1">{m.icon}</div>
            <p className="font-semibold text-white text-sm">{m.name}</p>
            <span className="text-xs text-emerald-600 font-medium">Default</span>
          </div>
        ))}
      </div>

      {/* Custom Methods */}
      <div className="bg-gray-800 rounded-2xl shadow-md shadow-black/20 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700">
          <h3 className="font-bold text-white">Custom Methods</h3>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : methods.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {methods.map((method) => (
              <div
                key={method._id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-700/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getIcon(method.name)}</div>
                  <div>
                    <p className="font-semibold text-white">{method.name}</p>
                    {method.note && (
                      <p className="text-xs text-gray-400">{method.note}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    method.isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}>
                    {method.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => handleDelete(method._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-2">💳</div>
            <p className="text-sm">No custom methods added</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-xl shadow-black/40 w-full max-w-sm mx-auto">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                ➕ Add Payment Method
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-400 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Method Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="JazzCash, Easypaisa..."
                  className="w-full border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Additional info..."
                  className="w-full border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;