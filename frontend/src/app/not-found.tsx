import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-6xl font-black text-primary tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The destination or resource you are looking for doesn't exist or has moved.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow hover:opacity-90 transition-opacity"
          >
            Return to RoamIQ Home
          </Link>
        </div>
      </div>
    </div>
  );
}
