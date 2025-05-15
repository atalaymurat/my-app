"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  checkSession as checkSessionFn,
  login as loginFn,
  signOut as signOutFn,
} from "./authFunctions";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkSessionFn({ setUser, setAuthChecked, setLoading });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (idToken) => loginFn({ idToken, setUser, setLoading });
  const signOut = () => signOutFn({ setUser, router, setLoading });

  const value = {
    user,
    loading,
    login,
    signOut,
    checkSession: () => checkSessionFn({ setUser, setAuthChecked, setLoading }),
    authChecked,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
