import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { SiCashapp } from "react-icons/si";
import { FaBasketShopping } from "react-icons/fa6";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { FaStore } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const StatCard = ({ title, value, icon, accent }) => (
  <div
    className="relative overflow-hidden rounded-2xl p-5 border"
    style={{
      borderColor: accent + "30",
      background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
    }}
  >
    <div
      className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-15 blur-2xl pointer-events-none"
      style={{ background: accent }}
    />
    <div className="relative flex items-start justify-between mb-3">
      <div
        className="w-11 h-11 flex items-center justify-center rounded-xl text-xl"
        style={{ background: accent + "20", color: accent, border: `1px solid ${accent}30` }}
      >
        {icon}
      </div>
    </div>
    <div className="relative">
      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: accent + "cc" }}>
        {title}
      </p>
      <h3 className="text-2xl font-black text-white leading-none">{value}</h3>
    </div>
  </div>
);

const CashierDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await API.get("/sales");
        setSales(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const completedSales = sales.filter((s) => s.status === "completed");
  const totalRevenue = completedSales.reduce((sum, s) => sum + s.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <FiLoader className="animate-spin text-4xl text-indigo-400" />
          <span className="text-xs text-gray-500 uppercase tracking-widest">Loading</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed, #2563eb)" }}
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <HiSparkles className="text-yellow-300 text-sm" />
            <span className="text-xs font-semibold text-indigo-200 uppercase tracking-widest">
              Cashier Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-indigo-200 mt-1 text-sm">Manage your store sales</p>
        </div>

        <button
          onClick={() => navigate("/cashier/pos")}
          className="relative flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 w-full sm:w-auto justify-center"
        >
          <FaStore />
          Open POS
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Sales"
          value={sales.length}
          icon={<FaBasketShopping />}
          accent="#6366f1"
        />
        <StatCard
          title="Revenue"
          value={`Rs. ${totalRevenue.toLocaleString()}`}
          icon={<SiCashapp />}
          accent="#f59e0b"
        />
        <StatCard
          title="Completed"
          value={completedSales.length}
          icon={<IoCheckmarkDoneCircleSharp />}
          accent="#10b981"
        />
      </div>

      {/* Sales Table */}
      <div className="bg-gray-800 rounded-2xl shadow-md shadow-black/20 border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Sales</h2>
            <p className="text-sm text-gray-400">Latest transactions by you</p>
          </div>
          <button
            onClick={() => navigate("/cashier/sales")}
            className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition"
          >
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 text-gray-500 text-xs uppercase tracking-wider text-left">
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sales.length > 0 ? (
                sales.slice(0, 8).map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4 font-bold text-indigo-400 text-xs">
                      {sale.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-200">
                      {sale.customer}
                    </td>
                    <td className="px-6 py-4 font-black text-white">
                      Rs. {sale.total?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        sale.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : sale.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-500">
                    <FaBasketShopping className="text-4xl mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No sales yet — Open POS to start selling</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CashierDashboard;