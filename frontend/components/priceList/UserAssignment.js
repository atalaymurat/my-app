"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "@/utils/axios";
import axiosOrg from "@/utils/axiosOrg";
import MessageBlock from "@/components/messageBlock";
import { useAuth } from "@/context/AuthContext";

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function normalizeId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
}

export default function UserAssignment({ priceListId, ownerOrganizationId, assignedOrganizations: initialAssigned }) {
  const { user } = useAuth();
  const isSuperAdmin = user?.roles?.includes("superadmin");
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [assignedOrgIds, setAssignedOrgIds] = useState((initialAssigned || []).map(normalizeId).filter(Boolean));
  const [search, setSearch] = useState("");
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const normalizedOwnerOrgId = normalizeId(ownerOrganizationId || user?.orgId);

  useEffect(() => {
    const baseIds = (initialAssigned || []).map(normalizeId).filter(Boolean);
    const nextIds = normalizedOwnerOrgId ? [...new Set([...baseIds, normalizedOwnerOrgId])] : baseIds;
    setAssignedOrgIds(nextIds);
  }, [initialAssigned, normalizedOwnerOrgId]);

  useEffect(() => {
    setLoadingOrganizations(true);

    const request = isSuperAdmin ? axiosOrg.get("/list") : axiosOrg.get("/me");

    request
      .then(({ data }) => {
        const rawOrganizations = isSuperAdmin
          ? data.organizations || []
          : data?._id
            ? [{
                _id: data._id,
                name: data.name,
                slug: data.slug,
                memberCount: Array.isArray(data.members) ? data.members.length : 0,
              }]
            : [];

        const uniqueOrganizations = Array.from(
          new Map(
            rawOrganizations
              .map((organization) => ({
                _id: normalizeId(organization._id),
                name: organization.name || "İsimsiz Organizasyon",
                slug: organization.slug || "-",
                memberCount: organization.memberCount || 0,
              }))
              .filter((organization) => organization._id)
              .map((organization) => [organization._id, organization])
          ).values()
        ).sort((a, b) => (a.name || "").localeCompare(b.name || "", "tr"));

        setAllOrganizations(uniqueOrganizations);
      })
      .catch(() => setAllOrganizations([]))
      .finally(() => setLoadingOrganizations(false));
  }, [isSuperAdmin]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(t);
  }, [message]);

  const resolvedAssignedOrganizations = useMemo(
    () => allOrganizations.filter((organization) => assignedOrgIds.includes(organization._id)),
    [allOrganizations, assignedOrgIds]
  );

  const unresolvedAssignedOrgIds = useMemo(
    () => assignedOrgIds.filter((id) => !allOrganizations.some((organization) => organization._id === id)),
    [assignedOrgIds, allOrganizations]
  );

  const availableOrganizations = useMemo(
    () => allOrganizations.filter((organization) => {
      if (assignedOrgIds.includes(organization._id)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (organization.name || "").toLowerCase().includes(q) || (organization.slug || "").toLowerCase().includes(q);
    }),
    [allOrganizations, assignedOrgIds, search]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.patch(`/api/price-list/${priceListId}`, {
        accessScope: "selected",
        assignedOrganizations: normalizedOwnerOrgId
          ? [...new Set([...assignedOrgIds, normalizedOwnerOrgId])]
          : assignedOrgIds,
      });
      if (data.success) {
        setMessage({ text: "Organizasyon erişimi kaydedildi.", type: "success" });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Kayıt başarısız.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Organizasyon Erişimi">
      <p className="text-xs text-stone-500 mb-4">
        Bu fiyat listesi seçili organizasyonların tum kullanicilarina otomatik olarak acilir.
      </p>

      {(resolvedAssignedOrganizations.length > 0 || unresolvedAssignedOrgIds.length > 0) && (
        <div className="space-y-1.5 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Yetkili Organizasyonlar ({assignedOrgIds.length})
          </p>

          {resolvedAssignedOrganizations.map((organization) => {
            const isOwnerOrg = organization._id === normalizedOwnerOrgId;
            return (
              <div
                key={organization._id}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-950/20 border border-blue-800/40"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-200 truncate">{organization.name}</p>
                  <p className="text-[10px] text-stone-500 truncate">
                    {organization.slug} • {organization.memberCount} kullanici
                  </p>
                </div>
                {isOwnerOrg ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Varsayilan</span>
                ) : (
                  <button
                    onClick={() => setAssignedOrgIds((prev) => prev.filter((id) => id !== organization._id))}
                    className="shrink-0 w-6 h-6 rounded-lg bg-stone-800 hover:bg-red-900/40 border border-stone-700 hover:border-red-700/50 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3 h-3 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}

          {unresolvedAssignedOrgIds.map((organizationId) => (
            <div
              key={organizationId}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-stone-900/40 border border-stone-700"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-300 truncate">Organizasyon bilgisi bulunamadı</p>
                <p className="text-[10px] text-stone-500 font-mono truncate">{organizationId}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isSuperAdmin && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">
            Organizasyon Ekle {!loadingOrganizations ? `(${availableOrganizations.length})` : ""}
          </p>
          <input
            type="text"
            placeholder="Organizasyon adi veya slug ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-stone-800 border border-stone-600 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:border-blue-500 transition-colors"
          />

          {loadingOrganizations ? (
            <p className="text-xs text-stone-500 mt-2">Yukleniyor...</p>
          ) : availableOrganizations.length > 0 ? (
            <div className="mt-2 max-h-80 overflow-y-auto rounded-xl border border-stone-700 divide-y divide-stone-800">
              {availableOrganizations.map((organization) => (
                <button
                  key={organization._id}
                  type="button"
                  onClick={() => {
                    setAssignedOrgIds((prev) => [...prev, organization._id]);
                    setSearch("");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-stone-800/60 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-stone-700 border border-stone-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-stone-300">
                      {organization.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-stone-300 truncate">{organization.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{organization.slug}</p>
                  </div>
                  <span className="text-[10px] text-stone-600 shrink-0">{organization.memberCount} kullanici</span>
                  <svg className="w-4 h-4 text-stone-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              ))}
            </div>
          ) : search ? (
            <p className="text-xs text-stone-500 mt-2">Sonuc bulunamadi.</p>
          ) : (
            <p className="text-xs text-stone-500 mt-2">Eklenebilecek baska organizasyon yok.</p>
          )}
        </div>
      )}

      {!isSuperAdmin && (
        <p className="text-xs text-stone-500">
          Bu liste varsayilan olarak kendi organizasyonunuzun tum kullanicilarina aciktir.
        </p>
      )}

      {message && <MessageBlock message={message} />}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-500 text-sm font-bold text-white transition-colors disabled:opacity-50"
      >
        {saving ? "Kaydediliyor..." : "Organizasyon Erisimini Kaydet"}
      </button>
    </Section>
  );
}
