"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import MessageBlock from "@/components/messageBlock";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { localeDate } from "@/lib/helpers";
import SnapshotTimeline from "./SnapshotTimeline";
import SnapshotEditor from "./SnapshotEditor";
import UserAssignment from "./UserAssignment";

const STATUS_STYLE = {
  draft: "bg-stone-800 text-stone-400 border-stone-600",
  published: "bg-emerald-900/40 text-emerald-400 border-emerald-700/50",
  archived: "bg-stone-900/60 text-stone-500 border-stone-700",
  superseded: "bg-stone-900/60 text-stone-600 border-stone-700",
};

const STATUS_LABEL = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
  superseded: "Eski",
};

function Section({ title, children, action }) {
  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{title}</p>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLE[status] || STATUS_STYLE.draft}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-stone-800 last:border-0">
      <span className="text-xs text-stone-500 shrink-0">{label}</span>
      <span className="text-xs text-stone-300 font-semibold text-right">{value}</span>
    </div>
  );
}

export default function PriceListDetail() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  const isSuperAdmin = user?.roles?.includes("superadmin");
  const [priceList, setPriceList] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingSnapshotId, setEditingSnapshotId] = useState(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    if (!isSuperAdmin || !id) return;

    setLoading(true);
    Promise.all([
      axios.get(`/api/price-list/${id}`),
      axios.get(`/api/price-list/${id}/snapshots`),
    ])
      .then(([plRes, snRes]) => {
        if (plRes.data.success) setPriceList(plRes.data.record);
        if (snRes.data.success) setSnapshots(snRes.data.records || []);
      })
      .catch(() => setMessage({ text: "Veriler yüklenemedi.", type: "error" }))
      .finally(() => setLoading(false));
  }, [id, isSuperAdmin]);

  const handleCreateSnapshot = async () => {
    setActionLoading(true);
    try {
      const { data } = await axios.post(`/api/price-list/${id}/snapshot`, { notes: "" });
      if (data.success) {
        setSnapshots((prev) => [data.record, ...prev]);
        setPriceList((prev) => ({ ...prev, totalVersions: data.record.version }));
        setMessage({
          text: `Snapshot v${data.record.version} oluşturuldu. ${data.record.summary.totalProducts} ürün, ${data.record.summary.totalVariants} varyant eklendi.`,
          type: "success",
        });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Snapshot oluşturulamadı.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloneSnapshot = async () => {
    setActionLoading(true);
    try {
      const { data } = await axios.post(`/api/price-list/${id}/snapshot/clone`, { notes: "" });
      if (data.success) {
        setSnapshots((prev) => [data.record, ...prev]);
        setPriceList((prev) => ({ ...prev, totalVersions: data.record.version }));
        setMessage({
          text: `Snapshot v${data.record.version} klonlandı. Fiyatları düzenleyip yayınlayabilirsiniz.`,
          type: "success",
        });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Klonlama başarısız.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishSnapshot = async (snapshotId) => {
    if (!confirm("Bu snapshot yayınlanacak. Mevcut yayındaki versiyon otomatik olarak eski olarak işaretlenecek. Devam edilsin mi?")) return;
    setActionLoading(true);
    try {
      const { data } = await axios.patch(`/api/price-list/${id}/snapshot/${snapshotId}/publish`);
      if (data.success) {
        const { data: snRes } = await axios.get(`/api/price-list/${id}/snapshots`);
        if (snRes.success) setSnapshots(snRes.records || []);
        setPriceList((prev) => ({ ...prev, status: "published", currentVersion: data.record.version }));
        setMessage({ text: `v${data.record.version} yayınlandı.`, type: "success" });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Yayınlama başarısız.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm("Bu liste arşivlenecek ve kullanıcılara kapatılacak. Devam edilsin mi?")) return;
    setActionLoading(true);
    try {
      const { data } = await axios.patch(`/api/price-list/${id}/archive`);
      if (data.success) {
        setPriceList((prev) => ({ ...prev, status: "archived" }));
        const { data: snRes } = await axios.get(`/api/price-list/${id}/snapshots`);
        if (snRes.success) setSnapshots(snRes.records || []);
        setMessage({ text: "Liste arşivlendi.", type: "success" });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Arşivleme başarısız.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return <div className="p-8 text-stone-400">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  if (loading) {
    return <div className="p-8 text-stone-500">Yükleniyor...</div>;
  }

  if (!priceList) {
    return <div className="p-8 text-stone-400">Fiyat listesi bulunamadı.</div>;
  }

  const hasPublishedSnapshot = snapshots.some((snap) => snap.status === "published");

  return (
    <div className="text-white max-w-5xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          onClick={() => router.push("/shield/price-list")}
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-stone-100 flex-1 truncate">{priceList.title}</h1>
        <StatusBadge status={priceList.status} />
      </div>

      {message && <MessageBlock message={message} />}

      <Section title="Liste Bilgileri">
        <div className="space-y-0">
          <div className="flex items-start justify-between gap-3 py-2 border-b border-stone-800">
            <span className="text-xs text-stone-500 shrink-0">Marka</span>
            <div className="flex items-center gap-2">
              {priceList.make?.logo && (
                <img
                  src={priceList.make.logo}
                  alt={priceList.make?.name || "Marka"}
                  className="w-6 h-6 rounded-full object-cover border border-stone-700"
                />
              )}
              <span className="text-xs text-stone-300 font-semibold text-right">{priceList.make?.name || "-"}</span>
            </div>
          </div>
          <InfoRow label="Döviz" value={priceList.currency} />
          <InfoRow label="Açıklama" value={priceList.description} />
          <InfoRow label="Durum" value={<StatusBadge status={priceList.status} />} />
          <InfoRow
            label="Aktif Versiyon"
            value={priceList.currentVersion > 0 ? `v${priceList.currentVersion}` : "Henüz yayınlanmadı"}
          />
          <InfoRow label="Toplam Versiyon" value={String(priceList.totalVersions ?? 0)} />
          <InfoRow label="Oluşturulma" value={priceList.createdAt ? localeDate(priceList.createdAt) : "-"} />
          <InfoRow label="Güncelleme" value={priceList.updatedAt ? localeDate(priceList.updatedAt) : "-"} />
        </div>
      </Section>

      <Section title="İşlemler">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCreateSnapshot}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-500 text-sm font-bold text-white transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Yeni Snapshot
          </button>

          {hasPublishedSnapshot && (
            <button
              onClick={handleCloneSnapshot}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 border border-stone-600 text-sm font-bold text-white transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
              Klonla (Fiyat Güncelle)
            </button>
          )}

          {priceList.status !== "archived" && (
            <button
              onClick={handleArchive}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-sm font-semibold text-stone-400 hover:text-stone-200 transition-colors disabled:opacity-50"
            >
              Arşivle
            </button>
          )}
        </div>
      </Section>

      {editingSnapshotId && (
        <SnapshotEditor
          snapshotId={editingSnapshotId}
          priceListId={id}
          onClose={() => setEditingSnapshotId(null)}
          onSaved={() => {
            axios.get(`/api/price-list/${id}/snapshots`)
              .then(({ data }) => {
                if (data.success) setSnapshots(data.records);
              });
          }}
        />
      )}

      <Section title="Snapshot Geçmişi">
        <SnapshotTimeline
          snapshots={snapshots}
          onPublish={handlePublishSnapshot}
          onEdit={(snapshotId) => setEditingSnapshotId(snapshotId)}
          actionLoading={actionLoading}
        />
      </Section>

      {priceList && priceList.status !== "archived" && (
        <UserAssignment
          priceListId={id}
          ownerOrganizationId={priceList.organization}
          assignedOrganizations={priceList.assignedOrgs || []}
        />
      )}
    </div>
  );
}
