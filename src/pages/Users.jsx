import { useMemo, useState } from "react";
import {
  Edit,
  KeyRound,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const roles = ["Admin", "Employee", "Cashier"];

const initialUsers = [
  {
    id: 1,
    fullName: "System Administrator",
    email: "admin@supermarket.com",
    phone: "012345678",
    role: "Admin",
    isActive: true,
  },
  {
    id: 2,
    fullName: "Sokha Cashier",
    email: "cashier@supermarket.com",
    phone: "098765432",
    role: "Cashier",
    isActive: true,
  },
  {
    id: 3,
    fullName: "Dara Employee",
    email: "employee@supermarket.com",
    phone: "011222333",
    role: "Employee",
    isActive: false,
  },
];

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  role: "Employee",
  password: "",
  isActive: true,
};

function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();

    if (!keyword) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.toLowerCase().includes(keyword) ||
        user.role.toLowerCase().includes(keyword)
      );
    });
  }, [users, searchTerm]);

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
      validationErrors.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!emailPattern.test(form.email)) {
      validationErrors.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) {
      validationErrors.phone = "Phone number is required";
    }

    if (!editingUserId && !form.password) {
      validationErrors.password = "Password is required for new employees";
    } else if (!editingUserId && form.password.length < 6) {
      validationErrors.password = "Password must contain at least 6 characters";
    }

    return validationErrors;
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingUserId(null);
    setErrors({});
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const userData = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      role: form.role,
      isActive: form.isActive,
    };

    if (editingUserId) {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUserId ? { ...user, ...userData } : user
        )
      );
    } else {
      setUsers((currentUsers) => [
        {
          id: Date.now(),
          ...userData,
        },
        ...currentUsers,
      ]);
    }

    resetForm();
  }

  function handleEdit(user) {
    setEditingUserId(user.id);
    setForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: "",
      isActive: user.isActive,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirmDelete() {
    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== userToDelete.id)
    );
    setUserToDelete(null);
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            USER MANAGEMENT
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Employees
          </h1>
          <p className="mt-2 text-slate-500">
            Manage employees, login accounts, and role assignments.
          </p>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-violet-50 px-5 py-4 text-violet-700">
          <p className="text-sm font-semibold">Total Employees</p>
          <p className="text-2xl font-bold">{users.length}</p>
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
                {editingUserId ? "Edit Employee" : "Add Employee"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Create login access for employees.
              </p>
            </div>

            {editingUserId && (
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
              placeholder="Dara Employee"
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="employee@supermarket.com"
            />

            <FormInput
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="012345678"
            />

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Role
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </div>

            {!editingUserId && (
              <FormInput
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="At least 6 characters"
              />
            )}

            {editingUserId && (
              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                Password change will be handled later in a separate secure
                backend feature.
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
              <input
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4 accent-emerald-600"
              />
              Active employee
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus size={19} />
              {editingUserId ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Employee List</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search employees and assign roles.
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
                  placeholder="Search employee..."
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 md:w-72"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Employee</th>
                  <th className="px-5 py-4 font-semibold">Contact</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                          <UserRound size={21} />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {user.fullName}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1 text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <Mail size={15} />
                          {user.email}
                        </p>

                        <p className="flex items-center gap-2">
                          <Phone size={15} />
                          {user.phone}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        <ShieldCheck size={14} />
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          aria-label={`Edit ${user.fullName}`}
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setUserToDelete(user)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          aria-label={`Delete ${user.fullName}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 inline-flex rounded-xl bg-red-50 p-3 text-red-600">
              <KeyRound size={24} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Delete employee?
            </h2>

            <p className="mt-2 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {userToDelete.fullName}
              </span>
              ? Later, the backend should deactivate accounts instead of
              permanently deleting login history.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
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
          </div>
        </div>
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

export default Users;