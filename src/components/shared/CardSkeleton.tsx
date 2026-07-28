interface CardSkeletonProps {
  lines?: number;
  className?: string;
}

function CardSkeleton({ lines = 4, className = "" }: CardSkeletonProps) {
  return (
    <div className={`skeleton-card ${className}`.trim()} aria-hidden="true">
      <div className="skeleton-card__avatar skeleton-shimmer" />
      <div className="skeleton-card__body">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="skeleton-line skeleton-shimmer"
            style={{ width: i === 0 ? "70%" : i === lines - 1 ? "45%" : "90%" }}
          />
        ))}
      </div>
    </div>
  );
}

export default CardSkeleton;
