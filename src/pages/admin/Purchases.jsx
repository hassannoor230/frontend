import { useState } from "react";

const Purchases = () => {
  const [purchases] = useState([]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md shadow-black/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Purchases</h1>
          <p className="text-sm text-gray-400 mt-1">Manage purchase orders</p>
        </div>
        <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-indigo-500/20">
          + New Purchase
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 shadow-md shadow-black/20 text-center">
          <p className="text-xs text-gray-300 mb-1">Total</p>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 shadow-md shadow-black/20 text-center">
          <p className="text-xs text-gray-300 mb-1">Pending</p>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
        <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 shadow-md shadow-black/20 text-center">
          <p className="text-xs text-gray-300 mb-1">Received</p>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-md shadow-black/20">
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🛍️</div>
          <p className="font-medium text-gray-400">No Purchases Yet</p>
          <p className="text-sm mt-1">Create your first purchase order</p>
        </div>
      </div>
    </div>
  );
};

export default Purchases;