"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";
import Pagination from "@/components/Pagination";

const UsersPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const isSuperAdmin = user?.roles?.includes("superadmin");

  useEffect(() => {
    if (!isSuperAdmin) {
      router.push("/shield/profile");
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`/api/auth/users?page=${currentPage}&limit=10`);
        if (data.success) {
          setUsers(data.users);
          setTotalPages(Math.ceil(data.total / 10));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, isSuperAdmin, router]);

  const handlePageChange = (page) => {
    router.push(`/shield/users?page=${page}`);
  };

  const handleActivate = async (userId) => {
    if (!confirm("Bu kullanıcıyı aktifleştirmek istediğinize emin misiniz?")) return;
    try {
      await axios.patch(`/api/auth/users/${userId}/activate`);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: true } : u)));
    } catch (error) {
      alert("Aktifleştirme başarısız.");
    }
  };

  const handleDeactivate = async (userId) => {
    if (!confirm("Bu kullanıcıyı pasif duruma getirmek istediğinize emin misiniz? Kullanıcı sisteme giriş yapamayacak.")) return;
    try {
      await axios.patch(`/api/auth/users/${userId}/deactivate`);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: false } : u)));
    } catch (error) {
      alert("Pasifleştirme başarısız.");
    }
  };

  const handleDelete = async (userId, name) => {
    if (!confirm(`"${name}" kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
    try {
      await axios.delete(`/api/auth/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      alert("Silme başarısız.");
    }
  };

  const getRoleColor = (roles) => {
    if (roles?.includes("superadmin"))
      return "text-red-400 bg-red-900/30 border-red-800/50";
    if (roles?.includes("admin"))
      return "text-amber-400 bg-amber-900/30 border-amber-800/50";
    if (roles?.includes("premium"))
      return "text-violet-400 bg-violet-900/30 border-violet-800/50";
    return "text-stone-400 bg-stone-800/40 border-stone-700";
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? "text-emerald-400 bg-emerald-900/30 border-emerald-800/50"
      : "text-stone-500 bg-stone-800/40 border-stone-700";
  };

  if (loading) {
    return (
      <div className="p-8 text-stone-500 text-sm">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] text-white">
      <div className="flex-1">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => router.push("/shield/profile")}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-black text-stone-100 flex-1">Kullanıcı Yönetimi</h1>
        </div>

        {users?.length === 0 ? (
          <div className="p-8 text-stone-400">Henüz kullanıcı yok.</div>
        ) : (
          <div className="px-4 pb-4">
            <div className="rounded-xl border border-stone-800 bg-stone-900/40 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-800 bg-stone-900/60">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-stone-500">
                      İsim
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-stone-500">
                      E-posta
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-stone-500">
                      Roller
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-stone-500">
                      Durum
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-stone-500">
                      Organizasyon
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-stone-500">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((u) => (
                    <tr key={u._id} className="border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-stone-200">{u.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-stone-400">{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.roles?.map((role) => (
                            <span
                              key={role}
                              className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${getRoleColor([role])}`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${getStatusColor(u.isActive)}`}
                        >
                          {u.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-stone-300">{u.organizationName || "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {u.isActive ? (
                            <button
                              onClick={() => handleDeactivate(u._id)}
                              className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-amber-800/50 text-amber-400 bg-amber-900/20 hover:bg-amber-900/40 transition-colors"
                            >
                              Pasif Yap
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(u._id)}
                              className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-emerald-800/50 text-emerald-400 bg-emerald-900/20 hover:bg-emerald-900/40 transition-colors"
                            >
                              Aktif Yap
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(u._id, u.name)}
                            className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-red-800/50 text-red-400 bg-red-900/20 hover:bg-red-900/40 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default UsersPage;
