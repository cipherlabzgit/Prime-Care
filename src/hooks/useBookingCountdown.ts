import { useEffect, useMemo, useState } from "react";

const DEFAULT_SECONDS = 10 * 60;

function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function secondsUntil(expiresAt: string | null | undefined): number | null {
  if (!expiresAt) return null;
  const expiresMs = Date.parse(expiresAt);
  if (!Number.isFinite(expiresMs)) return null;
  return Math.max(0, Math.ceil((expiresMs - Date.now()) / 1000));
}

/**
 * Countdown for slot holds.
 * Prefer server `expiresAt`; fall back to a local duration when active without expiry.
 */
export function useBookingCountdown(
  active: boolean,
  expiresAt?: string | null,
  fallbackSeconds = DEFAULT_SECONDS,
) {
  const [remaining, setRemaining] = useState(() =>
    secondsUntil(expiresAt) ?? (active ? fallbackSeconds : fallbackSeconds),
  );
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!active) {
      setSynced(false);
      setRemaining(fallbackSeconds);
      return;
    }

    setSynced(false);

    const tick = () => {
      const fromExpiry = secondsUntil(expiresAt);
      if (fromExpiry != null) {
        setRemaining(fromExpiry);
        setSynced(true);
        return;
      }
      setRemaining((prev) => {
        const next = Math.max(0, prev - 1);
        return next;
      });
      setSynced(true);
    };

    // Seed immediately from expiresAt (or fallback) before any expire checks.
    if (expiresAt) {
      setRemaining(secondsUntil(expiresAt) ?? fallbackSeconds);
    } else {
      setRemaining(fallbackSeconds);
    }
    setSynced(true);

    const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [active, expiresAt, fallbackSeconds]);

  const expired = useMemo(() => {
    if (!active || !synced) return false;
    if (expiresAt) {
      const left = secondsUntil(expiresAt);
      return left != null && left <= 0;
    }
    return remaining <= 0;
  }, [active, synced, expiresAt, remaining]);

  return {
    remainingSeconds: remaining,
    label: formatCountdown(remaining),
    expired,
  };
}
