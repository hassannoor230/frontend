const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-md shadow-black/20 p-6 flex items-center gap-4 border border-gray-700">
      {/* Icon */}
      <div className={`text-3xl p-3 rounded-full ${color}`}>
        {icon}
      </div>

      {/* Text */}
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;