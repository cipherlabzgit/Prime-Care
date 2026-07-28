import { useEffect, useState } from "react";
import { useCountUp } from "../../hooks/useCountUp";

interface ChannelingStatsBarProps {
  doctorCount: number;
  centerCount: number;
  sessionCount: number;
}

const statsConfig = [
  {
    key: "doctors",
    label: "Specialist Doctors",
    icon: "👨‍⚕️",
    getValue: (p: ChannelingStatsBarProps) =>
      p.doctorCount > 0 ? `${p.doctorCount}+` : "50+",
    animate: true,
  },
  {
    key: "centers",
    label: "Medical Centers",
    icon: "🏥",
    getValue: (p: ChannelingStatsBarProps) =>
      p.centerCount > 0 ? `${p.centerCount}+` : "10+",
    animate: true,
  },
  {
    key: "patients",
    label: "Happy Patients",
    icon: "😊",
    getValue: () => "5000+",
    animate: true,
  },
  {
    key: "bookings",
    label: "Online Bookings",
    icon: "📱",
    getValue: (p: ChannelingStatsBarProps) =>
      p.sessionCount > 0 ? `${p.sessionCount}+` : "24/7",
    animate: false,
  },
] as const;

function AnimatedStatValue({
  value,
  animate,
  delay,
}: {
  value: string;
  animate: boolean;
  delay: number;
}) {
  const [active, setActive] = useState(false);
  const display = useCountUp(value, active && animate, 1400);

  useEffect(() => {
    const timer = window.setTimeout(() => setActive(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return (
    <p className="channeling-stat-card__value">{animate ? display : value}</p>
  );
}

function ChannelingStatsBar(props: ChannelingStatsBarProps) {
  return (
    <div className="relative z-10 -mt-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ul
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 animate-fade-in-up"
        style={{ animationDelay: "180ms" }}
        aria-label="Platform statistics"
      >
        {statsConfig.map((stat, index) => (
          <li key={stat.key} className="channeling-stat-card">
            <span className="channeling-stat-card__icon" aria-hidden="true">
              {stat.icon}
            </span>
            <div className="min-w-0 flex-1 text-left">
              <AnimatedStatValue
                value={stat.getValue(props)}
                animate={stat.animate}
                delay={index * 120}
              />
              <p className="channeling-stat-card__label">{stat.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChannelingStatsBar;
