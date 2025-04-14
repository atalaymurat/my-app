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