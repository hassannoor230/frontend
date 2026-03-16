const Currencies = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md shadow-black/20">
        <h1 className="text-2xl font-bold text-white">Currencies</h1>
        <p className="text-sm text-gray-400 mt-1">Manage currency settings</p>
      </div>

      {/* Default Currency */}
      <div className="bg-gray-800 rounded-2xl shadow-md shadow-black/20 p-5">
        <h3 className="font-bold text-gray-300 mb-4">Default Currency</h3>
        <div className="flex items-center gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <div className="text-3xl">🇵🇰</div>
          <div>
            <p className="font-bold text-white">Pakistani Rupee</p>
            <p className="text-sm text-gray-400">PKR — Rs.</p>
          </div>
          <span className="ml-auto px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default Currencies;