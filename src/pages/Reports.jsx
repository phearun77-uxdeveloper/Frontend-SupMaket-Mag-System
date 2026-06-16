import { useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  FileText,
  Filter,
  ReceiptText,
  TrendingUp,
} from "lucide-react";

const salesReportData = [
  {
    id: 1,
    receiptNumber: "SALE-000184",
    customerName: "Walk-in Customer",
    total: 42.5,
    paymentMethod: "Cash",
    soldAt: "2026-06-16",
  },
  {
    id: 2,
    receiptNumber: "SALE-000183",
    customerName: "Sokha Lim",
    total: 18.25,
    paymentMethod: "ABA",
    soldAt: "2026-06-16",
  },
  {
    id: 3,
    receiptNumber: "SALE-000182",
    customerName: "Dara Chhun",
    total: 65.9,
    paymentMethod: "Credit Card",
    soldAt: "2026-06-15",
  },
  {
    id: 4,
    receiptNumber: "SALE-000181",
    customerName: "Walk-in Customer",
    total: 12.75,
    paymentMethod: "Cash",
    soldAt: "2026-06-14",
  },
  {
    id: 5,
    receiptNumber: "SALE-000180",
    customerName: "Srey Pov",
    total: 104.4,
    paymentMethod: "ABA",
    soldAt: "2026-06-10",
  },
];

const quickReports = [
  {
    title: "Daily Sales",
    description: "Sales from selected day",
    icon: CalendarDays,
  },
  {
    title: "Weekly Sales",
    description: "Sales within the week",
    icon: TrendingUp,
  },
  {
    title: "Monthly Sales",
    description: "Sales within the month",
    icon: FileText,
  },
];

function Reports() {
  const [reportType, setReportType] = useState("daily");
  const [startDate, setStartDate] = useState("2026-06-16");
  const [endDate, setEndDate] = useState("2026-06-16");
  const [paymentMethod, setPaymentMethod] = useState("All");

  const filteredSales = useMemo(() => {
    return salesReportData.filter((sale) => {
      const matchesDate =
        (!startDate || sale.soldAt >= startDate) &&
        (!endDate || sale.soldAt <= endDate);

      const matchesPayment =
        paymentMethod === "All" || sale.paymentMethod === paymentMethod;

      return matchesDate && matchesPayment;
    });
  }, [startDate, endDate, paymentMethod]);

  const totalSalesAmount = filteredSales.reduce((sum, sale) => {
    return sum + sale.total;
  }, 0);

  const averageSale =
    filteredSales.length > 0 ? totalSalesAmount / filteredSales.length : 0;

  function handleReportTypeChange(type) {
    setReportType(type);

    if (type === "daily") {
      setStartDate("2026-06-16");
      setEndDate("2026-06-16");
    }

    if (type === "weekly") {
      setStartDate("2026-06-10");
      setEndDate("2026-06-16");
    }

    if (type === "monthly") {
      setStartDate("2026-06-01");
      setEndDate("2026-06-30");
    }
  }

  function handleExportPdf() {
    alert(
      "PDF export will be connected later using the backend report API and a PDF library."
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            REPORTS
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Sales Reports
          </h1>
          <p className="mt-2 text-slate-500">
            View daily, weekly, and monthly sales performance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportPdf}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          <Download size={19} />
          Export PDF
        </button>
      </div>

      <section className="mt-7 grid gap-5 md:grid-cols-3">
        {quickReports.map((report) => {
          const Icon = report.icon;
          const type = report.title.toLowerCase().split(" ")[0];
          const isActive = reportType === type;

          return (
            <button
              key={report.title}
              type="button"
              onClick={() => handleReportTypeChange(type)}
              className={`rounded-2xl border p-5 text-left shadow-sm transition ${
                isActive
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-emerald-200"
              }`}
            >
              <div
                className={`mb-4 inline-flex rounded-xl p-3 ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon size={23} />
              </div>

              <h2 className="font-bold text-slate-900">{report.title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {report.description}
              </p>
            </button>
          );
        })}
      </section>

      <section className="mt-7 grid gap-5 md:grid-cols-3">
        <SummaryCard
          title="Total Revenue"
          value={`$${totalSalesAmount.toFixed(2)}`}
          description="Filtered sales amount"
        />

        <SummaryCard
          title="Total Transactions"
          value={filteredSales.length}
          description="Number of sales records"
        />

        <SummaryCard
          title="Average Sale"
          value={`$${averageSale.toFixed(2)}`}
          description="Revenue per transaction"
        />
      </section>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Filter size={22} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">Report Filters</h2>
              <p className="mt-1 text-sm text-slate-500">
                Select date range and payment method.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Start Date
              </label>

              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                End Date
              </label>

              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="paymentMethod"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Payment Method
              </label>

              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option>All</option>
                <option>Cash</option>
                <option>ABA</option>
                <option>Credit Card</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Receipt</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Payment</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Total</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {sale.receiptNumber}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {sale.customerName}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {sale.paymentMethod}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {sale.soldAt}
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-900">
                    ${sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No sales found for this report filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ title, value, description }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
          <ReceiptText size={23} />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">{description}</p>
    </article>
  );
}

export default Reports;