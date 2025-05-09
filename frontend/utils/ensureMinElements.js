
export default function ensureMinElements(
  arr,
  minLength = 10,
  emptyValue = () => ({ _id: "" })
) {
  if (arr.length >= minLength) return [...arr]; // Return a copy to avoid mutation
  return [
    ...arr,
    ...Array(minLength - arr.length)
      .fill()
      .map(() => (typeof emptyValue === 'function' ? emptyValue() : { ...emptyValue })),
  ];
}
