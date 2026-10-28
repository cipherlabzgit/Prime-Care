import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDiscoverSessions } from "../../hooks/useDiscoverSessions";
import { featuredDoctorIds } from "../../data/homeData";
import { deriveDoctorsFromSessions } from "../../utils/channelingUtils";
import { getDoctorProfileImagePath } from "../../utils/doctorDisplayUtils";
import PageState from "../ui/PageState";
import { USER_MESSAGES } from "../../utils/userMessages";
import DoctorCard from "./DoctorCard";
import ScrollReveal from "./ScrollReveal";

function FeaturedDoctorSkeleton() {
  return (
    <div className="doctor-card doctor-card--modern animate-pulse" aria-hidden="true">
      <div className="doctor-card__media doctor-card__media--skeleton" />
      <div className="doctor-card__body">
        <div className="mb-3 h-5 w-4/5 rounded-lg bg-slate-200" />
        <div className="mb-2 h-4 w-1/2 rounded-full bg-slate-200" />
        <div className="mb-4 h-4 w-full rounded-lg bg-slate-200" />
        <div className="h-11 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

function FeaturedDoctorsSection() {
  const { sessions, loading, error, reload } = useDiscoverSessions();
  const featuredDoctors = useMemo(() => {
    const directory = deriveDoctorsFromSessions(sessions);
    const byId = new Map(directory.map((doctor) => [doctor.doctorId, doctor]));
    const picked = featuredDoctorIds
      .map((id) => byId.get(id))
      .filter((doctor): doctor is NonNullable<typeof doctor> => Boolean(doctor));

    if (picked.length > 0) {
      return picked;
    }

    return directory
      .filter((doctor) => doctor.doctorId !== 3)
      .slice(0, 3);
  }, [sessions]);

  return (
    <section
      className="home-section featured-doctors-section"
      id="doctors"
      aria-labelledby="doctors-heading"
    >
      <ScrollReveal>
        <header className="section-header section-header--center featured-doctors-section__header">
          <span className="section-header__eyebrow">Meet Our Team</span>
          <h2 id="doctors-heading" className="featured-doctors-section__title">
            <span>Our</span>
            <span className="featured-doctors-section__title-accent">Doctors</span>
          </h2>
          <p className="section-header__desc">
            Experienced practitioners across Homeopathy, therapeutic services, psychology, and
            wellness, ready to support your care journey.
          </p>
        </header>
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
                designation={doctor.designation}
                experienceYears={doctor.experienceYears}
                profileImage={getDoctorProfileImagePath(doctor)}
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
