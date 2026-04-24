export default function RidesLoading() {
  return (
    <div className="space-y-3" data-testid="rides-skeleton">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 w-full animate-pulse rounded-md bg-neutral-200" />
      ))}
    </div>
  );
}
