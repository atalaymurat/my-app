"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "@/utils/axios";

const ERROR_MESSAGES = {
  empty: "Dosya boş görünüyor. Kommo dışa aktarım CSV dosyasını seçin.",
  type: "Lütfen .csv uzantılı bir Kommo dosyası seçin.",
  headers: "CSV başlıkları tanınmadı. Kommo kişi dışa aktarım formatını kullandığınızdan emin olun.",
  rows: "Aktarılabilecek kişi bulunamadı. Satırlarda isim, e-posta veya telefon olmalı.",
  selected: "İçe aktarmak için en az bir geçerli kişi seçin.",
  backend: "Kommo kişileri içe aktarılamadı. Dosyayı kontrol edip tekrar deneyin.",
  partial: "Bazı Kommo satırları aktarılamadı. Başarılı kayıtlar kişi listesine eklendi.",
};

const EMAIL_COLUMNS = ["İş e-postası", "Kişisel e-posta", "Diğer e-posta"];
const PHONE_COLUMNS = [
  "İş telefonu",
  "İş DD telefonu",
  "Cep telefonu",
  "Faks",
  "Ev telefonu",
  "Diğer telefon",
];
const IMPORT_CHUNK_SIZE = 200;

function parseSemicolonCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        field += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ";" && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);

  return rows;
}

function rowsToObjects(rows) {
  const [headers = [], ...body] = rows;
  const cleanHeaders = headers.map((header, index) =>
    (index === 0 ? header.replace(/^\uFEFF/, "") : header).trim()
  );

  return body.map((row, index) => ({
    id: index,
    rowNumber: index + 2,
    raw: Object.fromEntries(cleanHeaders.map((header, i) => [header, row[i]?.trim() || ""])),
  }));
}

function collectValues(row, columns, { splitComma = false } = {}) {
  const values = columns.flatMap((column) => {
    const value = String(row[column] || "").trim();
    return splitComma ? value.split(",").map((item) => item.trim()) : [value];
  });

  return [...new Set(values.filter(Boolean))];
}

function buildPreviewRow(item) {
  const raw = item.raw;
  const displayName = [raw["Ad"], raw["Soyisim"]]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ");
  const emails = collectValues(raw, EMAIL_COLUMNS, { splitComma: true });
  const phones = collectValues(raw, PHONE_COLUMNS);
  const isValid = Boolean(displayName || emails.length || phones.length);

  return {
    ...item,
    displayName,
    emails,
    phones,
    status: isValid ? "ready" : "missing",
    selected: isValid,
    isValid,
  };
}

