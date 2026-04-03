const RadioList = ({ name, options, selected, onChange, renderLabel }) => (
  <div className="flex flex-col gap-1">
    {options.map((o) => (
      <label
        key={o.value}
        className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition ${
          selected === o.value
            ? "border-blue-500 bg-blue-900/30 text-white"
            : "border-stone-600 bg-stone-900 text-stone-300 hover:border-stone-400"
        }`}
      >
        <input
          type="radio"
          name={name}
          value={o.value}
          checked={selected === o.value}
          onChange={() => onChange(o.value)}
          className="accent-blue-500"
        />
        {renderLabel ? renderLabel(o) : o.label}
      </label>
    ))}
  </div>
);

export default RadioList;
