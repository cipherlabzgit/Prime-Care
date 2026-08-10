import type { ReactNode } from "react";
import SiteFooter from "../layout/SiteFooter";
import Navbar from "../Navbar";
import ChannelingHero from "./ChannelingHero";
import ChannelingServiceLinks from "./ChannelingServiceLinks";

export type ChannelingPageMode = "landing" | "results";

interface ChannelingPageLayoutProps {
  mode?: ChannelingPageMode;
  searchCard?: ReactNode;
  searchBar?: ReactNode;
  children: ReactNode;
}

function ChannelingPageLayout({
  mode = "landing",
  searchCard,
  searchBar,
  children,
}: ChannelingPageLayoutProps) {
  const isResults = mode === "results";

  return (
    <div
      className={`channeling-page flex min-h-svh flex-col text-left${
        isResults ? " channeling-page--results" : " channeling-page--landing"
      }`}
    >
      <Navbar />

      {!isResults ? (
        <div className="channeling-page__top relative">
          <ChannelingHero />
          {searchCard ? (
            <div className="channeling-page__search relative z-20 mx-auto -mt-16 w-full max-w-xl px-4 sm:-mt-20 sm:px-6 lg:px-8">
              {searchCard}
            </div>
          ) : null}
        </div>
      ) : null}

      {isResults && searchBar ? (
        <div className="channeling-page__bar sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
            {searchBar}
          </div>
        </div>
      ) : null}

      <div className="channeling-page__body relative flex-1">
        <div
          className="channeling-page__pattern pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div
          className={`relative mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 ${
            isResults ? "pt-5 sm:pt-6" : "pt-8 sm:pt-10"
          }`}
        >
          {children}
          {!isResults ? <ChannelingServiceLinks /> : null}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

export default ChannelingPageLayout;
