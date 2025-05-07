// utils/contactExtractor.js

const { cities } = require("../helpers/cities");

const findContactPage = ($, siteUrl, keywords) => {
  const normalizeUrl = (base, href) => {
    try {
      return new URL(href, base).href;
    } catch (e) {
      return null;
    }
  };

  let contactPageUrl = null;

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().toLowerCase();

    if (
      href &&
      keywords.some(
        (kw) => href.toLowerCase().includes(kw) || text.includes(kw)
      )
    ) {
      contactPageUrl = normalizeUrl(siteUrl, href);
      return false; // break
    }
  });

  return contactPageUrl;
};

const extractPhone = ($$) => {
  let phone = null;

  $$("body *").each((_, el) => {
    if (phone) return;

    const elText = $$(el).text().trim();

    const phoneMatch = elText.match(
      /(?:\+90\s*|0\s*)?[\(]?(\d{3})[\)]?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})/
    );

    if (phoneMatch) {
      const areaCode = phoneMatch[1];
      const part1 = phoneMatch[2];
      const part2 = phoneMatch[3];
      const part3 = phoneMatch[4];

      phone = `+90 (${areaCode}) ${part1} ${part2} ${part3}`;
    }
  });

  return phone;
};

const extractEmail = ($$, priorityEmails = ["info", "bilgi", "imalat"]) => {
  let emails = [];

  $$("body *").each((_, el) => {
    const elText = $$(el).text().trim();
    const emailMatch = elText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) {
      emails.push(emailMatch[0]);
    }
  });

  // Öncelikli e-posta adreslerini filtrele
  const prioritizedEmails = emails.filter((email) =>
    priorityEmails.some((keyword) =>
      email.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  // Eğer öncelikli e-posta adresi varsa, bunları döndür
  if (prioritizedEmails.length > 0) {
    return prioritizedEmails[0]; // İlk öncelikli e-posta adresini döndür
  }

  // Eğer öncelikli e-posta yoksa, ilk bulunan e-posta adresini döndür
  return emails.length > 0 ? emails[0] : null;
};

// Türkçe karakterleri ASCII karşılıklarına dönüştüren fonksiyon
const normalizeString = (str) => {
  const map = {
    ç: "c",
    ğ: "g",
    ö: "o",
    ş: "s",
    ü: "u",
    ı: "i",
    İ: "i",
    Ç: "c",
    Ğ: "g",
    Ş: "s",
    Ö: "o",
    Ü: "u",
  };
  return str.replace(/[çğıöşüİÇĞÖŞÜı]/g, (match) => map[match]);
};

const extractAddresses = ($$) => {
  const keywords = [
    "adres",
    "address",
    "fabrika",
    "cadde",
    "sokak",
    "no",
    "mahallesi",
    "mah",
    "sok",
    "sk",
    "cad",
    "yolu",
    "organize",
    "osb",
    "sanayi",
    "site",
    "no:",
    "bulvar",
    "bulvarı",
    "mahallesi",
    "sokak",
    "park",
    "şehir",
    "yokuş",
    "mevkii",
    "yakın",
    "köy",
    "şehirlerarası",
    "otoban",
    "caddesi",
    "düz",
    "şehir merkezi",
    "kent",
    "bağlantı",
    "pazar",
    "devlet caddesi",
    "bulvarı",
    "blok",
  ];

  const normalizedCities = cities.map(normalizeString);

  const cityRegex = new RegExp(`\\b(${normalizedCities.join("|")})\\b`, "i");

  const isCode = (line) => {
    const codePattern =
      /\b(var|let|const|function|return|if|for|while|try|catch)\b|[\(\)\{\};=]/;
    return codePattern.test(line);
  };

  const rawText = $$.text(); // Sayfadaki tüm düz metin
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => !isCode(line))
    .filter((line) => line.length > 0 && line.length <= 250);

  const addresses = [];

  lines.forEach((line, i) => {
    const normalizedLine = normalizeString(line); // Normalize for searching, not for final address

    // Anahtar kelime eşleşmesi
    const hasKeyword = keywords.some((kw) =>
      normalizedLine.toLowerCase().includes(kw.toLowerCase())
    );

    // Şehir eşleşmesi
    const cityMatch = normalizedLine.match(cityRegex);
    const matchedCity = cityMatch
      ? cities.find(
          (c) => normalizeString(c).toLowerCase() === cityMatch[0].toLowerCase()
        )
      : null;

    // Gereksiz verileri atmak için kontrol (JSON, script gibi)
    const isNotScriptData = !normalizedLine.match(/\bvar\s+[a-zA-Z0-9_]+\s*=/);

    // Yalnızca geçerli adresler için işlem yap
    if (hasKeyword && matchedCity && isNotScriptData) {
      let normalizedAddress = line
        .replace(/[\n\r\t]+/g, " ")
        .replace(/[^\w\s]/g, "")
        .trim();

      // Adresin uzunluğunu kontrol et
      if (normalizedAddress.length > 100) {
        normalizedAddress = "Yanlış: Adres çok uzun";
      }

      // Aynı içerikte adresi tekrar ekleme
      const alreadyExists = addresses.some(
        (addr) => addr.raw === line.trim() // Keep the original line with Turkish characters
      );
      if (!alreadyExists) {
        console.log(`📍 Added Address: ${line.trim()}`); // Log with original Turkish characters
        addresses.push({
          title: "merkez",
          line1: "",
          line2: "",
          district: "",
          city: matchedCity || null,
          country: "Tr",
          zip: "",
          raw: line.trim(), // Keep the original address with Turkish characters
        });
      }
    }
  });

  return addresses.filter((a) => a.raw !== "Yanlış: Adres çok uzun");
};


module.exports = {
  findContactPage,
  extractPhone,
  extractEmail,
  extractAddresses,
};
