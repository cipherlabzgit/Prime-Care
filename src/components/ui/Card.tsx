import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingMap = {
  sm: "p-4",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-6",
};

function Card({
  children,
  hover = false,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-[20px] border border-slate-200/80 bg-white shadow-[0_18px_45px_-26px_rgba(2,100,105,0.35)] ${
        hover
          ? "transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_50px_-24px_rgba(2,100,105,0.45)]"
          : ""
      } ${paddingMap[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
