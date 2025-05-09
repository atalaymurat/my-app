// components/PhoneNumber.js
import React from "react";

const formatPhoneNumber = (phone) => {
  let cleaned = phone.toString().replace(/\D/g, "");

  // 2 sıfır başta varsa kaldır
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  // Şimdi cleaned 13 haneli, örnek: 905325323232

  // Dinamik ülke kodu çözümü
  let countryCode = "";
  let numberBody = "";

  // En yaygın 3 haneli kodları tanı
  const knownThreeDigitCodes = ["212", "213", "216", "218", "234", "233"];
  const knownOneDigitCodes = ["1"];

  if (knownThreeDigitCodes.includes(cleaned.slice(0, 3))) {
    countryCode = cleaned.slice(0, 3);
    numberBody = cleaned.slice(3);
  } else if (knownOneDigitCodes.includes(cleaned.slice(0, 1))) {
    countryCode = cleaned.slice(0, 1);
    numberBody = cleaned.slice(1);
  } else {
    countryCode = cleaned.slice(0, 2);
    numberBody = cleaned.slice(2);
  }

  const areaCode = numberBody.slice(0, 3);
  const part1 = numberBody.slice(3, 6);
  const part2 = numberBody.slice(6, 8);
  const part3 = numberBody.slice(8, 10);

  return `+${countryCode} (${areaCode}) ${part1} ${part2} ${part3}`;
};



export default function PhoneNumber({
  number,
  className = "",
  textSize = "text-base",
  textColor = "text-stone-400",
  hoverColor = "hover:text-blue-800",
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
