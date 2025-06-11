import React from "react";
import UserAvatar from "../UserAvatar";
import PhoneNumber from "../PhoneNumber";
import { formPrice } from "@/lib/helpers";

const TableTemplate = ({ title, data = [], columns = [], minRows = 10 }) => {
  const paddedData = [...data];
  while (paddedData.length < minRows) {
    paddedData.push(null);
  }

  return (
    <div className="overflow-hidden my-2 text-stone-300 px-2 py-2">
      {title && <div className="text-2xl font-bold py-4">{title}</div>}

      {/* Header */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-black text-stone-200 border-b py-2 px-2 rounded-t-xl font-semibold">
        {columns.map((col, idx) => (
          <div key={idx} className={`${col.className || ""}`}>
            {col.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      {paddedData.map((item, rowIdx) => (
        <div
          key={rowIdx}
          className="h-19 grid grid-cols-2 md:grid-cols-3 gap-2 border-b py-2 px-2 text-stone-300"
        >
          {columns.map((col, colIdx) => {
            if (!item) {
              return (
                <div
                  key={colIdx}
                  className={`text-stone-500 ${col.className || ""}`}
                >
                  —
                </div>
              );
            }

            const value = item[col.key];

            if (colIdx === 0) {
              const imageUrl = col.imageKey ? item[col.imageKey] : null;

              return (
                <div
                  key={colIdx}
                  className={`flex flex-row items-center overflow-hidden ${
                    col.className || ""
                  }`}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item[col.key]}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <div className="mr-2">
                      <UserAvatar name={item[col.key]} />
                    </div>
                  )}
                  <div className="flex flex-col font-semibold text-stone-200 text-lg capitalize truncate">
                    {value?.length > 25
                      ? value.slice(0, 25) + "…"
                      : value?.length > 0
                      ? value
                      : "-"}
                  </div>
                </div>
              );
            }

            if (col.type === "objectArray" && Array.isArray(value)) {
              return (
                <div
                  key={colIdx}
                  className={`text-xs text-stone-400 overflow-hidden ${
                    col.className || ""
                  }`}
                >
                  {value.slice(0, 3).map((obj, i) => (
                    <div key={i} className="truncate text-nowrap">
                      {col.subFields
                        ?.map((fieldKey) => obj[fieldKey])
                        .join(" ") || "-"}
                    </div>
                  ))}
                </div>
              );
            }

            if (col.type === "price") {
              return (
                <div
                  key={colIdx}
                  className={`text-xs text-stone-400 overflow-hidden ${
                    col.className || ""
                  }`}
                >
                  {formPrice(item[col.key].value)} {item[col.key].currency}
                </div>
              );
            }

            if (col.type === "array" && Array.isArray(value)) {
              return (
                <div
                  key={colIdx}
                  className={`text-sm overflow-hidden ${col.className || ""}`}
                >
                  {value.slice(0, 3).map((v, i) => (
                    <div
                      key={i}
                      className="text-nowrap truncate text-stone-400"
                    >
                      {col.format === "phone" ? (
                        <PhoneNumber number={v} textSize="text-sm" />
                      ) : (
                        v
                      )}
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div key={colIdx} className={`truncate ${col.className || ""}`}>
                {value || "-"}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default TableTemplate;
