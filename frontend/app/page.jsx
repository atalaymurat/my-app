"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [tokenStatus, setTokenStatus] = useState("checking...");
  const router = useRouter();


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="p-4 bg-gray-50 rounded">
          Home Page
        </div>
      </div>
    </div>
  );
}
