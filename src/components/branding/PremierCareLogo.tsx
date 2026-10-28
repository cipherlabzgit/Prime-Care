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
}

function LogoFullImage({ context }: { context: LogoContext }) {
  return (
    <img
      className={`premiercare-logo__full premiercare-logo__full--${context}`}
      src={context === "header" ? "/logonew.png" : "/images/premiercare-logo-full.png"}
      alt="Premier Care Integrative Clinic"
      width={context === "header" ? 941 : 280}
      height={context === "header" ? 371 : 72}
      decoding="async"
    />
  );
}

function LogoMarkImage() {
  return (
    <img
      className="premiercare-logo__mark premiercare-logo__mark--img"
      src="/images/premiercare-logo-mark.png"
      alt="Premier Care"
      width={48}
      height={48}
      decoding="async"
    />
  );
}

function PremierCareLogo({
  variant = "horizontal",
  context = "header",
  className = "",
  showTagline = false,
  ...rest
}: PremierCareLogoProps) {
  if (variant === "mark") {
    return (
      <div
        className={`premiercare-logo premiercare-logo--mark premiercare-logo--${context} ${className}`.trim()}
        {...rest}
      >
        <LogoMarkImage />
      </div>
    );
  }

  return (
    <div
      className={`premiercare-logo premiercare-logo--${variant} premiercare-logo--${context} ${className}`.trim()}
      {...rest}
    >
      <LogoFullImage context={context} />
      {showTagline ? (
        <p className="premiercare-logo__tagline">Integrative healthcare for the whole you</p>
      ) : null}
    </div>
  );
}

export default PremierCareLogo;
