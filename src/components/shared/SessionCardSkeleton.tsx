function SessionCardSkeleton() {
  return (
    <div className="ch-session-card ch-session-card--skeleton" aria-hidden="true">
      <div className="ch-session-card__top">
        <div className="skeleton-avatar skeleton-shimmer" />
        <div className="skeleton-card__body" style={{ flex: 1 }}>
          <div className="skeleton-line skeleton-shimmer" style={{ width: "65%" }} />
          <div className="skeleton-line skeleton-shimmer" style={{ width: "40%" }} />
        </div>
        <div className="skeleton-line skeleton-shimmer" style={{ width: "4rem" }} />
      </div>
      <div className="skeleton-grid">
        <div className="skeleton-line skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer" />
      </div>
      <div className="skeleton-line skeleton-shimmer" style={{ width: "35%", marginTop: "0.75rem" }} />
      <div className="skeleton-btn skeleton-shimmer" />
    </div>
  );
}

export function SessionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="ch-session-list">
      {Array.from({ length: count }, (_, i) => (
        <SessionCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default SessionCardSkeleton;
