import type { FormEvent, ReactNode } from "react";
import type { ChannelingFilters as Filters } from "../../utils/channelingUtils";
import Button from "../ui/Button";

export type ChannelingFiltersVariant = "card" | "bar";

interface ChannelingFiltersProps {
  filters: Filters;
  centers: string[];
  specializations: string[];
  doctors: { doctorId: number; fullName: string }[];
  availableDates: string[];
  onChange: (patch: Partial<Filters>) => void;
  onSearch: () => void;
  disabled?: boolean;
  highlightedDoctorId?: string | null;
  variant?: ChannelingFiltersVariant;
}

function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span className="channeling-search-field__icon" aria-hidden="true">
      {children}
    </span>
  );
}

function ChannelingFilters({
  filters,
  centers,
  specializations,
  doctors,
  availableDates,
  onChange,
  onSearch,
  disabled = false,
  highlightedDoctorId = null,
  variant = "card",
}: ChannelingFiltersProps) {
  const doctorFieldHighlighted =
    Boolean(highlightedDoctorId) && filters.doctorId === highlightedDoctorId;
  const isBar = variant === "bar";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const fields = (
    <>
      <div
        className={`channeling-search-field${
          doctorFieldHighlighted ? " channeling-search-field--highlighted" : ""
        }`}
      >
        <FieldIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0"
            />
          </svg>
        </FieldIcon>
        <label htmlFor="ch-doctor" className="sr-only">
          Doctor
        </label>
        <select
          id="ch-doctor"
          className="channeling-search-field__control"
          value={filters.doctorId}
          disabled={disabled}
          onChange={(e) => onChange({ doctorId: e.target.value })}
        >
          <option value="">Any Doctor</option>
          {doctors.map((d) => (
            <option key={d.doctorId} value={String(d.doctorId)}>
              {d.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="channeling-search-field">
        <FieldIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </FieldIcon>
        <label htmlFor="ch-spec" className="sr-only">
          Specialization
        </label>
        <select
          id="ch-spec"
          className="channeling-search-field__control"
          value={filters.specialization}
          disabled={disabled}
          onChange={(e) => onChange({ specialization: e.target.value })}
        >
          <option value="">Any Specialization</option>
          {specializations.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="channeling-search-field">
        <FieldIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 21h16.5M4.5 21V8.25L12 3l7.5 5.25V21M9 21v-6h6v6"
            />
          </svg>
        </FieldIcon>
        <label htmlFor="ch-center" className="sr-only">
          Medical Center
        </label>
        <select
          id="ch-center"
          className="channeling-search-field__control"
          value={filters.centerName}
          disabled={disabled}
          onChange={(e) => onChange({ centerName: e.target.value })}
        >
          <option value="">Any Hospital</option>
          {centers.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="channeling-search-field">
        <FieldIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 6h13.5A1.5 1.5 0 0120.25 7.5v11.25A1.5 1.5 0 0118.75 20.25H5.25A1.5 1.5 0 013.75 18.75V7.5A1.5 1.5 0 015.25 6z"
            />
          </svg>
        </FieldIcon>
        <label htmlFor="ch-date" className="sr-only">
          Date
        </label>
        <input
          id="ch-date"
          type="date"
          className="channeling-search-field__control"
          value={filters.date}
          disabled={disabled}
          list="ch-date-options"
          onChange={(e) => onChange({ date: e.target.value })}
        />
        <datalist id="ch-date-options">
          {availableDates.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </div>
    </>
  );

  if (isBar) {
    return (
      <section className="channeling-search-bar" aria-label="Search filters">
        <form className="channeling-search-bar__form" onSubmit={handleSubmit}>
          {fields}
          <Button
            type="submit"
            variant="accent"
            disabled={disabled}
            className="channeling-search-bar__submit"
          >
            <svg
              className="channeling-search-card__submit-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
            Search
          </Button>
        </form>
      </section>
    );
  }

  return (
    <section
      className="channeling-search-card"
      aria-labelledby="channeling-search-title"
    >
      <h2 id="channeling-search-title" className="channeling-search-card__title">
        Channel Your Doctor
      </h2>

      <form className="channeling-search-card__form" onSubmit={handleSubmit}>
        {fields}
        <Button
          type="submit"
          variant="accent"
          fullWidth
          disabled={disabled}
          className="channeling-search-card__submit"
        >
          <svg
            className="channeling-search-card__submit-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
          Search
        </Button>
      </form>
    </section>
  );
}

export default ChannelingFilters;
