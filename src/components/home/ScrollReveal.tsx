import type { ReactNode } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`home-reveal ${isVisible ? "home-reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
