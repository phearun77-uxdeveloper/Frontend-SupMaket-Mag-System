import {
  Boxes,
  FolderTree,
  Package,
  ShoppingBag,
  TriangleAlert,
} from "lucide-react";
import StatCard from "../components/StatCard";

const statistics = [
  {
    title: "Total Products",
    value: "248",
    description: "12 added this month",
    icon: Package,
    color: "emerald",
  },
  {
    title: "Categories",
    value: "18",
    description: "2 added this month",
    icon: FolderTree,
    color: "blue",
  },
  {
    title: "Total Sales",
    value: "$12,480",
    description: "8.2% from last month",
    icon: ShoppingBag,
    color: "violet",
  },
  {
    title: "Low Stock",
    value: "9",
    description: "Requires attention",
    icon: TriangleAlert,
    color: "amber",
  },
];

const lowStockProducts = [
  { name: "Fresh Milk 1L", sku: "MLK-001", quantity: 4 },
  { name: "Brown Bread", sku: "BRD-014", quantity: 3 },
  { name: "Cooking Oil 1L", sku: "OIL-008", quantity: 5 },
  { name: "Orange Juice", sku: "JCE-021", quantity: 2 },
];

const recentTransactions = [
  {
    receipt: "SALE-000184",
    customer: "Walk-in Customer",
    total: "$42.50",
    status: "Completed",
  },
  {
    receipt: "SALE-000183",
    customer: "Sokha Lim",
    total: "$18.25",
    status: "Completed",
  },
  {
    receipt: "SALE-000182",
    customer: "Dara Chhun",
    total: "$65.90",
    status: "Completed",
  },
  {
    receipt: "SALE-000181",
    customer: "Walk-in Customer",
    total: "$12.75",
    status: "Completed",
  },
];

function Dashboard() {
  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-emerald-600">OVERVIEW</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-500">
          Monitor your supermarket performance and inventory.
        </p>
      </div>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => (
          <StatCard key={statistic.title} {...statistic} />
        ))}
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-5">
        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 className="font-bold text-slate-900">Low Stock Products</h2>
              <p className="mt-1 text-sm text-slate-500">
                Products that need restocking
              </p>
            </div>

            <Boxes className="text-amber-500" size={23} />
          </div>

          <div className="divide-y divide-slate-100">
            {lowStockProducts.map((product) => (
              <div
                key={product.sku}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <p className="font-semibold text-slate-800">{product.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{product.sku}</p>
                </div>

                <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                  {product.quantity} left
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-3">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-bold text-slate-900">Recent Transactions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest completed customer sales
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Receipt</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Total</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.receipt}>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {transaction.receipt}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {transaction.customer}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {transaction.total}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;