import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/channeling" element={<ChannelingPage />} />
        <Route path="/book" element={<ChannelingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/patient/profile" element={<PatientProfilePage />} />
        <Route path="/channeling/reception" element={<ReceptionDeskPage />} />
        <Route path="/channeling/rmo" element={<RmoDeskPage />} />
        <Route path="/channeling/reviews" element={<ReviewManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;