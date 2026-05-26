import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="text-center space-y-6 px-6">
        <p className="text-6xl font-bold text-zinc-700">404</p>
        <h1 className="text-2xl font-semibold text-zinc-100">Page not found</h1>
        <p className="text-sm text-zinc-400 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-zinc-950 hover:bg-emerald-400 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}