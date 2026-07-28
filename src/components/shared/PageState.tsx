interface PageStateProps {
  variant: "loading" | "error" | "empty";
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

function PageState({
  variant,
  title,
  message,
  onRetry,
  retryLabel = "Try again",
}: PageStateProps) {
  return (
    <div className={`page-state page-state--${variant}`} role={variant === "error" ? "alert" : "status"}>
      {variant === "loading" && (
        <div className="page-state__spinner" aria-hidden="true" />
      )}
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {onRetry && (
        <button type="button" className="ch-btn ch-btn--primary" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export default PageState;
