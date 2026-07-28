import type { DoctorFiltersState } from "../../types/doctorFilters";
import {
  AVAILABILITY_FILTER_OPTIONS,
  countActiveDoctorFilters,
  toggleFilterValue,
  type DoctorFilterOptions,
} from "../../utils/doctorFilters";
interface DoctorFiltersPanelProps {
  filters: DoctorFiltersState;
  options: DoctorFilterOptions;
  onChange: (patch: Partial<DoctorFiltersState>) => void;
  onClearAll: () => void;
  id?: string;
  className?: string;
}

function FilterCheckboxGroup({
  title,
  options,
  selected,
  onToggle,
  emptyMessage,
}: {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  emptyMessage?: string;
}) {
  return (
    <fieldset className="doctors-filters__group">
      <legend className="doctors-filters__legend">{title}</legend>
      {options.length === 0 ? (
        <p className="doctors-filters__empty">{emptyMessage ?? "None available"}</p>
      ) : (
        <ul className="doctors-filters__list">
          {options.map((option) => {
            const checked = selected.includes(option.value);
            return (
              <li key={option.value}>
                <label
                  className={`doctors-filters__option${
                    checked ? " doctors-filters__option--checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="doctors-filters__checkbox"
                    checked={checked}
                    onChange={() => onToggle(option.value)}
                  />
                  <span className="doctors-filters__option-label">
                    {option.label}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </fieldset>
  );
}

function DoctorFiltersPanel({
  filters,
  options,
  onChange,
  onClearAll,
  id,
  className = "",
}: DoctorFiltersPanelProps) {
  const activeCount = countActiveDoctorFilters(filters);

  const centerOptions = options.centers.map((center) => ({
    value: center,
    label: center,
  }));

  const specializationOptions = options.specializations.map((spec) => ({
    value: spec,
    label: spec,
  }));

  return (
    <aside
      id={id}
      className={`doctors-filters ${className}`.trim()}
      aria-label="Doctor filters"
    >
      <div className="doctors-filters__header">
        <h2 className="doctors-filters__title">
          Filters
          {activeCount > 0 ? (
            <span className="doctors-filters__count">({activeCount})</span>
          ) : null}
        </h2>
        {activeCount > 0 ? (
          <button
            type="button"
            className="doctors-filters__clear"
            onClick={onClearAll}
          >
            Clear All
          </button>
        ) : null}
      </div>

      <FilterCheckboxGroup
        title="Medical Centers"
        options={centerOptions}
        selected={filters.centers}
        onToggle={(value) =>
          onChange({
            centers: toggleFilterValue(filters.centers, value),
          })
        }
        emptyMessage="No centers in current data"
      />

      <FilterCheckboxGroup
        title="Specialization"
        options={specializationOptions}
        selected={filters.specializations}
        onToggle={(value) =>
          onChange({
            specializations: toggleFilterValue(filters.specializations, value),
          })
        }
        emptyMessage="No specializations in current data"
      />

      <FilterCheckboxGroup
        title="Availability"
        options={AVAILABILITY_FILTER_OPTIONS}
        selected={filters.availability}
        onToggle={(value) =>
          onChange({
            availability: toggleFilterValue(
              filters.availability,
              value as (typeof filters.availability)[number],
            ),
          })
        }
      />
    </aside>
  );
}

export default DoctorFiltersPanel;
