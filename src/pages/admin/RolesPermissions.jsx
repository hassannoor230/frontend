const RolesPermissions = () => {
  const roles = [
    {
      name: "Admin",
      icon: "👑",
      color: "bg-indigo-500/10 border-indigo-500/30",
      badge: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
      permissions: [
        "Full system access",
        "Manage users & roles",
        "View all reports",
        "Manage products & inventory",
        "Manage sales & purchases",
        "Manage expenses",
        "System settings",
      ],
    },
    {
      name: "Cashier",
      icon: "🧾",
      color: "bg-emerald-500/10 border-emerald-500/30",
      badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      permissions: [
        "Access POS screen",
        "Create sales",
        "View own sales history",
        "Update own profile",
      ],
    },
    {
      name: "Inventory Manager",
      icon: "📦",
      color: "bg-orange-500/10 border-orange-500/30",
      badge: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
      permissions: [
        "View all products",
        "Add & edit products",
        "Stock adjustments",
        "View inventory dashboard",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md shadow-black/20">
        <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
        <p className="text-sm text-gray-400 mt-1">
          View system roles and their permissions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div
            key={role.name}
            className={`rounded-2xl border p-5 ${role.color}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">{role.icon}</div>
              <div>
                <p className="font-bold text-white">{role.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.badge}`}>
                  {role.permissions.length} permissions
                </span>
              </div>
            </div>
            <ul className="space-y-2">
              {role.permissions.map((perm) => (
                <li key={perm} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-emerald-400 font-bold">✓</span>
                  {perm}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesPermissions;