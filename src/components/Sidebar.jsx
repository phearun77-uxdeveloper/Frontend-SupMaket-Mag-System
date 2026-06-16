import {
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Store,
  Users,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const navigationItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/products", icon: Package },
  { name: "Categories", path: "/categories", icon: FolderTree },
  { name: "Inventory", path: "/inventory", icon: Boxes },
  { name: "Sales", path: "/sales", icon: ShoppingCart },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "Reports", path: "/reports", icon: ChartNoAxesCombined },
  { name: "Employees", path: "/users", icon: ClipboardList },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500 p-2.5">
              <Store size={25} />
            </div>

            <div>
              <p className="font-bold">SuperMarket</p>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          </div>

          <button
            type="button"
            className="text-slate-400 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;