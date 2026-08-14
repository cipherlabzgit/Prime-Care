import { useEffect, useMemo, useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { USER_MESSAGES } from "../utils/userMessages";
import DoctorFiltersPanel from "../components/doctors/DoctorFiltersPanel";
import DoctorProfileCard from "../components/doctors/DoctorProfileCard";
import PortalShell from "../components/layout/PortalShell";
import PageState from "../components/ui/PageState";
import { DoctorCardSkeleton } from "../components/ui/Skeleton";
import { useDiscoverSessions } from "../hooks/useDiscoverSessions";
import {
  buildDoctorDirectory,
  fetchPublicDoctors,
  fetchPublicSpecializations,
} from "../services/doctorService";
import { emptyDoctorFilters } from "../types/doctorFilters";
import {
  countActiveDoctorFilters,
  deriveDoctorFilterOptions,
  filterDoctors,
  getDoctorResultsLabel,
  hasActiveDoctorFilters,
} from "../utils/doctorFilters";
import "../styles/doctors-page.css";

function DoctorsPage() {
  usePageTitle("Doctors");
  const { sessions, loading: sessionsLoading, error, reload } =
    useDiscoverSessions();
  const [apiDoctors, setApiDoctors] = useState<
    Awaited<ReturnType<typeof fetchPublicDoctors>>
  >([]);
  const [catalogSpecializations, setCatalogSpecializations] = useState<string[]>(
    [],
  );
  const [apiDoctorsLoaded, setApiDoctorsLoaded] = useState(false);
  const [filters, setFilters] = useState(emptyDoctorFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDirectory() {
      const [doctorsResult, specsResult] = await Promise.allSettled([
        fetchPublicDoctors(),
        fetchPublicSpecializations(),
      ]);

      if (cancelled) return;

      if (doctorsResult.status === "fulfilled") {
        setApiDoctors(doctorsResult.value);
      } else {
        console.warn(
          "[DoctorsPage] Public doctors API unavailable — using discover sessions.",
          doctorsResult.reason,
        );
      }

      if (specsResult.status === "fulfilled") {
        setCatalogSpecializations(specsResult.value);
      } else {
        console.warn(
          "[DoctorsPage] Public specializations API unavailable — using doctor/session names.",
          specsResult.reason,
        );
      }

      setApiDoctorsLoaded(true);
    }

    void loadDirectory();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  const loading = sessionsLoading || !apiDoctorsLoaded;

  const doctors = useMemo(
    () => buildDoctorDirectory(sessions, apiDoctors),
    [sessions, apiDoctors],
  );

  const filterOptions = useMemo(
    () => deriveDoctorFilterOptions(doctors, sessions, catalogSpecializations),
    [doctors, sessions, catalogSpecializations],
  );

  const filteredDoctors = useMemo(
    () => filterDoctors(doctors, filters),
    [doctors, filters],
  );

  const filtersActive = hasActiveDoctorFilters(filters);
  const resultsLabel = getDoctorResultsLabel(
    doctors.length,
    filteredDoctors.length,
    filtersActive,
  );

  const handleFilterChange = (patch: Partial<typeof filters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  };

  const handleClearFilters = () => {
    setFilters(emptyDoctorFilters);
  };

  return (
    <PortalShell
      badge="Medical Directory"
      title="Our Doctors"
      subtitle="Browse verified consultants with live channeling sessions across partner hospitals and clinics."
    >
      <div className="doctors-page">
        {loading && (
          <div
            className="doctors-grid"
            aria-busy="true"
            aria-label="Loading doctors"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <PageState
            variant="error"
            icon="network"
            title="Unable to load doctors"
            message={USER_MESSAGES.loadFailed}
            onRetry={reload}
            retryLabel="Try Again"
          />
        )}

        {!loading && !error && doctors.length === 0 && (
          <PageState
            variant="empty"
            icon="doctors"
            title="No doctors found"
            message="There are no doctors listed right now. Try again later or book through channeling."
            onRetry={reload}
            retryLabel="Refresh"
            action={{ label: "Book Appointment", href: "/channeling" }}
          />
        )}

        {!loading && !error && doctors.length > 0 && (
          <div className="doctors-layout">
            <DoctorFiltersPanel
              filters={filters}
              options={filterOptions}
              onChange={handleFilterChange}
              onClearAll={handleClearFilters}
              className="doctors-filters--desktop"
            />

            <div className="doctors-main">
              <div className="doctors-toolbar">
                <div className="doctors-toolbar__search-wrap">
                  <label htmlFor="doctor-search" className="sr-only">
                    Search doctors
                  </label>
                  <input
                    id="doctor-search"
                    type="search"
                    className="doctors-toolbar__search"
                    placeholder="Search by name, qualification, or specialization…"
                    value={filters.searchQuery}
                    onChange={(e) =>
                      handleFilterChange({ searchQuery: e.target.value })
                    }
                    autoComplete="off"
                  />
                </div>

                <button
                  type="button"
                  className="doctors-toolbar__filter-btn"
                  aria-expanded={mobileFiltersOpen}
                  aria-controls="doctors-mobile-filters"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  Filter Doctors
                  {filtersActive ? (
                    <span className="doctors-toolbar__filter-count">
                      ({countActiveDoctorFilters(filters)})
                    </span>
                  ) : null}
                </button>
              </div>

              <p className="doctors-results-label" role="status" aria-live="polite">
                {resultsLabel}
              </p>

              {filteredDoctors.length === 0 ? (
                <PageState
                  variant="empty"
                  icon="search"
                  title="No doctors found"
                  message="Try changing your specialization or medical center filter."
                  onRetry={handleClearFilters}
                  retryLabel="Clear All Filters"
                />
              ) : (
                <div className="doctors-grid">
                  {filteredDoctors.map((doctor) => (
                    <DoctorProfileCard key={doctor.doctorId} doctor={doctor} />
                  ))}
                </div>
              )}
            </div>

            {mobileFiltersOpen ? (
              <div className="doctors-filters-drawer" role="presentation">
                <button
                  type="button"
                  className="doctors-filters-drawer__backdrop"
                  aria-label="Close filters"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <div
                  id="doctors-mobile-filters"
                  className="doctors-filters-drawer__panel"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Filter doctors"
                >
                  <div className="doctors-filters-drawer__header">
                    <h2 className="doctors-filters-drawer__title">Filter Doctors</h2>
                    <button
                      type="button"
                      className="doctors-filters-drawer__close"
                      aria-label="Close filters"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      ×
                    </button>
                  </div>
                  <DoctorFiltersPanel
                    filters={filters}
                    options={filterOptions}
                    onChange={handleFilterChange}
                    onClearAll={() => {
                      handleClearFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="doctors-filters--drawer"
                  />
                  <div className="doctors-filters-drawer__footer">
                    <button
                      type="button"
                      className="doctors-filters-drawer__apply"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      Show {filteredDoctors.length} Doctor
                      {filteredDoctors.length === 1 ? "" : "s"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </PortalShell>
  );
}

export default DoctorsPage;
