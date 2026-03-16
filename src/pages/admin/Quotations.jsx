import { useState } from "react";

const Quotations = () => {
  const [quotations] = useState([]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md shadow-black/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quotations</h1>
          <p className="text-sm text-gray-400 mt-1">Manage customer quotations</p>
        </div>
        <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-indigo-500/20">
          + New Quotation
        </button>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-md shadow-black/20 overflow-hidden">
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-medium text-gray-400">No Quotations Yet</p>
          <p className="text-sm mt-1">Create your first quotation</p>
        </div>
      </div>
    </div>
  );
};

export default Quotations;