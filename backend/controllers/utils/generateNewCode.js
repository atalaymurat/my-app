const { transliterate } = require("transliteration");

function generateNewDocCode({ baseCode = "", type = "TEKLIF", title = "DOC", version = 1 }) {
  const now = new Date();

  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;

  const cleanType = type.toUpperCase().replace(/\s+/g, "").slice(0, 3); // type'ı temizle ve ilk 3 karakter al

  let cleanTitle = transliterate(title)        // transliterate ile Türkçe karakterleri çevir
    .toUpperCase()                             // büyük harf yap
    .replace(/\s+/g, "_")                      // boşlukları alt çizgi yap
    .replace(/[^A-Z0-9_]/g, "");               // harf, rakam ve _ dışındakileri temizle

  cleanTitle = cleanTitle.slice(0, 5);         // sadece 5 karakter al

  const versionStr = String(version).padStart(2, "0");

  return `${datePart}_${cleanType}_${cleanTitle}_${versionStr}`;
}

module.exports = generateNewDocCode;