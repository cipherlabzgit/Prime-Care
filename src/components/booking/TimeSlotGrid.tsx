import type { TimeSlot } from "../../types/booking";

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: TimeSlot) => void;
  sessionSelected: boolean;
}

function TimeSlotGrid({
  slots,
  selectedSlotId,
  onSelectSlot,
  sessionSelected,
}: TimeSlotGridProps) {
  const availableCount = slots.filter((s) => s.available).length;

  return (
    <section className="booking-slots" aria-labelledby="slots-heading">
      <div className="booking-panel__header booking-panel__header--inline">
        <span className="booking-panel__icon" aria-hidden="true">
          <ClockIcon />
        </span>
        <div>
          <h2 id="slots-heading" className="booking-panel__title">
            Available Time Slots
          </h2>
          <p className="booking-panel__subtitle">
            {sessionSelected
              ? `${availableCount} of ${slots.length} slots available`
              : "Select a doctor session to view time slots"}
          </p>
        </div>
      </div>

      {!sessionSelected && (
        <div className="booking-empty">
          <p>Choose a session card above to see appointment times.</p>
        </div>
      )}

      {sessionSelected && (
        <div className="slot-grid" role="listbox" aria-label="Time slots">
          {slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              role="option"
              aria-selected={selectedSlotId === slot.id}
              disabled={!slot.available}
              className={`slot-btn${
                selectedSlotId === slot.id ? " slot-btn--selected" : ""
              }${!slot.available ? " slot-btn--unavailable" : ""}`}
              onClick={() => onSelectSlot(slot)}
            >
              {slot.time}
              {!slot.available && (
                <span className="slot-btn__tag">Booked</span>
              )}
            </button>
          ))}
        </div>
      )}

      {sessionSelected && (
        <div className="slot-legend">
          <span className="slot-legend__item">
            <span className="slot-legend__swatch slot-legend__swatch--free" />
            Available
          </span>
          <span className="slot-legend__item">
            <span className="slot-legend__swatch slot-legend__swatch--busy" />
            Booked
          </span>
          <span className="slot-legend__item">
            <span className="slot-legend__swatch slot-legend__swatch--active" />
            Selected
          </span>
        </div>
      )}
    </section>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default TimeSlotGrid;
