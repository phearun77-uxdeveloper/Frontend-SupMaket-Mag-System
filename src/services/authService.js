import { apiRequest } from "./api";

const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === "true";

export async function login(credentials) {
  if (useMockAuth) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (
      credentials.email !== "admin@supermarket.com" ||
      credentials.password !== "Admin123"
    ) {
      throw new Error("Incorrect email or password");
    }

    return {
      success: true,
      message: "Login successful",
      data: {
        token: "temporary-development-token",
        user: {
          id: 1,
          fullName: "System Administrator",
          email: credentials.email,
          role: "admin",
        },
      },
    };
  }

  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function saveAuthSession(authData) {
  localStorage.setItem("accessToken", authData.token);
  localStorage.setItem("user", JSON.stringify(authData.user));
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
}