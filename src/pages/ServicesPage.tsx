import { useEffect, useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { USER_MESSAGES } from "../utils/userMessages";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import ServiceDetailSection from "../components/services/ServiceDetailSection";
import ServicesCtaSection from "../components/services/ServicesCtaSection";
import ServicesStatsSection from "../components/services/ServicesStatsSection";
import PageState from "../components/ui/PageState";
import { fetchClinicalServices } from "../services/clinicalServicesService";
import type { ClinicalService } from "../types/service";
import "../styles/home.css";
import "../styles/services.css";

function ServicesPage() {
  usePageTitle("Services");
  const location = useLocation();
  const [services, setServices] = useState<ClinicalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchClinicalServices();
        if (!cancelled) setServices(data);
      } catch {
        if (!cancelled) {
          setError(USER_MESSAGES.loadFailed);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loading || !location.hash) return;

    const slug = location.hash.replace("#", "");
    const timer = window.setTimeout(() => {
      const target = document.getElementById(slug);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [loading, location.hash]);

  return (
    <div className="services-page flex min-h-svh flex-col">
      <Navbar />
      <main className="services-main flex-1">
        {loading ? (
          <section className="home-section services-loading" aria-label="Loading services">
            <div className="services-loading__grid">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="services-loading__card animate-pulse" />
              ))}
            </div>
          </section>
        ) : null}

        {!loading && error ? (
          <PageState
            variant="error"
            icon="network"
            title="Unable to load services"
            message={USER_MESSAGES.loadFailed}
          />
        ) : null}

        {!loading && !error ? (
          <>
            <ServicesStatsSection />
            <div className="services-catalog">
              {services.map((service, index) => (
                <ServiceDetailSection
                  key={service.id}
                  service={service}
                  index={index}
                />
              ))}
            </div>
            <ServicesCtaSection />
          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}

export default ServicesPage;
