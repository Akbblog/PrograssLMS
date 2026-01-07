export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-56 bg-gray-200 animate-pulse rounded"></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="h-80 bg-gray-200 animate-pulse rounded"></div>
    </div>
  )
}
