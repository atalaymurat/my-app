// components/PhoneNumber.js
import React from "react";

const formatPhoneNumber = (phone) => {
  const cleaned = phone.toString().replace(/\D/g, "");

  // Türkiye formatı (90 532 111 22 22)
  if (cleaned.length === 11 && cleaned.startsWith("90")) {
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/,
      "$1 $2 $3 $4 $5"
    );
  }

  // Türkiye formatı (532 111 22 22)
  if (cleaned.length === 10 && cleaned.startsWith("5")) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  }

  // Diğer formatlar (XX XXX XXX XX XX)
  return cleaned.replace(
    /(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/,
    "$1 $2 $3 $4 $5"
  );
};

export default function PhoneNumber({
  number,
  className = "",
  textSize = "text-base",
  textColor = "text-gray-800",
  hoverColor = "hover:text-blue-600",
}) {
  const formattedNumber = formatPhoneNumber(number);

  return (
    <a
      href={`tel:${number.toString().replace(/\D/g, "")}`}
      className={`${textSize} ${textColor} ${hoverColor} transition-colors duration-200 ${className}`}
    >
      {formattedNumber}
    </a>
  );
}
