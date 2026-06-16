import { useMemo, useState } from "react";
import { Edit, FolderTree, Plus, Search, Trash2, X } from "lucide-react";

const initialCategories = [
  {
    id: 1,
    name: "Beverages",
    description: "Drinks, juices, water, milk, and soft drinks",
    isActive: true,
  },
  {
    id: 2,
    name: "Bakery",
    description: "Bread, cakes, pastries, and baked goods",
    isActive: true,
  },
  {
    id: 3,
    name: "Groceries",
    description: "Daily food items and household cooking products",
    isActive: true,
  },
  {
    id: 4,
    name: "Frozen Foods",
    description: "Frozen meat, vegetables, and ready-to-cook items",
    isActive: false,
  },
];

const emptyForm = {
  name: "",
  description: "",
  isActive: true,
};

function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();

    if (!keyword) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(keyword) ||
        category.description.toLowerCase().includes(keyword)
      );
    });
  }, [categories, searchTerm]);

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

    if (!form.name.trim()) {
      validationErrors.name = "Category name is required";
    }

    if (!form.description.trim()) {
      validationErrors.description = "Description is required";
    }

    return validationErrors;
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingCategoryId(null);
    setErrors({});
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const categoryData = {
      name: form.name.trim(),
      description: form.description.trim(),
      isActive: form.isActive,
    };

    if (editingCategoryId) {
      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category.id === editingCategoryId
            ? { ...category, ...categoryData }
            : category
        )
      );
    } else {
      setCategories((currentCategories) => [
        {
          id: Date.now(),
          ...categoryData,
        },
        ...currentCategories,
      ]);
    }

    resetForm();
  }

  function handleEdit(category) {
    setEditingCategoryId(category.id);
    setForm({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirmDelete() {
    setCategories((currentCategories) =>
      currentCategories.filter((category) => category.id !== categoryToDelete.id)
    );
    setCategoryToDelete(null);
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            CATEGORY MANAGEMENT
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Categories
          </h1>
          <p className="mt-2 text-slate-500">
            Create and organize product categories.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-blue-700">
          <p className="text-sm font-semibold">Total Categories</p>
          <p className="text-2xl font-bold">{categories.length}</p>
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
                {editingCategoryId ? "Edit Category" : "Add Category"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the category details.
              </p>
            </div>

            {editingCategoryId && (
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
              label="Category Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Beverages"
            />

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe this category"
                rows="5"
                className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
                  errors.description
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />

              {errors.description && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.description}
                </p>
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
              Active category
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus size={19} />
              {editingCategoryId ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Category List</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search and manage product categories.
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
                  placeholder="Search category..."
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 md:w-72"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Description</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                          <FolderTree size={21} />
                        </div>

                        <p className="font-semibold text-slate-800">
                          {category.name}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {category.description}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          category.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          aria-label={`Edit ${category.name}`}
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(category)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          aria-label={`Delete ${category.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCategories.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">
              Delete category?
            </h2>

            <p className="mt-2 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {categoryToDelete.name}
              </span>
              ? Later, backend rules will prevent deleting categories that still
              contain products.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
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

function FormInput({ label, name, value, onChange, error, placeholder }) {
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

export default Categories;