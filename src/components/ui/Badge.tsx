import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "brand" | "muted" | "success" | "danger";
  className?: string;
}

const variants = {
  brand: "bg-brand-100 text-brand-700",
  muted: "bg-slate-100 text-slate-600",
  success: "bg-accent-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
};

function Badge({ children, variant = "brand", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
