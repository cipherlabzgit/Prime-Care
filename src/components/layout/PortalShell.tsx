import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import Navbar from "../Navbar";

interface PortalShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
}

function PortalShell({ children, title, subtitle, badge }: PortalShellProps) {
  return (
    <div className="portal-shell flex min-h-svh flex-col bg-gradient-to-b from-brand-50/80 via-white to-slate-50 text-left">
      <Navbar />
      <header className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-4 py-7 text-white shadow-[0_16px_40px_-28px_rgba(2,100,105,0.75)] sm:px-6 sm:py-8 lg:px-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="min-w-0">
            {badge && (
              <span className="mb-2 inline-block rounded-full border border-accent-300/60 bg-accent-500/20 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent-50">
                {badge}
              </span>
            )}
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2rem]">
              {title}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/90">
              {subtitle}
            </p>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}

export default PortalShell;
