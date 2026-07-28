import { useEffect, useState } from "react";
import type { ChannelingFilters as Filters } from "../../utils/channelingUtils";
import Button from "../ui/Button";
import ChannelingSectionHeader from "./ChannelingSectionHeader";

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
}

const selectClass =
  "channeling-filter-input w-full rounded-2xl border border-slate-300/90 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 shadow-sm transition duration-250 hover:border-brand-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60";

const labelClass =
  "channeling-filter-label mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-700";

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
}: ChannelingFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const doctorFieldHighlighted =
    Boolean(highlightedDoctorId) && filters.doctorId === highlightedDoctorId;

  useEffect(() => {
    if (highlightedDoctorId && window.innerWidth < 1024) {
      setMobileOpen(true);
    }
  }, [highlightedDoctorId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
    if (window.innerWidth < 1024) setMobileOpen(false);
  };

  const activeFilterCount = [
    filters.centerName,
    filters.specialization,
    filters.doctorId,
    filters.date,
  ].filter(Boolean).length;

  const filterForm = (
    <form className="channeling-filter-form px-5 py-5" onSubmit={handleSubmit}>
      <div className="channeling-filter-field">
        <label htmlFor="ch-center" className={labelClass}>
          Medical Center
        </label>
        <select
          id="ch-center"
          className={selectClass}
          value={filters.centerName}
          disabled={disabled}
          onChange={(e) => onChange({ centerName: e.target.value })}
        >
          <option value="">All centers</option>
          {centers.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="channeling-filter-field">
        <label htmlFor="ch-spec" className={labelClass}>
          Specialization
        </label>
        <select
          id="ch-spec"
          className={selectClass}
          value={filters.specialization}
          disabled={disabled}
          onChange={(e) => onChange({ specialization: e.target.value })}
        >
          <option value="">All specializations</option>
          {specializations.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

        <div
          className={`channeling-filter-field${
            doctorFieldHighlighted ? " channeling-filter-field--highlighted" : ""
          }`}
        >
          <label htmlFor="ch-doctor" className={labelClass}>
            Doctor
            {doctorFieldHighlighted ? (
              <span className="channeling-filter-highlight-badge">Selected</span>
            ) : null}
          </label>
          <select
            id="ch-doctor"
            className={`${selectClass}${
              doctorFieldHighlighted ? " channeling-filter-input--highlighted" : ""
            }`}
          value={filters.doctorId}
          disabled={disabled}
          onChange={(e) => onChange({ doctorId: e.target.value })}
        >
          <option value="">Any doctor</option>
          {doctors.map((d) => (
            <option key={d.doctorId} value={String(d.doctorId)}>
              {d.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="channeling-filter-field">
        <label htmlFor="ch-date" className={labelClass}>
          Date
        </label>
        <input
          id="ch-date"
          type="date"
          className={selectClass}
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

      <div className="channeling-filter-submit">
        <Button
          type="submit"
          variant="accent"
          fullWidth
          disabled={disabled}
          className="py-3.5 text-sm font-bold shadow-lg shadow-amber-200/50 transition-all duration-250 hover:shadow-xl hover:shadow-amber-200/60"
        >
          Search Sessions
        </Button>
      </div>
    </form>
  );

  return (
    <aside
      className="channeling-glass channeling-sticky h-fit overflow-hidden rounded-3xl"
      aria-label="Search filters"
    >
      <div className="channeling-filters-header">
        <ChannelingSectionHeader
          step="Step 1"
          title="Search Filters"
          subtitle="Find the right session quickly"
          badge={
            activeFilterCount > 0 ? (
              <span className="channeling-active-badge">
                {activeFilterCount} active
              </span>
            ) : undefined
          }
        />
        <button
          type="button"
          className="channeling-filters-toggle lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="channeling-filter-panel"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span>{mobileOpen ? "Hide filters" : "Show filters"}</span>
          <span
            className={`channeling-filters-toggle__icon${mobileOpen ? " channeling-filters-toggle__icon--open" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div
        id="channeling-filter-panel"
        className={`channeling-filters-panel${mobileOpen ? " channeling-filters-panel--open" : ""}`}
      >
        {filterForm}
      </div>
    </aside>
  );
}

export default ChannelingFilters;
