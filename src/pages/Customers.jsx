import { useMemo, useState } from "react";
import {
  Edit,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const initialCustomers = [
  {
    id: 1,
    fullName: "Sokha Lim",
    phone: "012345678",
    email: "sokha@example.com",
    address: "Phnom Penh",
    isActive: true,
    purchases: [
      {
        receiptNumber: "SALE-000183",
        total: 18.25,
        soldAt: "2026-06-15 16:45",
      },
      {
        receiptNumber: "SALE-000130",
        total: 32.8,
        soldAt: "2026-06-10 11:20",
      },
    ],
  },
  {
    id: 2,
    fullName: "Dara Chhun",
    phone: "098765432",
    email: "dara@example.com",
    address: "Siem Reap",
    isActive: true,
    purchases: [
      {
        receiptNumber: "SALE-000182",
        total: 65.9,
        soldAt: "2026-06-15 15:10",
      },
    ],
  },
  {
    id: 3,
    fullName: "Srey Pov",
    phone: "011222333",
    email: "sreypov@example.com",
    address: "Battambang",
    isActive: false,
    purchases: [],
  },
];

const emptyForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  isActive: true,
};

function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [errors, setErrors] = useState({});

  const filteredCustomers = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();

    if (!keyword) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.fullName.toLowerCase().includes(keyword) ||
        customer.phone.toLowerCase().includes(keyword) ||
        customer.email.toLowerCase().includes(keyword) ||
        customer.address.toLowerCase().includes(keyword)
      );
    });
  }, [customers, searchTerm]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  }

  function validateForm() {
    const validationErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.fullName.trim()) {
      validationErrors.fullName = "Customer name is required";
    }

    if (!form.phone.trim()) {
      validationErrors.phone = "Phone number is required";
    }

    if (form.email.trim() && !emailPattern.test(form.email)) {
      validationErrors.email = "Enter a valid email address";
    }

    if (!form.address.trim()) {
      validationErrors.address = "Address is required";
    }

    return validationErrors;
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingCustomerId(null);
    setErrors({});
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const customerData = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      isActive: form.isActive,
    };

    if (editingCustomerId) {
      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.id === editingCustomerId
            ? { ...customer, ...customerData }
            : customer
        )
      );
    } else {
      setCustomers((currentCustomers) => [
        {
          id: Date.now(),
          ...customerData,
          purchases: [],
        },
        ...currentCustomers,
      ]);
    }

    resetForm();
  }

  function handleEdit(customer) {
    setEditingCustomerId(customer.id);
    setForm({
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      isActive: customer.isActive,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirmDelete() {
    setCustomers((currentCustomers) =>
      currentCustomers.filter((customer) => customer.id !== customerToDelete.id)
    );
    setCustomerToDelete(null);
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            CUSTOMER MANAGEMENT
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Customers</h1>
          <p className="mt-2 text-slate-500">
            Manage customers and view their purchase history.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-emerald-700">
          <p className="text-sm font-semibold">Total Customers</p>
          <p className="text-2xl font-bold">{customers.length}</p>
        </div>
      </div>

      <section className="mt-7 grid gap-6 xl:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                {editingCustomerId ? "Edit Customer" : "Add Customer"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in customer information.
              </p>
            </div>

            {editingCustomerId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Cancel editing"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <FormInput
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Sokha Lim"
            />

            <FormInput
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="012345678"
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="customer@example.com"
            />

            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Customer address"
                rows="4"
                className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
                  errors.address
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />

              {errors.address && (
                <p className="mt-2 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
              <input
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4 accent-emerald-600"
              />
              Active customer
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus size={19} />
              {editingCustomerId ? "Update Customer" : "Add Customer"}
            </button>
          </div>
        </form>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Customer List</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search and manage customers.
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
                  placeholder="Search customer..."
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 md:w-72"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Contact</th>
                  <th className="px-5 py-4 font-semibold">Address</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                          <UserRound size={21} />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {customer.fullName}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {customer.purchases.length} purchases
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1 text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <Phone size={15} />
                          {customer.phone}
                        </p>

                        {customer.email && (
                          <p className="flex items-center gap-2">
                            <Mail size={15} />
                            {customer.email}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={16} />
                        {customer.address}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          customer.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(customer)}
                          className="rounded-lg p-2 text-violet-600 hover:bg-violet-50"
                          aria-label={`View ${customer.fullName}`}
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEdit(customer)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          aria-label={`Edit ${customer.fullName}`}
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCustomerToDelete(customer)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          aria-label={`Delete ${customer.fullName}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {selectedCustomer && (
        <Modal onClose={() => setSelectedCustomer(null)}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedCustomer.fullName}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Purchase history preview
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close purchase history"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {selectedCustomer.purchases.map((purchase) => (
              <div
                key={purchase.receiptNumber}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {purchase.receiptNumber}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {purchase.soldAt}
                    </p>
                  </div>

                  <p className="font-bold text-emerald-600">
                    ${purchase.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            {selectedCustomer.purchases.length === 0 && (
              <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                No purchase history yet.
              </div>
            )}
          </div>
        </Modal>
      )}

      {customerToDelete && (
        <Modal onClose={() => setCustomerToDelete(null)}>
          <h2 className="text-xl font-bold text-slate-900">
            Delete customer?
          </h2>

          <p className="mt-2 text-slate-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-800">
              {customerToDelete.fullName}
            </span>
            ? Later, backend rules will usually deactivate customers instead of
            permanently deleting important records.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCustomerToDelete(null)}
              className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function FormInput({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
        }`}
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
}

export default Customers;