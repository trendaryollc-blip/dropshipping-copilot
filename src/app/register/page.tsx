import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xs font-medium uppercase tracking-widest text-emerald-400">
            Dropship Autopilot
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-50">Create account</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Your API keys and automation runs are stored per account.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <AuthForm mode="register" />
        </div>
      </div>
    </div>
  );
}
