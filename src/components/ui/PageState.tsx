import { Link } from "react-router-dom";
import Button from "./Button";

export type PageStateIcon =
  | "default"
  | "search"
  | "calendar"
  | "reviews"
  | "profile"
  | "prescription"
  | "doctors"
  | "network";

const ICON_GLYPHS: Record<PageStateIcon, string> = {
  default: "📋",
  search: "🔍",
  calendar: "📅",
  reviews: "⭐",
  profile: "👤",
  prescription: "💊",
  doctors: "👨‍⚕️",
  network: "📡",
};

interface PageStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface PageStateProps {
  variant: "loading" | "error" | "empty";
  title: string;
  message?: string;
  icon?: PageStateIcon;
  onRetry?: () => void;
  retryLabel?: string;
  action?: PageStateAction;
  className?: string;
}

function PageState({
  variant,
  title,
  message,
  icon = variant === "error" ? "network" : "default",
  onRetry,
  retryLabel = "Try again",
  action,
  className = "",
}: PageStateProps) {
  const showIcon = variant !== "loading";

  return (
    <div
      className={`page-state mx-auto max-w-md rounded-[20px] border px-6 py-10 text-center shadow-[0_20px_45px_-30px_rgba(2,100,105,0.45)] ${
        variant === "error"
          ? "border-red-200 bg-red-50"
          : variant === "empty"
            ? "border-accent-200 bg-accent-50"
            : "border-slate-200 bg-white"
      } ${className}`}
      role={variant === "error" ? "alert" : "status"}
    >
      {variant === "loading" && (
        <div
          className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-500"
          aria-hidden="true"
        />
      )}
      {showIcon && (
        <div
          className="page-state__icon mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
          aria-hidden="true"
        >
          {ICON_GLYPHS[icon]}
        </div>
      )}
      <h2
        className={`text-lg font-semibold ${
          variant === "error" ? "text-red-700" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {message && (
        <p className="mt-2 text-sm text-slate-600">{message}</p>
      )}
      <div className="mt-5 flex flex-col items-center gap-3">
        {onRetry && (
          <Button onClick={onRetry}>{retryLabel}</Button>
        )}
        {action &&
          (action.href ? (
            action.href.startsWith("#") ? (
              <a
                href={action.href}
                className="inline-flex items-center justify-center rounded-full border border-brand-500 bg-white px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
              >
                {action.label}
              </a>
            ) : (
              <Link
                to={action.href}
                className="inline-flex items-center justify-center rounded-full border border-brand-500 bg-white px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
              >
                {action.label}
              </Link>
            )
          ) : (
            <Button variant="secondary" onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
      </div>
    </div>
  );
}

export default PageState;
