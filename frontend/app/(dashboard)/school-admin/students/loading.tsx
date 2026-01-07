export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
    </div>
  )
}
