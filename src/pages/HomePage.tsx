import { usePageTitle } from "../hooks/usePageTitle";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CtaSection from "../components/home/CtaSection";
import CareModelSection from "../components/home/CareModelSection";
import FeaturedDoctorsSection from "../components/home/FeaturedDoctorsSection";
import SiteFooter from "../components/layout/SiteFooter";
import SpecialtiesSection from "../components/home/SpecialtiesSection";
import StatisticsSection from "../components/home/StatisticsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import WelcomeSection from "../components/home/WelcomeSection";
import WhyChooseUsSection from "../components/home/WhyChooseUsSection";
import "../styles/about.css";
import "../styles/home.css";

function HomePage() {
  usePageTitle();
  return (
    <div className="home-page flex min-h-svh flex-col">
      <Navbar />
      <main className="home-main flex-1">
        <Hero />
        <WelcomeSection />
        <CareModelSection />
        <WhyChooseUsSection />
        <SpecialtiesSection />
        <StatisticsSection />
        <FeaturedDoctorsSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}

export default HomePage;
