export function ProductGridSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col animate-pulse"
        >
          {/* Image placeholder */}
          <div className="aspect-square w-full bg-gray-200" />

          {/* Info placeholder */}
          <div className="p-3 flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-9 bg-gray-200 rounded mt-1" />
          </div>
        </div>
      ))}
    </>
  );
}
