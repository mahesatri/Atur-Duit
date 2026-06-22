export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Topbar skeleton */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 bg-white">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-100 rounded-full" />
          <div className="h-5 w-36 bg-gray-100 rounded-full" />
        </div>
        <div className="h-9 w-36 bg-gray-100 rounded-xl" />
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-card h-36" />
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="h-5 w-40 bg-gray-100 rounded-full mb-4" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 items-center py-3.5 border-t border-gray-50">
              <div className="w-10 h-10 rounded-xl bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-32 bg-gray-100 rounded-full" />
                <div className="h-3 w-20 bg-gray-100 rounded-full" />
              </div>
              <div className="h-4 w-20 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
