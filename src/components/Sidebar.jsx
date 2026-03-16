import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaFolderOpen,
  FaBalanceScale,
  FaShoppingBag,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaUsers,
  FaUserShield,
  FaChartBar,
  FaMoneyCheckAlt,
  FaCreditCard,
  FaUser,
  FaArrowLeft,
  FaArrowRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import icon from "../assets/icon.png";

const adminMenu = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
  { label: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
  { label: "Categories", path: "/admin/categories", icon: <FaFolderOpen /> },
  { label: "Adjustments", path: "/admin/adjustments", icon: <FaBalanceScale /> },
  { label: "Purchases", path: "/admin/purchases", icon: <FaShoppingBag /> },
  { label: "Sales", path: "/admin/sales", icon: <FaFileInvoiceDollar /> },
  { label: "Expenses", path: "/admin/expenses", icon: <FaMoneyBillWave /> },
  { label: "Peoples", path: "/admin/peoples", icon: <FaUsers /> },
  { label: "Roles & Permissions", path: "/admin/roles", icon: <FaUserShield /> },
  { label: "Reports", path: "/admin/reports", icon: <FaChartBar /> },
  { label: "Currencies", path: "/admin/currencies", icon: <FaMoneyCheckAlt /> },
  { label: "Payment Methods", path: "/admin/payment-methods", icon: <FaCreditCard /> },
  { label: "Profile", path: "/admin/profile", icon: <FaUser /> },
];

const cashierMenu = [
  { label: "Dashboard", path: "/cashier/dashboard", icon: <FaTachometerAlt /> },
  { label: "POS", path: "/cashier/pos", icon: <FaShoppingBag /> },
  { label: "Sales", path: "/cashier/sales", icon: <FaFileInvoiceDollar /> },
  { label: "Profile", path: "/cashier/profile", icon: <FaUser /> },
];

const inventoryMenu = [
  { label: "Dashboard", path: "/inventory/dashboard", icon: <FaTachometerAlt /> },
  { label: "Products", path: "/inventory/products", icon: <FaBoxOpen /> },
  { label: "Adjustments", path: "/inventory/adjustments", icon: <FaBalanceScale /> },
  { label: "Profile", path: "/inventory/profile", icon: <FaUser /> },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu =
    user?.role === "admin"
      ? adminMenu
      : user?.role === "cashier"
      ? cashierMenu
      : inventoryMenu;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col bg-gray-900 text-white h-full transition-all duration-300 border-r border-gray-700 ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        
        <div
          className={`flex items-center border-b border-gray-700 ${
            collapsed ? "justify-center py-4" : "justify-between px-4 py-4"
          }`}
        >
          {!collapsed && (
            <div>
              <div className="flex items-center gap-2">
                <img
                  src={icon}
                  alt="SmartPOS"
                  className="w-8 h-8 object-contain filter brightness-0 invert sepia saturate-[6] hue-rotate-[20deg]"
                />
                <h2 className="text-lg font-bold text-white">
                  SmartPOS Pro
                </h2>
              </div>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role} Panel
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
          >
            {collapsed ? <FaArrowRight /> : <FaArrowLeft />}
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center rounded-xl text-sm font-medium transition-all ${
                  collapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-white hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span
                className={`text-white ${
                  collapsed ? "text-xl" : "text-base"
                }`}
              >
                {item.icon}
              </span>

              {!collapsed && (
                <span className="text-white">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* USER */}
        {!collapsed ? (
          <div className="px-4 py-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 border-t border-gray-700 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </aside>

      {/* MOBILE */}
      <div className="md:hidden">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <aside className="bg-gray-900 text-white flex flex-col h-full w-64 border-r border-gray-700">

            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <img
                  src={icon}
                  alt="SmartPOS"
                  className="w-8 h-8 object-contain filter brightness-0 invert sepia saturate-[6] hue-rotate-[20deg]"
                />
                <h2 className="text-lg font-bold text-yellow-400">
                  SmartPOS
                </h2>
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>

            {/* MENU */}
            <nav className="flex-1 py-3 px-2 space-y-1">
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-white hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <span className="text-white">{item.icon}</span>
                  <span className="text-white">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>

        {!mobileOpen && (
          <button
            onClick={() => setMobileOpen(true)}
            className="fixed top-3 left-3 z-50 w-9 h-9 rounded-lg bg-gray-800 text-white flex items-center justify-center"
          >
            <FaBars />
          </button>
        )}
      </div>
    </>
  );
};

export default Sidebar;