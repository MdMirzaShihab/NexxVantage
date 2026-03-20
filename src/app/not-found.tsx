import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ background: "var(--nv-bg-page)" }}
    >
      <div className="text-center">
        <p className="text-8xl font-bold font-display" style={{ color: "var(--nv-gold)" }}>404</p>
        <h1
          className="mt-4 text-3xl font-bold font-display"
          style={{ color: "var(--nv-text-heading)" }}
        >
          Page Not Found
        </h1>
        <p className="mt-4 max-w-md mx-auto" style={{ color: "var(--nv-text-secondary)" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Button href="/">Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
