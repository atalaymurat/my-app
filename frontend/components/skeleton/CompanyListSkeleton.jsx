import SkeletonBox from "./SkeletonBox";

const CompanyListSkeleton = () => {
  return (
    <div className="space-y-1 mt-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded p-4 space-y-3 bg-zinc-900">
          <SkeletonBox width="w-1/3" />
          <SkeletonBox width="w-1/2" />
          <SkeletonBox width="w-full" />
          <SkeletonBox width="w-2/3" />
        </div>
      ))}
    </div>
  );
};

export default CompanyListSkeleton;
