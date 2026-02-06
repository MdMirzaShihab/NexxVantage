export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-secondary">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
        <p className="text-sm text-brand-gray">Loading...</p>
      </div>
    </div>
  );
}
