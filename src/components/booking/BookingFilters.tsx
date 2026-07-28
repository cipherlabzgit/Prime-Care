import type { BookingFilters as Filters } from "../../types/booking";
import type { Doctor, MedicalCenter, Specialization } from "../../types/booking";

interface BookingFiltersProps {
  filters: Filters;
  centers: MedicalCenter[];
  specializations: Specialization[];
  doctors: Doctor[];
  onChange: (patch: Partial<Filters>) => void;
  onSearch: () => void;
}

function BookingFilters({
  filters,
  centers,
  specializations,
  doctors,
  onChange,
  onSearch,
}: BookingFiltersProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <aside className="booking-panel booking-panel--filters">
      <div className="booking-panel__header">
        <span className="booking-panel__icon" aria-hidden="true">
          <FilterIcon />
        </span>
        <h2 className="booking-panel__title">Search Filters</h2>
      </div>

      <form className="booking-filters" onSubmit={handleSubmit}>
        <div className="booking-field">
          <label htmlFor="center">Medical Center</label>
          <select
            id="center"
            value={filters.centerId}
            onChange={(e) => onChange({ centerId: e.target.value })}
          >
            <option value="">All centers</option>
            {centers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.city}
              </option>
            ))}
          </select>
        </div>

        <div className="booking-field">
          <label htmlFor="specialization">Specialization</label>
          <select
            id="specialization"
            value={filters.specializationId}
            onChange={(e) =>
              onChange({ specializationId: e.target.value, doctorId: "" })
            }
          >
            <option value="">All specializations</option>
            {specializations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="booking-field">
          <label htmlFor="date">Appointment Date</label>
          <input
            id="date"
            type="date"
            value={filters.date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => onChange({ date: e.target.value })}
          />
        </div>

        <div className="booking-field">
          <label htmlFor="doctor">Doctor</label>
          <select
            id="doctor"
            value={filters.doctorId}
            onChange={(e) => onChange({ doctorId: e.target.value })}
          >
            <option value="">Any doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="booking-btn booking-btn--primary booking-btn--block">
          Search Sessions
        </button>
      </form>
    </aside>
  );
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
  );
}

export default BookingFilters;
