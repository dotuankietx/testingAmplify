import { AuthBindings } from "@refinedev/core";
import i18n from "./i18n";

export const TOKEN_KEY = "arche-app-auth";
export const REFRESH_TOKEN_KEY = "arche-app-refresh-auth";

const BASE_URL = import.meta.env.VITE_API_URL;

interface IResponse {
  statusCode: number;
  message: string;
  error?: string;
  data?: any;
}

export function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export const getToken = () => {
  let token = getCookie(TOKEN_KEY);
  if (!token) {
    token = localStorage.getItem(TOKEN_KEY);
  }
  if (!token) {
    token = "";
  }
  return token;
};

export const getRefreshToken = () => {
  let token = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!token) {
    token = "";
  }
  return token;
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Fetch setup for all requests check token in localStorage
export const fetchJson = async (
  url: string,
  options: any = {}
): Promise<IResponse> => {
  const token = getToken();
  const headers: any = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  try {
    const response = await fetch(BASE_URL + url, {
      ...options,
      headers,
    });
    const json = await response.json();
    if (response.status < 200 || response.status >= 300) {
      return {
        statusCode: response.status,
        message: json?.message ?? "Something went wrong",
        error: json?.message ?? "Something went wrong",
      };
    }
    return {
      statusCode: response.status,
      message: response.statusText,
      data: json,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      message: error?.message ?? "Something went wrong",
      error: error?.message ?? "Something went wrong",
    };
  }
};

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    const user: any = await fetchJson("/api/cms/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (user?.data?.accessToken) {
      localStorage.setItem(TOKEN_KEY, user.data.accessToken.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, user.data.refreshToken.token);
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: i18n.t(`errors.${user?.message}`) || "Invalid username or password",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    return [];
  },
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const user: any = await fetchJson("/api/auth/me");
      return user;
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
