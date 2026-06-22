export default function TransactionsLoading() {
  return (
    <div className="p-5 animate-pulse space-y-4">
      <div className="h-4 w-24 bg-gray-100 rounded-full" />
      <div className="h-7 w-44 bg-gray-100 rounded-full" />
      <div className="h-28 bg-gray-200 rounded-[24px]" />
      <div className="h-5 w-36 bg-gray-100 rounded-full" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white rounded-[18px] p-3.5 flex gap-3 items-center shadow-card">
          <div className="w-11 h-11 rounded-2xl bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-32 bg-gray-100 rounded-full" />
            <div className="h-3 w-20 bg-gray-100 rounded-full" />
          </div>
          <div className="h-4 w-20 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}
