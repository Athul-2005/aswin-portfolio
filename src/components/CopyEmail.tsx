"use client";

import { useState } from "react";
import { site } from "@/data/content";

export default function CopyEmail({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = site.email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <a
        href={`mailto:${site.email}`}
        className="text-sm sm:text-base text-[var(--fg)] hover:text-[var(--accent)] transition-colors lowercase tracking-normal"
      >
        {site.email}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="text-[10px] sm:text-xs uppercase tracking-[0.18em] px-3 py-1 border border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--fg)] transition-all cursor-pointer focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
        aria-label="Copy email address"
      >
        {copied ? "Copied" : "Copy email"}
      </button>
    </div>
  );
}
