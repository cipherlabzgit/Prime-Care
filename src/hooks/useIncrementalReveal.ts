import { useCallback, useEffect, useState } from "react";

export const SESSION_REVEAL_BATCH = 4;

export function useIncrementalReveal(
  totalCount: number,
  resetKey: string,
  batchSize = SESSION_REVEAL_BATCH,
) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [revealFromIndex, setRevealFromIndex] = useState(0);

  useEffect(() => {
    setVisibleCount(batchSize);
    setRevealFromIndex(0);
  }, [resetKey, batchSize]);

  const displayedCount = Math.min(visibleCount, totalCount);
  const hasMore = displayedCount < totalCount;

  const loadMore = useCallback(() => {
    setVisibleCount((current) => {
      setRevealFromIndex(current);
      return Math.min(current + batchSize, totalCount);
    });
  }, [batchSize, totalCount]);

  return {
    displayedCount,
    hasMore,
    loadMore,
    revealFromIndex,
  };
}
