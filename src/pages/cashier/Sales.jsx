import { useEffect, useState } from "react";
import API from "../../api/axios";
import { FaTimes } from "react-icons/fa";
import { MdReceiptLong } from "react-icons/md";
import { FiLoader } from "react-icons/fi";

const CashierSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);

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

  const totalRevenue = sales
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md shadow-black/20 border border-gray-700">
        <h1 className="text-2xl font-black text-white">My Sales</h1>
        <p className="text-sm text-gray-400 mt-1">Your sales history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-2xl p-5 border border-blue-500/25"
          style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(79,70,229,0.08))" }}>
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-15 blur-2xl pointer-events-none bg-blue-500" />
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-1">Total Sales</p>
          <p className="text-2xl font-black text-white">{sales.length}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-5 border border-yellow-500/25"
          style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(234,179,8,0.08))" }}>
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-15 blur-2xl pointer-events-none bg-yellow-500" />
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-1">My Revenue</p>
          <p className="text-xl font-black text-white">Rs. {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-2xl shadow-md shadow-black/20 border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 text-gray-500 text-xs uppercase tracking-wider text-left">
                <th className="px-5 py-4">Invoice</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    <FiLoader className="text-3xl mx-auto mb-2 animate-spin text-indigo-400" />
                    Loading...
                  </td>
                </tr>
              ) : sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-700/50 transition">
                    <td className="px-5 py-4 font-black text-indigo-400 text-xs">{sale.invoiceNumber}</td>
                    <td className="px-5 py-4 font-medium text-gray-200">{sale.customer}</td>
                    <td className="px-5 py-4 font-black text-white">Rs. {sale.total?.toLocaleString()}</td>
                    <td className="px-5 py-4 capitalize text-gray-400 text-xs">{sale.paymentMethod}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        sale.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : sale.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    <MdReceiptLong className="text-4xl mx-auto mb-2 text-gray-600" />
                    No sales yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800 rounded-t-2xl">
              <div>
                <h2 className="font-black text-white">{selectedSale.invoiceNumber}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Sale Details</p>
              </div>
              <button
                onClick={() => setSelectedSale(null)}
                className="w-8 h-8 rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 transition"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            <div className="p-6 space-y-4">

              {/* Info */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-2.5 text-sm">
                {[
                  { label: "Customer", value: selectedSale.customer },
                  { label: "Payment",  value: selectedSale.paymentMethod, capitalize: true },
                  { label: "Date",     value: new Date(selectedSale.createdAt).toLocaleString() },
                ].map(({ label, value, capitalize }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-400">{label}</span>
                    <span className={`font-semibold text-gray-200 ${capitalize ? "capitalize" : ""}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div className="space-y-2">
                {selectedSale.items?.map((item, i) => (
                  <div key={i} className="flex justify-between bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-gray-200">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.quantity} × Rs. {item.price?.toLocaleString()}</p>
                    </div>
                    <p className="font-black text-white">Rs. {item.total?.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-700 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span><span>Rs. {selectedSale.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span><span>Rs. {selectedSale.tax?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Discount</span><span>- Rs. {selectedSale.discount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-white text-base border-t border-gray-700 pt-2.5 mt-1">
                  <span>Total</span><span className="text-indigo-400">Rs. {selectedSale.total?.toLocaleString()}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CashierSales;