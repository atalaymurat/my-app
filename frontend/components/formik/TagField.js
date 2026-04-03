import { useState } from "react";
import { useField } from "formik";

const TagField = ({ name, label }) => {
  const [field, , helpers] = useField(name);
  const [input, setInput] = useState("");

  const tags = field.value || [];

  const addTag = (val) => {
    const tag = val.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      helpers.setValue([...tags, tag]);
    }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
  };

  const removeTag = (tag) => {
    helpers.setValue(tags.filter((t) => t !== tag));
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1 mb-1">
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 bg-blue-800 text-white text-xs px-2 py-1 rounded-full">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-300">×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input && addTag(input)}
        placeholder="Etiket yaz, Enter ile ekle"
        autoComplete="off"
        className="block w-full px-3 py-[8px] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
      />
    </div>
  );
};

export default TagField;
