export const localeDate = (date) => {
  return new Date(date).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  })
}

export const formPrice = (number) => {
    let n = Number(number)
    return n.toLocaleString('tr-TR', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
    })
}

// Türkçe toLowerCase
export const toLowerCaseTR = (str) =>
  str.replace(/I/g, "ı").replace(/İ/g, "i").toLowerCase();

// Türkçe toUpperCase
export const toUpperCaseTR = (str) =>
  str.replace(/i/g, "İ").replace(/ı/g, "I").toUpperCase();

// Türkçe capitalize (her kelimenin ilk harfi büyük)
export const capitalizeTR = (str) =>
  toLowerCaseTR(str).replace(/\b\w/g, (char) => toUpperCaseTR(char));