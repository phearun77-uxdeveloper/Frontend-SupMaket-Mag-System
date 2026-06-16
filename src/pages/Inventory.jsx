import { useMemo, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Boxes,
  PackageSearch,
  Search,
  TriangleAlert,
} from "lucide-react";

const initialProducts = [
  {
    id: 1,
    name: "Fresh Milk 1L",
    sku: "MLK-001",
    quantity: 4,
    lowStockThreshold: 5,
  },
  {
    id: 2,
    name: "Brown Bread",
    sku: "BRD-014",
    quantity: 3,
    lowStockThreshold: 5,
  },
  {
    id: 3,
    name: "Cooking Oil 1L",
    sku: "OIL-008",
    quantity: 18,
    lowStockThreshold: 5,
  },
  {
    id: 4,
    name: "Orange Juice",
    sku: "JCE-021",
    quantity: 2,
    lowStockThreshold: 5,
  },
];

const initialMovements = [
  {
    id: 1,
    productName: "Fresh Milk 1L",
    sku: "MLK-001",
    type: "STOCK_IN",
    quantity: 20,
    quantityBefore: 0,
    quantityAfter: 20,
    note: "Initial stock",
    createdAt: "2026-06-15 08:30",
  },
  {
    id: 2,
    productName: "Fresh Milk 1L",
    sku: "MLK-001",
    type: "STOCK_OUT",
    quantity: 16,
    quantityBefore: 20,
    quantityAfter: 4,
    note: "Customer sales",
    createdAt: "2026-06-15 14:10",
  },
  {
    id: 3,
    productName: "Cooking Oil 1L",
    sku: "OIL-008",
    type: "STOCK_IN",
    quantity: 18,
    quantityBefore: 0,
    quantityAfter: 18,
    note: "Supplier delivery",
    createdAt: "2026-06-15 16:45",
  },
];

const emptyForm = {
  productId: "",
  movementType: "STOCK_IN",
  quantity: "",
  note: "",
};

function Inventory() {
  const [products, setProducts] = useState(initialProducts);
  const [movements, setMovements] = useState(initialMovements);
  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});

  const selectedProduct = products.find(
    (product) => product.id === Number(form.productId)
  );

  const lowStockProducts = products.filter(
    (product) => product.quantity <= product.lowStockThreshold
  );

  const filteredMovements = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();

    if (!keyword) {
      return movements;
    }

    return movements.filter((movement) => {
      return (
        movement.productName.toLowerCase().includes(keyword) ||
        movement.sku.toLowerCase().includes(keyword) ||
        movement.type.toLowerCase().includes(keyword) ||
        movement.note.toLowerCase().includes(keyword)
      );
    });
  }, [movements, searchTerm]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  }

  function validateForm() {
    const validationErrors = {};
    const quantity = Number(form.quantity);

    if (!form.productId) {
      validationErrors.productId = "Please select a product";
    }

    if (!form.quantity || quantity <= 0) {
      validationErrors.quantity = "Quantity must be greater than 0";
    }

    if (
      selectedProduct &&
      form.movementType === "STOCK_OUT" &&
      quantity > selectedProduct.quantity
    ) {
      validationErrors.quantity = "Stock out quantity cannot exceed current stock";
    }

    return validationErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const quantity = Number(form.quantity);
    const quantityBefore = selectedProduct.quantity;
    const quantityAfter =
      form.movementType === "STOCK_IN"
        ? quantityBefore + quantity
        : quantityBefore - quantity;

    const newMovement = {
      id: Date.now(),
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      type: form.movementType,
      quantity,
      quantityBefore,
      quantityAfter,
      note: form.note.trim() || "No note",
      createdAt: new Date().toLocaleString(),
    };

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, quantity: quantityAfter }
          : product
      )
    );

    setMovements((currentMovements) => [newMovement, ...currentMovements]);
    setForm(emptyForm);
    setErrors({});
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            INVENTORY MANAGEMENT
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Inventory</h1>
          <p className="mt-2 text-slate-500">
            Track stock in, stock out, and low-stock product alerts.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-amber-700">
          <p className="text-sm font-semibold">Low Stock Products</p>
          <p className="text-2xl font-bold">{lowStockProducts.length}</p>
        </div>
      </div>

      <section className="mt-7 grid gap-6 xl:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1"
        >
          <div className="mb-5">
            <h2 className="font-bold text-slate-900">Record Stock Movement</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add stock in or stock out records.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="productId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Product
              </label>

              <select
                id="productId"
                name="productId"
                value={form.productId}
                onChange={handleChange}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
                  errors.productId
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - Current stock: {product.quantity}
                  </option>
                ))}
              </select>

              {errors.productId && (
                <p className="mt-2 text-sm text-red-600">{errors.productId}</p>
              )}
            </div>

            {selectedProduct && (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">SKU:</span>{" "}
                  {selectedProduct.sku}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-slate-800">
                    Current Stock:
                  </span>{" "}
                  {selectedProduct.quantity}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="movementType"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Movement Type
              </label>

              <select
                id="movementType"
                name="movementType"
                value={form.movementType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="STOCK_IN">Stock In</option>
                <option value="STOCK_OUT">Stock Out</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Quantity
              </label>

              <input
                id="quantity"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                placeholder="10"
                className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
                  errors.quantity
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />

              {errors.quantity && (
                <p className="mt-2 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="note"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Note
              </label>

              <textarea
                id="note"
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Supplier delivery, damaged product, manual correction..."
                rows="4"
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              {form.movementType === "STOCK_IN" ? (
                <ArrowUpCircle size={19} />
              ) : (
                <ArrowDownCircle size={19} />
              )}
              Save Movement
            </button>
          </div>
        </form>

        <section className="space-y-6 xl:col-span-2">
          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="font-bold text-slate-900">Low Stock Alerts</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Products that are below or equal to their alert level.
                </p>
              </div>

              <TriangleAlert className="text-amber-500" size={24} />
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl border border-red-100 bg-red-50 p-4"
                >
                  <p className="font-semibold text-slate-900">
                    {product.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{product.sku}</p>
                  <p className="mt-3 text-sm font-semibold text-red-600">
                    Only {product.quantity} left
                  </p>
                </div>
              ))}

              {lowStockProducts.length === 0 && (
                <p className="text-slate-500">No low-stock products.</p>
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Inventory History
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    All stock movement records.
                  </p>
                </div>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search history..."
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 md:w-72"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Product</th>
                    <th className="px-5 py-4 font-semibold">Type</th>
                    <th className="px-5 py-4 font-semibold">Qty</th>
                    <th className="px-5 py-4 font-semibold">Before</th>
                    <th className="px-5 py-4 font-semibold">After</th>
                    <th className="px-5 py-4 font-semibold">Note</th>
                    <th className="px-5 py-4 font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredMovements.map((movement) => (
                    <tr key={movement.id}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-slate-100 p-3 text-slate-500">
                            <PackageSearch size={20} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {movement.productName}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {movement.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            movement.type === "STOCK_IN"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {movement.type === "STOCK_IN"
                            ? "Stock In"
                            : "Stock Out"}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {movement.quantity}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {movement.quantityBefore}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {movement.quantityAfter}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {movement.note}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {movement.createdAt}
                      </td>
                    </tr>
                  ))}

                  {filteredMovements.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-10 text-center text-slate-500"
                      >
                        No inventory history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </section>
    </div>
  );
}

export default Inventory;