import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  fetchDiscoverSessions,
  type ChannelingSession,
} from "../services/channelingService";
import { USER_MESSAGES } from "../utils/userMessages";

export function getApiErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(err)) {
    return (
      (err.response?.data as { message?: string })?.message ??
      err.message ??
      fallback
    );
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}

export function useDiscoverSessions() {
  const [sessions, setSessions] = useState<ChannelingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchDiscoverSessions();
      setSessions(data);
    } catch (err) {
      console.warn("[useDiscoverSessions] Failed to load sessions.", err);
      setError(USER_MESSAGES.loadFailed);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { sessions, loading, error, reload };
}
