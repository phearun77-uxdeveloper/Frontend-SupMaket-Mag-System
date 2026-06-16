import { useMemo, useState } from "react";
import {
  Edit,
  ImagePlus,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

const initialProducts = [
  {
    id: 1,
    name: "Fresh Milk 1L",
    sku: "MLK-001",
    category: "Beverages",
    price: 2.5,
    quantity: 4,
    lowStockThreshold: 5,
    imageUrl: "",
  },
  {
    id: 2,
    name: "Brown Bread",
    sku: "BRD-014",
    category: "Bakery",
    price: 1.75,
    quantity: 3,
    lowStockThreshold: 5,
    imageUrl: "",
  },
  {
    id: 3,
    name: "Cooking Oil 1L",
    sku: "OIL-008",
    category: "Groceries",
    price: 4.25,
    quantity: 18,
    lowStockThreshold: 5,
    imageUrl: "",
  },
];

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  price: "",
  quantity: "",
  lowStockThreshold: "5",
  imageUrl: "",
};

function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();

    if (!keyword) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword)
      );
    });
  }, [products, searchTerm]);

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

    if (!form.name.trim()) {
      validationErrors.name = "Product name is required";
    }

    if (!form.sku.trim()) {
      validationErrors.sku = "SKU is required";
    }

    if (!form.category.trim()) {
      validationErrors.category = "Category is required";
    }

    if (!form.price || Number(form.price) <= 0) {
      validationErrors.price = "Price must be greater than 0";
    }

    if (form.quantity === "" || Number(form.quantity) < 0) {
      validationErrors.quantity = "Quantity cannot be negative";
    }

    if (!form.lowStockThreshold || Number(form.lowStockThreshold) < 1) {
      validationErrors.lowStockThreshold = "Low stock threshold must be at least 1";
    }

    return validationErrors;
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingProductId(null);
    setErrors({});
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const productData = {
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      category: form.category.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      imageUrl: form.imageUrl.trim(),
    };

    if (editingProductId) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProductId
            ? { ...product, ...productData }
            : product
        )
      );
    } else {
      setProducts((currentProducts) => [
        {
          id: Date.now(),
          ...productData,
        },
        ...currentProducts,
      ]);
    }

    resetForm();
  }

  function handleEdit(product) {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: String(product.price),
      quantity: String(product.quantity),
      lowStockThreshold: String(product.lowStockThreshold),
      imageUrl: product.imageUrl,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirmDelete() {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productToDelete.id)
    );
    setProductToDelete(null);
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            PRODUCT MANAGEMENT
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Products</h1>
          <p className="mt-2 text-slate-500">
            Add, edit, search, and manage supermarket products.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-emerald-700">
          <p className="text-sm font-semibold">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
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
                {editingProductId ? "Edit Product" : "Add Product"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the product details.
              </p>
            </div>

            {editingProductId && (
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
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Fresh Milk 1L"
            />

            <FormInput
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              error={errors.sku}
              placeholder="MLK-001"
            />

            <FormInput
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              error={errors.category}
              placeholder="Beverages"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Price"
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="2.50"
              />

              <FormInput
                label="Quantity"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                error={errors.quantity}
                placeholder="20"
              />
            </div>

            <FormInput
              label="Low Stock Alert"
              name="lowStockThreshold"
              type="number"
              value={form.lowStockThreshold}
              onChange={handleChange}
              error={errors.lowStockThreshold}
              placeholder="5"
            />

            <FormInput
              label="Image URL"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
            />

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Product preview"
                  className="h-36 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-36 flex-col items-center justify-center text-slate-400">
                  <ImagePlus size={32} />
                  <p className="mt-2 text-sm">Image preview</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus size={19} />
              {editingProductId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Product List</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search and manage existing products.
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

          <div className="overflow-x-auto">
            <table className="w-full min-w-200 text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Stock</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const isLowStock =
                    product.quantity <= product.lowStockThreshold;

                  return (
                    <tr key={product.id}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package size={22} />
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {product.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {product.category}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-800">
                        ${product.price.toFixed(2)}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {product.quantity}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isLowStock
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">
              Delete product?
            </h2>

            <p className="mt-2 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {productToDelete.name}
              </span>
              ? This action cannot be undone in the frontend demo.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
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
  type = "text",
  placeholder,
  step,
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
        type={type}
        step={step}
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

export default Products;