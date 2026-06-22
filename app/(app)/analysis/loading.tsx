export default function AnalysisLoading() {
  return (
    <div className="p-5 animate-pulse space-y-4">
      <div className="h-4 w-20 bg-gray-100 rounded-full" />
      <div className="h-7 w-40 bg-gray-100 rounded-full" />
      <div className="h-12 bg-white rounded-pill shadow-card" />
      <div className="h-72 bg-white rounded-[20px] shadow-card" />
      <div className="flex gap-3">
        <div className="flex-1 h-20 bg-white rounded-[20px] shadow-card" />
        <div className="flex-1 h-20 bg-white rounded-[20px] shadow-card" />
      </div>
    </div>
  );
}
