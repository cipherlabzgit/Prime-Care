import type { ReactNode } from "react";
import SiteFooter from "../layout/SiteFooter";
import Navbar from "../Navbar";
import ChannelingHero from "./ChannelingHero";
import ChannelingStatsBar from "./ChannelingStatsBar";

interface ChannelingPageLayoutProps {
  children: ReactNode;
}

function ChannelingPageLayout({ children }: ChannelingPageLayoutProps) {
  return (
    <div className="channeling-page flex min-h-svh flex-col bg-gradient-to-b from-brand-50/60 via-slate-50/80 to-white text-left">
      <Navbar />
      <ChannelingHero />
      <ChannelingStatsBar />

      <div className="channeling-page__body relative flex-1">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -left-32 top-20 h-64 w-64 rounded-full bg-brand-200/30 blur-3xl" />
          <div className="absolute -right-24 bottom-32 h-72 w-72 rounded-full bg-accent-200/25 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

export default ChannelingPageLayout;
