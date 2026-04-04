"use client";
import { useAuth } from "@/context/AuthContext";

const DebugJson = ({ data }) => {
  const { user } = useAuth();
  if (!user?.roles?.includes("superadmin")) return null;
  return (
    <pre className="text-xs text-stone-400 px-2 overflow-auto bg-stone-900 rounded p-2 my-2 max-h-64">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default DebugJson;
