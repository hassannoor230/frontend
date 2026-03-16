
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import icon from "../../assets/icon.png";

const roles = [
  {
    label: "Admin",
    email: "admin@pos.com",
    password: "admin123",
  },
  {
    label: "Cashier",
    email: "cashier@pos.com",
    password: "cashier123",
  },
  {
    label: "Inventory Manager",
    email: "inventory@pos.com",
    password: "inventory123",
  },
];

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleClick = (role) => {
    setEmail(role.email);
    setPassword(role.password);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-md bg-[#1a1a1a] shadow-2xl rounded-2xl p-8 border border-[#d4af37]/40">
        
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2">
            <img src={icon} alt="Logo" className="w-10 h-10 object-contain" />
            <h2 className="text-2xl font-bold tracking-wide text-[#d4af37]">SmartPos Pro</h2>
          </div>
          <p className="text-gray-400 mt-2 text-sm">Sign in to your account</p>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-500 text-center mb-3 uppercase tracking-wider">
            Quick Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => (
              <button
                key={role.label}
                onClick={() => handleRoleClick(role)}
                className="bg-[#d4af37] hover:bg-[#b8962e] text-black rounded-xl py-3 px-2 text-center transition font-semibold"
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pos.com"
              required
              className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4af37] hover:bg-[#b8962e] text-black font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
