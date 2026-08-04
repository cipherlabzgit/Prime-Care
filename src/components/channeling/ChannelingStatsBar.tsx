const statsConfig = [
  {
    key: "booking",
    label: "Online Booking",
    icon: "📱",
    value: "24/7",
  },
  {
    key: "speed",
    label: "Book in Minutes",
    icon: "⚡",
    value: "Fast",
  },
] as const;

function ChannelingStatsBar() {
  return (
    <div className="relative z-10 -mt-3 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ul
        className="mx-auto grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 animate-fade-in-up"
        style={{ animationDelay: "180ms" }}
        aria-label="Platform highlights"
      >
        {statsConfig.map((stat) => (
          <li key={stat.key} className="channeling-stat-card">
            <span className="channeling-stat-card__icon" aria-hidden="true">
              {stat.icon}
            </span>
            <div className="min-w-0 flex-1 text-left">
              <p className="channeling-stat-card__value">{stat.value}</p>
              <p className="channeling-stat-card__label">{stat.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChannelingStatsBar;
