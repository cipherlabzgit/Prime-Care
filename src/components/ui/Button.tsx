import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "accent";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white shadow-md shadow-brand-500/25 hover:bg-brand-600 focus-visible:ring-brand-500",
  secondary:
    "bg-slate-800 text-white hover:bg-slate-900 focus-visible:ring-slate-600",
  outline:
    "border-2 border-brand-500 text-brand-700 bg-white hover:bg-brand-50 focus-visible:ring-brand-500",
  ghost:
    "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400",
  accent:
    "bg-accent-500 text-slate-900 shadow-md shadow-amber-200/70 hover:bg-accent-600 focus-visible:ring-accent-500",
};

function Button({
  variant = "primary",
  children,
  fullWidth,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        fullWidth ? "w-full" : ""
      } ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
