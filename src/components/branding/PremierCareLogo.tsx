import type { HTMLAttributes } from "react";
import "../../styles/premiercare-logo.css";

/** Official PremierCare brand palette */
export const PREMIERCARE_BRAND = {
  teal: "#03989E",
  gold: "#FFC85E",
  gray: "#A6A6A6",
} as const;

type LogoVariant = "horizontal" | "stacked" | "mark";
type LogoContext = "header" | "footer";

interface PremierCareLogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: LogoVariant;
  context?: LogoContext;
  showTagline?: boolean;
  /** Use official raster assets when true (pixel-perfect); SVG is default */
  useImage?: boolean;
}

/**
 * Official PremierCare cross mark — four corner brackets (teal left, gold right)
 * with rounded stroke caps matching brand guidelines.
 */
function LogoMarkSvg({ className = "" }: { className?: string }) {
  const { teal, gold } = PREMIERCARE_BRAND;

  return (
    <svg
      className={`premiercare-logo__mark ${className}`.trim()}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Official corner brackets — teal left, gold right */}
      <path
        fill={teal}
        d="M9 9h18v6H15v12H9V9z"
      />
      <path
        fill={teal}
        d="M9 37h6v12h12v6H9V37z"
      />
      <path
        fill={gold}
        d="M37 9h18v18h-6V15H37V9z"
      />
      <path
        fill={gold}
        d="M49 37h6v18H37v-6h12V37z"
      />
    </svg>
  );
}

function LogoMarkImage({ className = "" }: { className?: string }) {
  return (
    <img
      className={`premiercare-logo__mark premiercare-logo__mark--img ${className}`.trim()}
      src="/images/premiercare-logo-mark.png"
      alt=""
      width={64}
      height={64}
      decoding="async"
    />
  );
}

function LogoWordmark({
  context,
  showTagline,
}: {
  context: LogoContext;
  showTagline: boolean;
}) {
  const isFooter = context === "footer";

  return (
    <span className="premiercare-logo__wordmark">
      <span className="premiercare-logo__name" aria-label="PremierCare">
        <span
          className={`premiercare-logo__premier${
            isFooter ? " premiercare-logo__premier--footer" : ""
          }`}
        >
          PREMIER
        </span>
        <span className="premiercare-logo__care">CARE</span>
      </span>
      {showTagline ? (
        <span
          className={`premiercare-logo__tagline${
            isFooter ? " premiercare-logo__tagline--footer" : ""
          }`}
        >
          INTEGRATIVE CLINIC
        </span>
      ) : null}
    </span>
  );
}

function PremierCareLogo({
  variant = "horizontal",
  context = "header",
  showTagline = false,
  useImage = false,
  className = "",
  ...rest
}: PremierCareLogoProps) {
  const showTaglineResolved =
    showTagline || variant === "stacked" || context === "footer";

  if (variant === "mark") {
    return (
      <div
        className={`premiercare-logo premiercare-logo--mark premiercare-logo--${context} ${className}`.trim()}
        {...rest}
      >
        {useImage ? <LogoMarkImage /> : <LogoMarkSvg />}
      </div>
    );
  }

  return (
    <div
      className={`premiercare-logo premiercare-logo--${variant} premiercare-logo--${context} ${className}`.trim()}
      {...rest}
    >
      {useImage ? <LogoMarkImage /> : <LogoMarkSvg />}
      <LogoWordmark context={context} showTagline={showTaglineResolved} />
    </div>
  );
}

export default PremierCareLogo;
