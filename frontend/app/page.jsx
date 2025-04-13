"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [tokenStatus, setTokenStatus] = useState("checking...");
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const isProduction = process.env.NODE_ENV === "production";
        const backendUrl = isProduction 
          ? process.env.NEXT_PUBLIC_BACKEND_URL 
          : "http://localhost:5000";

        const response = await fetch(`${backendUrl}/api/user`, {
          credentials: 'include',
        });

        const data = await response.json();
        
        if (data.success && data.user) {
          setTokenStatus(`Token valid! Welcome ${data.user.name || data.user.email}`);
        } else {
          setTokenStatus("No valid token found");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setTokenStatus("Error checking token");
      }
    };

    checkToken();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Token Status</h1>
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-lg">{tokenStatus}</p>
        </div>
      </div>
    </div>
  );
}
