import SkeletonBox from "./SkeletonBox";

const CompanyListSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded p-4 space-y-2">
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
