export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  )
}
