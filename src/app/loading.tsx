export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "var(--nv-bg-page)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "var(--nv-gold)", borderTopColor: "transparent" }}
        />
        <p className="text-sm" style={{ color: "var(--nv-text-secondary)" }}>Loading...</p>
      </div>
    </div>
  );
}
