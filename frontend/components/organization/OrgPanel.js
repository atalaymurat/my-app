"use client";
import { useEffect, useState } from "react";
import axiosOrg from "@/utils/axiosOrg";
import axios from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";

const ROLE_LABELS = { owner: "Sahip", admin: "Yönetici", member: "Üye" };
const ROLE_COLORS = {
  owner:  "text-amber-400 bg-amber-900/30 border-amber-800/50",
  admin:  "text-blue-400 bg-blue-900/30 border-blue-800/50",
  member: "text-stone-300 bg-stone-800/60 border-stone-700",
};

function RoleBadge({ role }) {
  return (
    <span className={`text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${ROLE_COLORS[role] || ROLE_COLORS.member}`}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-stone-900 border border-stone-700 text-stone-200 text-sm rounded-lg px-3 py-2 placeholder-stone-600 focus:outline-none focus:border-amber-600"
      />
    </div>
  );
}

export default function OrgPanel() {
  const { user } = useAuth();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  // invite
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteMsg, setInviteMsg] = useState(null);
  const [roleMsg, setRoleMsg] = useState(null);

  // settings form
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", website: "", taxNo: "" });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [settingsMsg, setSettingsMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const isOwnerOrAdmin = user?.orgRole === "owner" || user?.orgRole === "admin";
  const isOwner = user?.orgRole === "owner";

  useEffect(() => {
    axiosOrg.get("/me")
      .then(({ data }) => {
        setOrg(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          website: data.website || "",
          taxNo: data.taxNo || "",
        });
        if (data.logo) setLogoPreview(data.logo);
      })
      .catch(() => setOrg(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSettingsMsg(null);
    try {
      let logoUrl = org?.logo;

      if (logoFile) {
        const fd = new FormData();
        fd.append("image", logoFile);
        const { data: uploadData } = await axios.post("/api/upload?folder=org-logos", fd);
        logoUrl = uploadData.url;
      }

      const { data } = await axiosOrg.patch("/update", { ...form, logo: logoUrl });
      setOrg(data.org);
      setLogoFile(null);
      setSettingsMsg({ ok: true, text: "Kaydedildi." });
    } catch (err) {
      setSettingsMsg({ ok: false, text: err.response?.data?.message || "Hata oluştu." });
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteMsg(null);
    try {
      const { data } = await axiosOrg.post("/invite", { email: inviteEmail, role: inviteRole });
      setOrg(data.org);
      setInviteEmail("");
      setInviteMsg({ ok: true, text: "Üye eklendi." });
    } catch (err) {
      setInviteMsg({ ok: false, text: err.response?.data?.message || "Hata oluştu." });
    }
  };

  const handleRoleChange = async (memberId, role) => {
    setRoleMsg(null);
    try {
      const { data } = await axiosOrg.patch(`/member/${memberId}/role`, { role });
      setOrg(data.org);
      setRoleMsg({ ok: true, text: "Rol güncellendi." });
    } catch (err) {
      setRoleMsg({ ok: false, text: err.response?.data?.message || "Hata oluştu." });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-stone-500 text-sm">Yükleniyor...</div>
  );

  if (!org) return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950/80 p-6 text-center">
      <p className="text-stone-400 text-sm">Henüz bir organizasyona bağlı değilsiniz.</p>
    </div>
  );

  return (
    <div className="space-y-4">

      {/* Org Header */}
      <div className="rounded-2xl border border-l-4 border-stone-800 border-l-amber-500 bg-stone-950/80 p-5">
        <div className="flex items-center gap-4">
          {logoPreview ? (
            <img src={logoPreview} alt="logo" className="w-14 h-14 rounded-xl object-contain bg-stone-900 border border-stone-700 p-1" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-500 text-xl font-black">
              {org.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-0.5">Organizasyon</p>
            <h2 className="text-2xl font-black text-stone-100">{org.name}</h2>
            <span className="text-xs font-mono text-stone-500 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded">
              {org.slug}
            </span>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-stone-500 uppercase tracking-widest">Üyeler</p>
            <p className="text-3xl font-black text-amber-400 tabular-nums">{org.members.length}</p>
          </div>
        </div>
      </div>

      {/* Settings Form — owner/admin */}
      {isOwnerOrAdmin && (
        <div className="rounded-2xl border border-stone-800 bg-stone-950/80 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Organizasyon Bilgileri</p>
          <form onSubmit={handleSettingsSave} className="space-y-3">

            {/* Logo upload */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">Logo</label>
              <div className="flex items-center gap-3">
                {logoPreview && (
                  <img src={logoPreview} alt="logo" className="w-10 h-10 rounded-lg object-contain bg-stone-900 border border-stone-700 p-0.5" />
                )}
                <label className="cursor-pointer px-3 py-2 bg-stone-900 border border-stone-700 text-stone-300 text-sm rounded-lg hover:border-amber-600 transition-colors">
                  Görsel Seç
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Organizasyon Adı" value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} />
              <Field label="Vergi No" value={form.taxNo} onChange={(v) => setForm(f => ({ ...f, taxNo: v }))} />
              <Field label="Telefon" value={form.phone} onChange={(v) => setForm(f => ({ ...f, phone: v }))} type="tel" />
              <Field label="E-posta" value={form.email} onChange={(v) => setForm(f => ({ ...f, email: v }))} type="email" />
              <Field label="Website" value={form.website} onChange={(v) => setForm(f => ({ ...f, website: v }))} placeholder="https://" />
              <Field label="Adres" value={form.address} onChange={(v) => setForm(f => ({ ...f, address: v }))} />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button type="submit" disabled={saving}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors">
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              {settingsMsg && (
                <span className={`text-xs font-semibold ${settingsMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
                  {settingsMsg.text}
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="rounded-2xl border border-stone-800 bg-stone-950/80 overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-800">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Üye Listesi</p>
        </div>
        <div className="divide-y divide-stone-900">
          {org.members.map((m) => (
            <div key={m.userId} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 text-xs font-bold">
                  {m.name ? m.name.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-200">{m.name || "—"}</p>
                  <p className="text-xs text-stone-500">{m.email || ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isOwner && m.role !== "owner" ? (
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.userId, e.target.value)}
                    className="text-xs bg-stone-900 border border-stone-700 text-stone-300 rounded px-2 py-1 cursor-pointer"
                  >
                    <option value="admin">Yönetici</option>
                    <option value="member">Üye</option>
                  </select>
                ) : (
                  <RoleBadge role={m.role} />
                )}
              </div>
            </div>
          ))}
        </div>
        {roleMsg && (
          <div className={`px-5 py-2 text-xs font-semibold ${roleMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
            {roleMsg.text}
          </div>
        )}
      </div>

      {/* Invite Form — owner only */}
      {isOwner && (
        <div className="rounded-2xl border border-stone-800 bg-stone-950/80 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Üye Davet Et</p>
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2">
            <input type="email" required placeholder="E-posta adresi" value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-700 text-stone-200 text-sm rounded-lg px-3 py-2 placeholder-stone-600 focus:outline-none focus:border-amber-600"
            />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
              className="bg-stone-900 border border-stone-700 text-stone-300 text-sm rounded-lg px-3 py-2">
              <option value="member">Üye</option>
              <option value="admin">Yönetici</option>
            </select>
            <button type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-lg transition-colors">
              Davet Et
            </button>
          </form>
          {inviteMsg && (
            <p className={`mt-2 text-xs font-semibold ${inviteMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
              {inviteMsg.text}
            </p>
          )}
        </div>
      )}

    </div>
  );
}
