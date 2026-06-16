import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login, saveAuthSession } from "../services/authService";

const initialForm = {
  email: "",
  password: "",
  rememberMe: false,
};

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setServerError("");
  }

  function validateForm() {
    const validationErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!emailPattern.test(form.email)) {
      validationErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      validationErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      validationErrors.password = "Password must contain at least 6 characters";
    }

    return validationErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError("");

      const response = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      saveAuthSession(response.data);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-2">
      <section className="hidden bg-emerald-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/15 p-3">
            <Store size={30} />
          </div>

          <div>
            <p className="text-xl font-bold">SuperMarket</p>
            <p className="text-sm text-emerald-100">Management System</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
            Manage with confidence
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Everything your supermarket needs in one place.
          </h1>

          <p className="mt-6 text-lg leading-8 text-emerald-100">
            Manage products, inventory, customers, employees, and sales through
            one reliable dashboard.
          </p>
        </div>

        <p className="text-sm text-emerald-200">
          Supermarket Management System
        </p>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="rounded-xl bg-emerald-600 p-3 text-white">
              <Store size={26} />
            </div>

            <div>
              <p className="font-bold text-slate-900">SuperMarket</p>
              <p className="text-sm text-slate-500">Management System</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Welcome back
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Sign in to your account
            </h2>

            <p className="mt-2 text-slate-500">
              Enter your employee account information.
            </p>

            {serverError && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {serverError}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@supermarket.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className={`w-full rounded-xl border py-3 pl-12 pr-4 outline-none transition focus:ring-4 ${
                      errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    className={`w-full rounded-xl border py-3 pl-12 pr-12 outline-none transition focus:ring-4 ${
                      errors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="h-4 w-4 accent-emerald-600"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="animate-spin" size={20} />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">Temporary demo login</p>
              <p className="mt-1">Email: admin@supermarket.com</p>
              <p>Password: Admin123</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;