export const formatPhone = (phone) => {
  if (!phone) return "";
  const d = phone.replace(/\D/g, "");
  if (!d) return phone;
  if (d.length >= 11 && d.length <= 13) {
    const ccLen = d.length === 11 ? 1 : d.length === 12 ? 2 : 3;
    const cc = d.slice(0, ccLen);
    const local = d.slice(ccLen);
    const formatted = local.length === 10
      ? `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8, 10)}`
      : local;
    return `+${cc} ${formatted}`;
  }
  return "+" + d;
};
