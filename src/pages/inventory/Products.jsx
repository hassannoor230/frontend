import { useEffect, useState } from "react";
import API from "../../api/axios";
import { FaSearch } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

const InventoryProducts = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">

        <h1 className="text-2xl font-bold text-white">
          Products
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          View all products and stock levels
        </p>

      </div>

      {/* Search */}

      <div className="relative w-full">

        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0f172a]/80 backdrop-blur border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

      </div>

      {/* Table */}

      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="bg-black/30 text-gray-400 text-xs uppercase tracking-wider">

                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">SKU</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Stock</th>
                <th className="px-6 py-4 text-left">Min Stock</th>
                <th className="px-6 py-4 text-left">Status</th>

              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">

              {loading ? (

                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-400">

                    <FiLoader className="animate-spin text-4xl mx-auto mb-2" />
                    Loading...

                  </td>
                </tr>

              ) : filtered.length > 0 ? (

                filtered.map((p) => (

                  <tr key={p._id} className="hover:bg-white/5 transition">

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <img
                          src={p.image || "https://via.placeholder.com/40"}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-white/10"
                        />

                        <p className="font-semibold text-white">
                          {p.name}
                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                      {p.sku}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {p.category?.name}
                    </td>

                    <td className="px-6 py-4 font-bold text-white">
                      {p.stock} {p.unit}
                    </td>

                    <td className="px-6 py-4 text-gray-400">
                      {p.minStock}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.stock === 0
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : p.stock <= p.minStock
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >

                        {p.stock === 0
                          ? "Out of Stock"
                          : p.stock <= p.minStock
                          ? "Low Stock"
                          : "In Stock"}

                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="6" className="text-center py-14 text-gray-500">

                    <div className="text-4xl mb-2">📦</div>

                    No products found

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

export default InventoryProducts;