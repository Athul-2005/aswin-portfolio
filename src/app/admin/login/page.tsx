"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "../actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-svh flex items-center justify-center p-4 sm:p-6 bg-[#000000]">
      <div className="w-full max-w-sm border border-[#26241f] bg-[#0b0b0b] p-6 sm:p-8 rounded-none">
        <div className="mb-8">
          <Link
            href="/"
            className="font-['Bebas_Neue',sans-serif] text-2xl tracking-wider text-[#8a8780] hover:text-[#c8a96a] transition-colors"
          >
            ← Public Site
          </Link>
          <h1 className="font-['Bebas_Neue',sans-serif] text-4xl text-[#f2efe9] mt-3 tracking-wide">
            ADMIN LOGIN
          </h1>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8a8780] mt-1">
            Photo Management
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div
              role="alert"
              className="p-3 bg-red-950/40 border border-red-800/60 text-red-200 text-xs tracking-wide"
            >
              {state.error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-[0.18em] text-[#8a8780] mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="aswin@example.com"
              className="w-full px-3 py-2.5 bg-black border border-[#26241f] text-[#f2efe9] text-sm focus:border-[#c8a96a] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-[0.18em] text-[#8a8780] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-black border border-[#26241f] text-[#f2efe9] text-sm focus:border-[#c8a96a] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 border border-[#f2efe9] bg-transparent text-[#f2efe9] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#f2efe9] hover:text-black transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
          >
            {isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
