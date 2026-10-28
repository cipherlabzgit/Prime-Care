import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ChannelingPage from "./pages/ChannelingPage";
import DoctorsPage from "./pages/DoctorsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import PatientProfilePage from "./pages/PatientProfilePage";
import ReceptionDeskPage from "./pages/ReceptionDeskPage";
import ReviewManagementPage from "./pages/ReviewManagementPage";
import RmoDeskPage from "./pages/RmoDeskPage";
import ServicesPage from "./pages/ServicesPage";
import CampaignLandingRoute from "./pages/CampaignLandingRoute";

function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ReactLenis root options={{ autoRaf: true, lerp: 0.09 }}>
        <ScrollToTop />
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/child-development" element={<CampaignLandingRoute slug="child-development" />} />
        <Route path="/physical-health" element={<CampaignLandingRoute slug="physical-health" />} />
        <Route path="/mental-wellbeing" element={<CampaignLandingRoute slug="mental-wellbeing" />} />
        <Route path="/integrative-health" element={<CampaignLandingRoute slug="integrative-health" />} />
        <Route path="/nutrition" element={<CampaignLandingRoute slug="nutrition" />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/channeling" element={<ChannelingPage />} />
        <Route path="/book" element={<ChannelingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/patient/profile" element={<PatientProfilePage />} />
        <Route path="/channeling/reception" element={<ReceptionDeskPage />} />
        <Route path="/channeling/rmo" element={<RmoDeskPage />} />
        <Route path="/channeling/reviews" element={<ReviewManagementPage />} />
      </Routes>
      </ReactLenis>
    </BrowserRouter>
  );
}

export default App;