import { useEffect, useState } from "react";
import API from "../../api/axios";
import { FiLoader } from "react-icons/fi";

const Adjustments = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    product: "",
    type: "addition",
    quantity: "",
    reason: "",
  });

  useEffect(() => {
    fetchAdjustments();
    fetchProducts();
  }, []);

  const fetchAdjustments = async () => {
    try {
      const { data } = await API.get("/adjustments");
      setAdjustments(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await API.post("/adjustments", form);

      setShowModal(false);
      setForm({
        product: "",
        type: "addition",
        quantity: "",
        reason: "",
      });

      fetchAdjustments();
      fetchProducts();

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Stock Adjustments
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Adjust product inventory levels
          </p>
        </div>

        <button
          onClick={() => { setShowModal(true); setError(""); }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          + New Adjustment
        </button>

      </div>

      {/* Table */}

      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="bg-black/30 text-gray-400 text-xs uppercase tracking-wider">

                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Quantity</th>
                <th className="px-6 py-4 text-left">Reason</th>
                <th className="px-6 py-4 text-left">Date</th>

              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">

              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-gray-400">
                    <FiLoader className="animate-spin text-4xl mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : adjustments.length > 0 ? (

                adjustments.map((adj) => (

                  <tr key={adj._id} className="hover:bg-white/5 transition">

                    <td className="px-6 py-4 font-semibold text-white">
                      {adj.product?.name}
                    </td>

                    <td className="px-6 py-4">

                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        adj.type === "addition"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}>

                        {adj.type}

                      </span>

                    </td>

                    <td className="px-6 py-4 font-bold">

                      <span className={
                        adj.type === "addition"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }>

                        {adj.type === "addition" ? "+" : "-"}
                        {adj.quantity}

                      </span>

                    </td>

                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {adj.reason || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(adj.createdAt).toLocaleDateString()}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="5" className="text-center py-14 text-gray-500">

                    <div className="text-4xl mb-2">📋</div>

                    No adjustments found

                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Modal */}

      {showModal && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 p-4">

          <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-md">

            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">

              <h2 className="text-lg font-bold text-white">
                New Adjustment
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Product */}

              <select
                value={form.product}
                onChange={(e) =>
                  setForm({ ...form, product: e.target.value })
                }
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
              >

                <option value="">Select Product</option>

                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (Stock: {p.stock})
                  </option>
                ))}

              </select>

              {/* Type */}

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "addition" })}
                  className={`py-2 rounded-xl text-sm ${
                    form.type === "addition"
                      ? "bg-emerald-600 text-white"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  Addition
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "subtraction" })}
                  className={`py-2 rounded-xl text-sm ${
                    form.type === "subtraction"
                      ? "bg-red-600 text-white"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  Subtraction
                </button>

              </div>

              {/* Quantity */}

              <input
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
                required
                min="1"
                placeholder="Quantity"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
              />

              {/* Reason */}

              <textarea
                value={form.reason}
                onChange={(e) =>
                  setForm({ ...form, reason: e.target.value })
                }
                rows={2}
                placeholder="Reason..."
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white resize-none"
              />

              {/* Buttons */}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl bg-white/5 text-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  {saving ? "Saving..." : "Save"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Adjustments;