import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-secondary px-6">
      <div className="text-center">
        <p className="text-8xl font-bold text-brand-primary">404</p>
        <h1 className="mt-4 text-3xl font-bold">Page Not Found</h1>
        <p className="mt-4 text-brand-gray max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Button href="/">Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
