export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded-md bg-neutral-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 w-full animate-pulse rounded-xl bg-neutral-200" />
        ))}
      </div>
      <div className="h-64 w-full animate-pulse rounded-xl bg-neutral-200" />
    </div>
  );
}
