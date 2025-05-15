import axiosAuth from "@/utils/axiosAuth";
import { auth } from "@/lib/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";

export const checkSession = async ({ setUser, setAuthChecked, setLoading }) => {
  const token = localStorage.getItem("accessToken");
  console.log("Token:", token);
  if (!token) {
    // Token yoksa kontrol yapmaya gerek yok
    setAuthChecked(true);
    setUser(null);
    return null;
  }

  setLoading(true);
  try {
    const response = await axiosAuth.post("/verify", {
      token,
      applicationId: process.env.NEXT_PUBLIC_APPLICATION_ID,
    });

    if (response.status === 200 && response.data?.success && response.data.user) {
      setUser(response.data.user);
      setAuthChecked(true);
      return response.data.user;
    }

    setUser(null);
    setAuthChecked(true);
    return null;
  } catch (error) {
    console.error("Session check error:", error.response?.data || error.message);
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

    if (response.data?.success && response.data.user && response.data.accessToken) {
      setUser(response.data.user);
      localStorage.setItem("accessToken", response.data.accessToken);
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
    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/auth");
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    setUser(null);
  } finally {
    setLoading(false);
  }
};
