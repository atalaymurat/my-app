const DebugJson = ({ data }) => {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <pre className="text-xs text-stone-400 px-2 overflow-auto bg-stone-900 rounded p-2 my-2">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default DebugJson;
