const SkeletonBox = ({ width = "w-full", height = "h-4", className = "" }) => (
  <div className={`bg-stone-200 animate-pulse rounded ${width} ${height} ${className}`} />
);

export default SkeletonBox
