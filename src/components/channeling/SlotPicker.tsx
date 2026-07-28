import type { SessionTimeSlot } from "../../types/channeling";

interface SlotPickerProps {
  slots: SessionTimeSlot[];
  selectedSlotId: number | null;
  onSelect: (slot: SessionTimeSlot) => void;
  loading?: boolean;
  compact?: boolean;
}

function SlotSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`slot-picker__grid${compact ? " slot-picker__grid--compact" : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="slot-picker__skeleton" />
      ))}
    </div>
  );
}

function SlotPicker({
  slots,
  selectedSlotId,
  onSelect,
  loading = false,
  compact = false,
}: SlotPickerProps) {
  if (loading) {
    return (
      <div className="slot-picker">
        <SlotSkeleton compact={compact} />
        <p className="slot-picker__loading">Loading available times…</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="slot-picker__empty">
        <p>No time slots available</p>
        <span>Try another session or check back later.</span>
      </div>
    );
  }

  const availableCount = slots.filter((slot) => slot.available).length;

  return (
    <div className="slot-picker">
      <p className="slot-picker__count" role="status">
        {availableCount} slot{availableCount === 1 ? "" : "s"} available
      </p>

      <div
        className={`slot-picker__grid${compact ? " slot-picker__grid--compact" : ""}`}
        role="listbox"
        aria-label="Available time slots"
      >
        {slots.map((slot) => {
          const selected = selectedSlotId === slot.id;
          let btnClass = "slot-picker__btn";
          if (!slot.available) btnClass += " slot-picker__btn--booked";
          else if (selected) btnClass += " slot-picker__btn--selected";

          return (
            <button
              key={slot.id}
              type="button"
              role="option"
              aria-selected={selected}
              disabled={!slot.available}
              onClick={() => onSelect(slot)}
              className={btnClass}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SlotPicker;
