import { Bell, Menu, UserRound } from "lucide-react";

function Navbar({ onOpenSidebar }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        <div>
          <p className="font-semibold text-slate-900">Store Administration</p>
          <p className="hidden text-sm text-slate-500 sm:block">
            Manage supermarket operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={21} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
            <UserRound size={20} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user?.fullName || "System Administrator"}
            </p>
            <p className="text-xs capitalize text-slate-500">
              {user?.role || "admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;