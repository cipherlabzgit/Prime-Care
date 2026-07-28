function ChannelingBookingPlaceholder() {
  const steps = [
    { num: 1, label: "Session", desc: "Pick a doctor session" },
    { num: 2, label: "Time", desc: "Choose an available slot" },
    { num: 3, label: "Details", desc: "Enter patient information" },
    { num: 4, label: "Confirm", desc: "Complete your booking" },
  ];

  return (
    <aside className="booking-panel booking-panel--placeholder channeling-glass channeling-sticky hidden lg:flex" aria-label="Booking panel placeholder">
      <header className="booking-panel__header">
        <div className="booking-panel__header-text">
          <span className="booking-panel__eyebrow">Step 3</span>
          <h2 className="booking-panel__title">Complete Booking</h2>
          <p className="booking-panel__subtitle">Select a session to begin</p>
        </div>
      </header>

      <div className="booking-panel__body booking-panel__body--placeholder">
        <ol className="booking-placeholder-steps" aria-label="Booking steps">
          {steps.map((step) => (
            <li key={step.num} className="booking-placeholder-steps__item">
              <span className="booking-placeholder-steps__num">{step.num}</span>
              <div>
                <p className="booking-placeholder-steps__label">{step.label}</p>
                <p className="booking-placeholder-steps__desc">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="booking-placeholder-empty">
          <span className="booking-placeholder-empty__icon" aria-hidden="true">
            📋
          </span>
          <p className="booking-placeholder-empty__title">No session selected</p>
          <p className="booking-placeholder-empty__text">
            Click &ldquo;Book Appointment&rdquo; on any session card to start
          </p>
        </div>
      </div>
    </aside>
  );
}

export default ChannelingBookingPlaceholder;
