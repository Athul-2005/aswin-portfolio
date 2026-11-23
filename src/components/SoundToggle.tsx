"use client";

import { useState } from "react";
import { isSoundEnabled, setSoundEnabled, playShutterSound } from "@/lib/shutter";

export default function SoundToggle() {
  const [enabled, setEnabledState] = useState(() => isSoundEnabled());

  const handleToggle = () => {
    const nextState = !enabled;
    setEnabledState(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      // preview click
      playShutterSound();
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] hover:text-[var(--fg)] transition-colors focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
      aria-pressed={enabled}
      aria-label={`Camera sounds: ${enabled ? "on" : "off"}`}
    >
      Camera sounds:{" "}
      <span className={enabled ? "text-[var(--accent)] font-medium" : "text-[var(--muted)]"}>
        {enabled ? "on" : "off"}
      </span>
    </button>
  );
}
