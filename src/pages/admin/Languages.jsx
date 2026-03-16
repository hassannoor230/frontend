const Languages = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md shadow-black/20">
        <h1 className="text-2xl font-bold text-white">Languages</h1>
        <p className="text-sm text-gray-400 mt-1">Manage language settings</p>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-md shadow-black/20 p-5">
        <h3 className="font-bold text-gray-300 mb-4">Available Languages</h3>
        <div className="space-y-3">
          {[
            { flag: "🇵🇰", name: "Urdu", code: "ur", active: false },
            { flag: "🇺🇸", name: "English", code: "en", active: true },
          ].map((lang) => (
            <div
              key={lang.code}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="text-2xl">{lang.flag}</div>
              <div className="flex-1">
                <p className="font-semibold text-white">{lang.name}</p>
                <p className="text-xs text-gray-500 uppercase">{lang.code}</p>
              </div>
              {lang.active ? (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
                  Active
                </span>
              ) : (
                <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-400 rounded-full text-xs font-medium transition">
                  Activate
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Languages;