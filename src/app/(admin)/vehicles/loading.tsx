export default function VehiclesLoading() {
  return (
    <div className="space-y-3" data-testid="vehicles-skeleton">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 w-full animate-pulse rounded-md bg-neutral-200" />
      ))}
    </div>
  );
}
