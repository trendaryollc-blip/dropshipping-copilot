import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-lg">
        <ForgotPasswordForm />
        <p className="mt-6 text-center text-xs text-zinc-500">
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
