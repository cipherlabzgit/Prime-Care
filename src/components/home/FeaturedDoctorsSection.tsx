import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDiscoverSessions } from "../../hooks/useDiscoverSessions";
import { deriveDoctorsFromSessions } from "../../utils/channelingUtils";
import { getInitials } from "../../utils/channelingUtils";
import PageState from "../ui/PageState";
import { USER_MESSAGES } from "../../utils/userMessages";
import DoctorCard from "./DoctorCard";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

function FeaturedDoctorSkeleton() {
  return (
    <div
      className="doctor-card doctor-card--premium animate-pulse"
      aria-hidden="true"
    >
      <div className="mb-4 h-14 w-14 rounded-2xl bg-slate-200" />
      <div className="mb-2 h-5 w-3/4 rounded-lg bg-slate-200" />
      <div className="mb-2 h-4 w-1/2 rounded-lg bg-slate-200" />
      <div className="mb-4 h-4 w-full rounded-lg bg-slate-200" />
      <div className="h-10 rounded-full bg-slate-200" />
    </div>
  );
}

function FeaturedDoctorsSection() {
  const { sessions, loading, error, reload } = useDiscoverSessions();
  const featuredDoctors = useMemo(
    () => deriveDoctorsFromSessions(sessions).slice(0, 3),
    [sessions],
  );

  return (
    <section className="home-section" id="doctors" aria-labelledby="doctors-heading">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Meet Our Team"
          title="Our Practitioners"
          description="Experienced practitioners across Homeopathy, therapeutic services, psychology, and wellness—ready to support your care journey."
        />
      </ScrollReveal>

      <div className="home-grid home-grid--3 home-grid--doctors">
        {loading &&
          Array.from({ length: 3 }, (_, i) => (
            <FeaturedDoctorSkeleton key={i} />
          ))}

        {!loading && error && (
          <div className="col-span-full">
            <PageState
              variant="error"
              icon="network"
              title="Unable to load doctors"
              message={USER_MESSAGES.loadFailed}
              onRetry={reload}
              retryLabel="Try Again"
            />
          </div>
        )}

        {!loading &&
          !error &&
          featuredDoctors.map((doctor, index) => (
            <ScrollReveal key={doctor.doctorId} delay={index * 90}>
              <DoctorCard
                doctorId={doctor.doctorId}
                name={doctor.doctorName}
                specialization={doctor.specialization}
                qualifications={doctor.qualification}
                initials={getInitials(doctor.doctorName)}
              />
            </ScrollReveal>
          ))}

        {!loading && !error && featuredDoctors.length === 0 && (
          <div className="col-span-full">
            <PageState
              variant="empty"
              icon="doctors"
              title="No doctors found"
              message="Check back soon or browse our full specialist directory."
              action={{ label: "View All Doctors", href: "/doctors" }}
            />
          </div>
        )}
      </div>

      <ScrollReveal delay={200}>
        <div className="home-section__cta home-section__cta--row">
          <Link to="/doctors" className="home-btn home-btn--outline">
            View All Doctors
          </Link>
          <Link to="/channeling" className="home-btn home-btn--primary">
            Book Appointment
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default FeaturedDoctorsSection;
