import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 shadow-md px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-gray-700">

      <h1 className="text-base sm:text-xl font-bold text-white tracking-wide ms-9 md:ms-0">
        POS System
      </h1>

      <div className="flex items-center gap-3 sm:gap-5">

        <span className="hidden sm:inline text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 capitalize border border-indigo-500/30">
          {user?.role}
        </span>

        <span className="text-xs sm:text-sm text-gray-300 font-medium max-w-40 sm:max-w-none truncate">
          {user?.name}
        </span>

        <button
          onClick={logout}
          className="text-xs sm:text-sm bg-red-500/90 hover:bg-red-500 cursor-pointer text-white px-4 sm:px-5 py-1.5 rounded-full font-semibold transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-red-500/30"
        >
          Logout
        </button>

      </div>
    </header>
  );
};

export default Navbar;