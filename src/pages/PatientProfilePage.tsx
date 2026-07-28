import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import PortalShell from "../components/layout/PortalShell";
import PageState from "../components/ui/PageState";
import Button from "../components/ui/Button";
import { usePageTitle } from "../hooks/usePageTitle";
import { useToast } from "../context/ToastContext";
import { searchPatients } from "../services/patientService";
import type { ExistingPatientProfile } from "../types/patient";
import { USER_MESSAGES } from "../utils/userMessages";
import "../styles/patient-profile.css";

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="patient-profile__field">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function PatientProfilePage() {
  usePageTitle("Patient Profile");
  const { showToast } = useToast();

  const [mobileNumber, setMobileNumber] = useState("");
  const [nic, setNic] = useState("");
  const [profile, setProfile] = useState<ExistingPatientProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async () => {
    setError(null);
    setProfile(null);

    const mobile = mobileNumber.trim();
    const nicValue = nic.trim();

    if (!mobile && !nicValue) {
      setError("Enter your mobile number or NIC to look up your profile.");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const results = await searchPatients({
        mobileNumber: mobile || undefined,
        nic: nicValue || undefined,
      });
      if (results.length === 0) {
        setError(USER_MESSAGES.profileNotFound);
        return;
      }
      setProfile(results[0]);
    } catch {
      setError(USER_MESSAGES.profileLoadFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    void runSearch();
  };

  const handleClear = () => {
    setMobileNumber("");
    setNic("");
    setProfile(null);
    setSearched(false);
    setError(null);
  };

  const handleSaveProfile = () => {
    showToast(USER_MESSAGES.profileUpdateSuccess);
  };

  return (
    <PortalShell
      badge="Patient Portal"
      title="Patient Profile"
      subtitle="Look up your registered details, upcoming appointments, and prescriptions."
    >
      <div className="patient-profile">
        <form className="patient-profile__search" onSubmit={handleSearch}>
          <div className="patient-profile__search-grid">
            <div>
              <label htmlFor="profile-mobile" className="patient-profile__label">
                Mobile Number
              </label>
              <input
                id="profile-mobile"
                type="tel"
                className="patient-profile__input"
                value={mobileNumber}
                disabled={loading}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="e.g. 0771234567"
                autoComplete="tel"
              />
            </div>
            <div>
              <label htmlFor="profile-nic" className="patient-profile__label">
                NIC / Passport
              </label>
              <input
                id="profile-nic"
                type="text"
                className="patient-profile__input"
                value={nic}
                disabled={loading}
                onChange={(e) => setNic(e.target.value)}
                placeholder="Optional if mobile is provided"
                autoComplete="off"
              />
            </div>
          </div>
          {error && !searched ? (
            <p className="patient-profile__form-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="patient-profile__search-actions">
            <Button type="submit" disabled={loading}>
              {loading ? "Searching…" : "Find My Profile"}
            </Button>
            {searched ? (
              <button
                type="button"
                className="patient-profile__clear"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
            ) : null}
          </div>
        </form>

        {loading && (
          <div className="patient-profile__skeleton" aria-busy="true" aria-label="Loading profile">
            <div className="patient-profile__skeleton-card" />
            <div className="patient-profile__skeleton-section" />
            <div className="patient-profile__skeleton-section" />
          </div>
        )}

        {!loading && error && searched && (
          <PageState
            variant={error === USER_MESSAGES.profileLoadFailed ? "error" : "empty"}
            icon="search"
            title={
              error === USER_MESSAGES.profileLoadFailed
                ? "Unable to load profile"
                : "Profile not found"
            }
            message={error}
            onRetry={() => void runSearch()}
            retryLabel="Try Again"
            action={
              error === USER_MESSAGES.profileNotFound
                ? { label: "Book an appointment", href: "/channeling" }
                : undefined
            }
          />
        )}

        {!loading && !error && !profile && !searched && (
          <PageState
            variant="empty"
            icon="profile"
            title="Look up your profile"
            message="Enter the mobile number or NIC used during registration to view your details."
            action={{ label: "Book an appointment", href: "/channeling" }}
          />
        )}

        {!loading && profile && (
          <div className="patient-profile__content">
            <section className="patient-profile__card" aria-labelledby="profile-details-heading">
              <div className="patient-profile__card-header">
                <div className="patient-profile__avatar" aria-hidden="true">
                  {profile.fullName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h2 id="profile-details-heading" className="patient-profile__name">
                    {profile.fullName}
                  </h2>
                  <p className="patient-profile__code">Patient ID: {profile.patientCode}</p>
                </div>
              </div>
              <dl className="patient-profile__details">
                <ProfileField label="Mobile" value={profile.mobileNumber} />
                {profile.nic ? <ProfileField label="NIC" value={profile.nic} /> : null}
                {profile.email ? <ProfileField label="Email" value={profile.email} /> : null}
              </dl>
              <Button type="button" variant="secondary" onClick={handleSaveProfile}>
                Update Contact Details
              </Button>
            </section>

            <section className="patient-profile__section" aria-labelledby="appointments-heading">
              <h3 id="appointments-heading">Upcoming Appointments</h3>
              <PageState
                variant="empty"
                icon="calendar"
                title="No upcoming appointments"
                message="You don't have any scheduled visits. Book a channeling session to see appointments here."
                action={{ label: "Book Appointment", href: "/channeling" }}
              />
            </section>

            <section className="patient-profile__section" aria-labelledby="prescriptions-heading">
              <h3 id="prescriptions-heading">Prescriptions</h3>
              <PageState
                variant="empty"
                icon="prescription"
                title="No prescriptions on file"
                message="Prescriptions from your consultations will appear here after your visit."
                action={{ label: "Contact clinic", href: "/contact" }}
              />
            </section>

            <p className="patient-profile__hint">
              Need to change an appointment?{" "}
              <Link to="/contact">Contact our support team</Link> with your booking reference.
            </p>
          </div>
        )}
      </div>
    </PortalShell>
  );
}

export default PatientProfilePage;
