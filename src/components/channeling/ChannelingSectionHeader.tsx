import type { ReactNode } from "react";

interface ChannelingSectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  step?: string;
}

function ChannelingSectionHeader({
  title,
  subtitle,
  badge,
  step,
}: ChannelingSectionHeaderProps) {
  return (
    <header className="channeling-section-header">
      <div className="channeling-section-header__row">
        <div className="channeling-section-header__text">
          {step ? (
            <span className="channeling-section-header__step" aria-hidden="true">
              {step}
            </span>
          ) : null}
          <h2 className="channeling-section-header__title">{title}</h2>
          {subtitle ? (
            <p className="channeling-section-header__subtitle">{subtitle}</p>
          ) : null}
        </div>
        {badge ? <div className="channeling-section-header__badge">{badge}</div> : null}
      </div>
    </header>
  );
}

export default ChannelingSectionHeader;
