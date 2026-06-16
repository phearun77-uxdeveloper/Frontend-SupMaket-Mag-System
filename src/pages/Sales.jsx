import { useMemo, useState } from "react";
import {
  Minus,
  Plus,
  Printer,
  ReceiptText,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";

const initialProducts = [
  {
    id: 1,
    name: "Fresh Milk 1L",
    sku: "MLK-001",
    price: 2.5,
    quantity: 12,
  },
  {
    id: 2,
    name: "Brown Bread",
    sku: "BRD-014",
    price: 1.75,
    quantity: 9,
  },
  {
    id: 3,
    name: "Cooking Oil 1L",
    sku: "OIL-008",
    price: 4.25,
    quantity: 18,
  },
  {
    id: 4,
    name: "Orange Juice",
    sku: "JCE-021",
    price: 3.2,
    quantity: 7,
  },
];

const customers = [
  { id: "", name: "Walk-in Customer" },
  { id: 1, name: "Sokha Lim" },
  { id: 2, name: "Dara Chhun" },
  { id: 3, name: "Srey Pov" },
];

const initialSales = [
  {
    id: 1,
    receiptNumber: "SALE-000184",
    customerName: "Walk-in Customer",
    total: 42.5,
    paymentMethod: "Cash",
    soldAt: "2026-06-15 17:20",
  },
  {
    id: 2,
    receiptNumber: "SALE-000183",
    customerName: "Sokha Lim",
    total: 18.25,
    paymentMethod: "ABA",
    soldAt: "2026-06-15 16:45",
  },
];

function Sales() {
  const [products, setProducts] = useState(initialProducts);
  const [cartItems, setCartItems] = useState([]);
  const [sales, setSales] = useState(initialSales);
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discount, setDiscount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastReceipt, setLastReceipt] = useState(null);
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();

    if (!keyword) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword)
      );
    });
  }, [products, searchTerm]);

  const selectedCustomer =
    customers.find((customer) => String(customer.id) === String(customerId)) ||
    customers[0];

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + item.price * item.cartQuantity;
  }, 0);

  const discountAmount = Number(discount) || 0;
  const total = Math.max(subtotal - discountAmount, 0);

  function addToCart(product) {
    setError("");

    if (product.quantity <= 0) {
      setError("This product is out of stock");
      return;
    }

    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.cartQuantity >= product.quantity) {
        setError("Cart quantity cannot exceed available stock");
        return;
      }

      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        )
      );

      return;
    }

    setCartItems((currentItems) => [
      ...currentItems,
      {
        ...product,
        cartQuantity: 1,
      },
    ]);
  }

  function increaseQuantity(productId) {
    setError("");

    const product = products.find((item) => item.id === productId);
    const cartItem = cartItems.find((item) => item.id === productId);

    if (cartItem.cartQuantity >= product.quantity) {
      setError("Cart quantity cannot exceed available stock");
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, cartQuantity: item.cartQuantity - 1 }
            : item
        )
        .filter((item) => item.cartQuantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }

  function createSale() {
    if (cartItems.length === 0) {
      setError("Please add at least one product to the cart");
      return;
    }

    if (discountAmount < 0) {
      setError("Discount cannot be negative");
      return;
    }

    if (discountAmount > subtotal) {
      setError("Discount cannot be greater than subtotal");
      return;
    }

    const receiptNumber = `SALE-${String(Date.now()).slice(-6)}`;
    const soldAt = new Date().toLocaleString();

    const receipt = {
      receiptNumber,
      customerName: selectedCustomer.name,
      subtotal,
      discount: discountAmount,
      total,
      paymentMethod,
      soldAt,
      items: cartItems,
    };

    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        const cartItem = cartItems.find((item) => item.id === product.id);

        if (!cartItem) {
          return product;
        }

        return {
          ...product,
          quantity: product.quantity - cartItem.cartQuantity,
        };
      })
    );

    setSales((currentSales) => [
      {
        id: Date.now(),
        receiptNumber,
        customerName: selectedCustomer.name,
        total,
        paymentMethod,
        soldAt,
      },
      ...currentSales,
    ]);

    setLastReceipt(receipt);
    setCartItems([]);
    setDiscount("");
    setCustomerId("");
    setPaymentMethod("Cash");
    setError("");
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            SALES MANAGEMENT
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Sales</h1>
          <p className="mt-2 text-slate-500">
            Create customer sales, calculate totals, and generate receipts.
          </p>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-violet-50 px-5 py-4 text-violet-700">
          <p className="text-sm font-semibold">Today Sales</p>
          <p className="text-2xl font-bold">
            ${sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <section className="mt-7 grid gap-6 xl:grid-cols-5">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-3">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Available Products</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search and add products to the cart.
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
                  placeholder="Search product..."
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 md:w-72"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{product.sku}</p>
                    <p className="mt-3 text-lg font-bold text-emerald-600">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      product.quantity > 0
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {product.quantity} left
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  disabled={product.quantity <= 0}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Plus size={18} />
                  Add to Cart
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <ShoppingCart size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">Current Cart</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {cartItems.length} item types selected
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div>
              <label
                htmlFor="customerId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Customer
              </label>

              <select
                id="customerId"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                {customers.map((customer) => (
                  <option key={customer.name} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-2 text-slate-600 hover:bg-slate-100"
                      >
                        <Minus size={17} />
                      </button>

                      <span className="px-4 font-semibold">
                        {item.cartQuantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        className="p-2 text-slate-600 hover:bg-slate-100"
                      >
                        <Plus size={17} />
                      </button>
                    </div>

                    <p className="font-bold text-slate-900">
                      ${(item.price * item.cartQuantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                  Cart is empty.
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="space-y-3 text-sm">
                <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />

                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="discount"
                    className="font-medium text-slate-600"
                  >
                    Discount
                  </label>

                  <input
                    id="discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount}
                    onChange={(event) => setDiscount(event.target.value)}
                    placeholder="0.00"
                    className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-right outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <SummaryRow
                  label="Total"
                  value={`$${total.toFixed(2)}`}
                  strong
                />
              </div>

              <div className="mt-4">
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
                  <option>Cash</option>
                  <option>ABA</option>
                  <option>Credit Card</option>
                </select>
              </div>

              <button
                type="button"
                onClick={createSale}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                <ReceiptText size={19} />
                Create Sale
              </button>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-5">
        {lastReceipt && (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Receipt Preview</h2>
              <Printer size={21} className="text-slate-500" />
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-4">
              <div className="text-center">
                <h3 className="font-bold text-slate-900">SuperMarket</h3>
                <p className="text-sm text-slate-500">
                  Receipt: {lastReceipt.receiptNumber}
                </p>
                <p className="text-sm text-slate-500">{lastReceipt.soldAt}</p>
              </div>

              <div className="mt-4 border-y border-slate-200 py-3 text-sm">
                <p>
                  <span className="font-semibold">Customer:</span>{" "}
                  {lastReceipt.customerName}
                </p>
                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {lastReceipt.paymentMethod}
                </p>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                {lastReceipt.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <span>
                      {item.name} x {item.cartQuantity}
                    </span>
                    <span>
                      ${(item.price * item.cartQuantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-200 pt-3 text-sm">
                <SummaryRow
                  label="Subtotal"
                  value={`$${lastReceipt.subtotal.toFixed(2)}`}
                />
                <SummaryRow
                  label="Discount"
                  value={`$${lastReceipt.discount.toFixed(2)}`}
                />
                <SummaryRow
                  label="Total"
                  value={`$${lastReceipt.total.toFixed(2)}`}
                  strong
                />
              </div>
            </div>
          </article>
        )}

        <article
          className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${
            lastReceipt ? "xl:col-span-3" : "xl:col-span-5"
          }`}
        >
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-bold text-slate-900">Sales History</h2>
            <p className="mt-1 text-sm text-slate-500">
              Recent completed sales.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Receipt</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Total</th>
                  <th className="px-5 py-4 font-semibold">Payment</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {sale.receiptNumber}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {sale.customerName}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      ${sale.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {sale.paymentMethod}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{sale.soldAt}</td>
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

function SummaryRow({ label, value, strong = false }) {
  return (
    <div
      className={`flex items-center justify-between ${
        strong ? "text-lg font-bold text-slate-900" : "text-slate-600"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default Sales;