function hasUsefulHeaders(headers) {
  return headers.some((header) =>
    ["Ad", "Soyisim", ...EMAIL_COLUMNS, ...PHONE_COLUMNS].includes(header)
  );
}

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export default function KommoCsvImportModal({ open, onClose, onImported }) {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape" && !importing) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [importing, onClose, open]);

  useEffect(() => {
    if (open) return;
    setFile(null);
    setPreviewRows([]);
    setError("");
    setResult(null);
    setParsing(false);
    setImporting(false);
  }, [open]);

  const summary = useMemo(() => {
    const valid = previewRows.filter((row) => row.isValid).length;
    const selected = previewRows.filter((row) => row.isValid && row.selected).length;
    return {
      total: previewRows.length,
      valid,
      skipped: previewRows.length - valid,
      selected,
    };
  }, [previewRows]);

  const parseFile = async (selectedFile) => {
    setError("");
    setResult(null);
    setPreviewRows([]);

    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError(ERROR_MESSAGES.type);
      return;
    }
    if (selectedFile.size === 0) {
      setError(ERROR_MESSAGES.empty);
      return;
    }

    setParsing(true);
    try {
      const text = await selectedFile.text();
      if (!text.trim()) {
        setError(ERROR_MESSAGES.empty);
        return;
      }

      const parsedRows = parseSemicolonCsv(text);
      const headers = parsedRows[0]?.map((header, index) =>
        (index === 0 ? header.replace(/^\uFEFF/, "") : header).trim()
      ) || [];
      if (!headers.length || !hasUsefulHeaders(headers)) {
        setError(ERROR_MESSAGES.headers);
        return;
      }

      const rows = rowsToObjects(parsedRows).map(buildPreviewRow);
      if (!rows.some((row) => row.isValid)) {
        setError(ERROR_MESSAGES.rows);
        return;
      }

      setPreviewRows(rows);
    } catch {
      setError(ERROR_MESSAGES.headers);
    } finally {
      setParsing(false);
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    await parseFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewRows([]);
    setError("");
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const toggleRow = (id) => {
    setPreviewRows((rows) =>
      rows.map((row) =>
        row.id === id && row.isValid ? { ...row, selected: !row.selected } : row
      )
    );
  };

  const setAllSelected = (selected) => {
    setPreviewRows((rows) =>
      rows.map((row) => (row.isValid ? { ...row, selected } : row))
    );
  };

  const importSelected = async () => {
    const rows = previewRows.filter((row) => row.isValid && row.selected);
    if (!rows.length) {
      setError(ERROR_MESSAGES.selected);
      return;
    }

    setImporting(true);
    setError("");
    try {
      const aggregate = {
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 0,
        errors: [],
      };

      for (let index = 0; index < rows.length; index += IMPORT_CHUNK_SIZE) {
        const chunk = rows.slice(index, index + IMPORT_CHUNK_SIZE);
        const { data } = await axios.post("/api/contact/import/kommo-csv", {
          rows: chunk.map((row) => row.raw),
        });

        if (!data.success) throw new Error(data.message);

        aggregate.created += data.result?.created || 0;
        aggregate.updated += data.result?.updated || 0;
        aggregate.skipped += data.result?.skipped || 0;
        aggregate.failed += data.result?.failed || 0;
        aggregate.errors.push(...(data.result?.errors || []));
      }

      setResult(aggregate);
      onImported?.(aggregate);
    } catch (err) {
      setError(err.response?.data?.message || ERROR_MESSAGES.backend);
    } finally {
      setImporting(false);
    }
  };

  if (!open || !mounted) return null;

  const transferred = result ? (result.created || 0) + (result.updated || 0) : 0;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0" onClick={() => !importing && onClose()} />
      <div className="relative z-10 w-full max-w-5xl max-h-[88vh] overflow-hidden rounded-xl border border-stone-700 bg-stone-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-700 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-stone-100">Kommo CSV Import</h2>
            <p className="text-xs text-stone-500">Kommo kişi CSV dosyasından kişi aktarın.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={importing}
            className="h-8 w-8 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-white disabled:opacity-50"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>

        <div className="max-h-[calc(88vh-122px)] overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-stone-700 bg-stone-950/40 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-stone-300">
                {file ? file.name : "Kommo CSV dosyası seçin"}
              </p>
              <p className="text-xs text-stone-500">
                {file ? formatFileSize(file.size) : "Dosya seçildikten sonra kişiler ön izleme tablosunda görünecek."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer rounded-lg border border-amber-600 bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-500">
                CSV Seç
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  disabled={parsing || importing}
                  className="hidden"
                />
              </label>
              {file && (
                <button
                  type="button"
                  onClick={clearFile}
                  disabled={parsing || importing}
                  className="rounded-lg border border-stone-700 px-3 py-2 text-xs font-semibold text-stone-300 hover:bg-stone-800 disabled:opacity-50"
                >
                  Kaldır
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-800/70 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          {parsing && <div className="text-sm text-stone-400">CSV okunuyor...</div>}

          {previewRows.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                <Summary label="Toplam Satır" value={summary.total} />
                <Summary label="Geçerli" value={summary.valid} />
                <Summary label="Atlanacak" value={summary.skipped} />
                <Summary label="Seçili" value={summary.selected} />
                <Summary label="Aktarılacak" value={summary.selected} highlight />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-stone-500">
                  İçe aktarılacak kişi sayısı: <span className="font-bold text-stone-200">{summary.selected}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAllSelected(true)}
                    className="rounded-lg border border-stone-700 px-2.5 py-1.5 text-xs text-stone-300 hover:bg-stone-800"
                  >
                    Tümünü Seç
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllSelected(false)}
                    className="rounded-lg border border-stone-700 px-2.5 py-1.5 text-xs text-stone-300 hover:bg-stone-800"
                  >
                    Seçimi Kaldır
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-stone-700">
                <table className="min-w-full divide-y divide-stone-800 text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400">
                    <tr>
                      <th className="w-10 px-3 py-2"></th>
                      <th className="px-3 py-2">Ad</th>
                      <th className="px-3 py-2">E-posta</th>
                      <th className="px-3 py-2">Telefon</th>
                      <th className="px-3 py-2">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {previewRows.map((row) => (
                      <tr key={row.id} className={row.isValid ? "text-stone-300" : "text-stone-600"}>
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={row.selected}
                            disabled={!row.isValid || importing}
                            onChange={() => toggleRow(row.id)}
                            className="h-4 w-4 accent-amber-600"
                          />
                        </td>
                        <td className="max-w-[220px] px-3 py-2 font-medium">{row.displayName || "-"}</td>
                        <td className="max-w-[260px] px-3 py-2">
                          {row.emails[0] || "-"}
                          {row.emails.length > 1 && <span className="text-stone-500"> +{row.emails.length - 1}</span>}
                        </td>
                        <td className="max-w-[220px] px-3 py-2">
                          {row.phones[0] || "-"}
                          {row.phones.length > 1 && <span className="text-stone-500"> +{row.phones.length - 1}</span>}
                        </td>
                        <td className="px-3 py-2">
                          {row.isValid ? (
                            <span className="rounded-full bg-emerald-950 px-2 py-1 text-[11px] text-emerald-300">Hazır</span>
                          ) : (
                            <span className="rounded-full bg-stone-800 px-2 py-1 text-[11px] text-stone-500">Eksik bilgi</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result && (
            <div className="rounded-lg border border-emerald-800/70 bg-emerald-950/30 p-3 text-sm text-emerald-300">
              <p className="font-bold">Aktarılan kişi sayısı: {transferred}</p>
              <p className="mt-1 text-xs opacity-80">
                Oluşturulan: {result.created || 0}, Güncellenen: {result.updated || 0}, Atlanan: {result.skipped || 0}, Hatalı: {result.failed || 0}
              </p>
              {result.failed > 0 && <p className="mt-1 text-xs text-amber-300">{ERROR_MESSAGES.partial}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-stone-700 px-4 py-3">
          <p className="text-xs text-stone-500">
            {summary.selected ? `${summary.selected} kişi aktarılacak.` : "Aktarım için geçerli kişi seçin."}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={importing}
              className="rounded-lg border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 hover:bg-stone-800 disabled:opacity-50"
            >
              Kapat
            </button>
            <button
              type="button"
              onClick={importSelected}
              disabled={importing || parsing || summary.selected === 0}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {importing ? "Aktarılıyor..." : "Seçili Kişileri Aktar"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Summary({ label, value, highlight = false }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? "border-amber-700 bg-amber-950/30" : "border-stone-700 bg-stone-950/40"}`}>
      <p className="text-[11px] font-semibold uppercase text-stone-500">{label}</p>
      <p className={`mt-1 text-lg font-black ${highlight ? "text-amber-300" : "text-stone-200"}`}>{value}</p>
    </div>
  );
}
