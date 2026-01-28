function SkeletonCard() {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[2/3] bg-gray-800"></div>

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="h-6 bg-gray-800 rounded mb-3"></div>
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-16 bg-gray-800 rounded"></div>
          <div className="h-6 w-16 bg-gray-800 rounded"></div>
        </div>
        <div className="h-4 bg-gray-800 rounded"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
