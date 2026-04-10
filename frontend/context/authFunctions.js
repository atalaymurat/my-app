import axiosAuth from "@/utils/axiosAuth";
import { auth } from "@/lib/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";

const doVerify = () =>
  axiosAuth.post("/verify", { applicationId: process.env.NEXT_PUBLIC_APPLICATION_ID });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const checkSession = async ({ setUser, setAuthChecked, setLoading }) => {
  setLoading(true);
  try {
    let response;
    try {
      response = await doVerify();
    } catch (verifyError) {
      const status = verifyError.response?.status;

      // 502/503 = backend soğuk, bir kez retry
      if (status === 502 || status === 503 || !status) {
        try {
          await wait(3000);
          response = await doVerify();
        } catch {
          setUser(null);
          setAuthChecked(true);
          return null;
        }
      // 401 = token expired/invalid, 400 = token cookie eksik (silinmiş)
      } else if (status === 401 || status === 400) {
        try {
          await axiosAuth.post("/refresh");
          response = await doVerify();
        } catch (refreshError) {
          console.warn(
            "checkSession: refresh başarısız",
            refreshError?.response?.data || refreshError?.message
          );
          setUser(null);
          setAuthChecked(true);
          return null;
        }
      } else {
        throw verifyError;
      }
    }

    if (response?.data?.success && response.data.user) {
      setUser(response.data.user);
      setAuthChecked(true);
      return response.data.user;
    }

    setUser(null);
    setAuthChecked(true);
    return null;
  } catch (error) {
    console.warn(
      "checkSession: beklenmedik hata",
      error?.response?.data || error?.message
    );
    setUser(null);
    setAuthChecked(true);
    return null;
  } finally {
    setLoading(false);
  }
};

export const login = async ({ idToken, setUser, setLoading }) => {
  setLoading(true);
  try {
    const response = await axiosAuth.post("/login", {
      idToken,
      applicationId: process.env.NEXT_PUBLIC_APPLICATION_ID,
    });

    if (response.data?.success && response.data.user) {
      setUser(response.data.user);
      return true;
    }

    throw new Error(response.data?.error || "Login failed.");
  } catch (error) {
    console.error("Login error:", error?.response?.data || error?.message);
    setUser(null);
    return false;
  } finally {
    setLoading(false);
  }
};

export const signOut = async ({ setUser, router, setLoading }) => {
  setLoading(true);
  try {
    await firebaseSignOut(auth);
    await axiosAuth.post("/logout");
    setUser(null);
    router.push("/auth");
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    setUser(null);
  } finally {
    setLoading(false);
  }
};
