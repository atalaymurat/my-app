import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.1.100:3021";

// Shared state — tüm instance'lar aynı refresh döngüsünü paylaşır
let isRefreshing = false;
let queue = [];

const processQueue = (error) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  queue = [];
};

export const attachRefreshInterceptor = (instance) => {
  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;

      const status = error.response?.status;
      if ((status !== 401 && status !== 403) || original._retry) {
        return Promise.reject(error);
      }

      // Auth endpoint'lerinde sonsuz döngüye girme
      if (original.url?.includes("/api/auth/")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => instance(original));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${BACKEND_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        processQueue(null);
        return instance(original);
      } catch (refreshError) {
        processQueue(refreshError);
        console.warn(
          "refreshInterceptor: token yenilenemedi, login'e yönlendiriliyor",
          refreshError?.response?.data || refreshError?.message
        );
        if (typeof window !== "undefined")
          window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
};
