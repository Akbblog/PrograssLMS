export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-72 bg-gray-200 animate-pulse rounded"></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="h-28 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-28 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-28 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-28 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
    </div>
  )
}
