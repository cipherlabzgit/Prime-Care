import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import PremierCareLogo from "./branding/PremierCareLogo";
import { CHANNELING_BOOKING_URL } from "../utils/bookingNavigation";
import "../styles/navbar.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About Us", to: "/about" },
  { label: "Doctors", to: "/doctors" },
  { label: "Channeling", to: "/channeling" },
  { label: "Contact", to: "/contact" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="navbar__links">
      {navItems.map(({ label, to }) => (
        <li key={to}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `navbar__link${isActive ? " navbar__link--active" : ""}`
            }
            end={to === "/"}
            onClick={onNavigate}
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="navbar">
        <Link
          to="/"
          className="navbar__logo"
          onClick={closeMenu}
          aria-label="PremierCare — Home"
        >
          <PremierCareLogo context="header" showTagline />
        </Link>

        <button
          type="button"
          className="navbar__menu-btn"
          aria-expanded={menuOpen}
          aria-controls="main-navigation-mobile"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span
            className={`navbar__menu-icon${menuOpen ? " navbar__menu-icon--open" : ""}`}
          />
        </button>

        <nav
          className="navbar__nav navbar__nav--desktop"
          aria-label="Main navigation"
        >
          <NavLinks />
        </nav>

        <Link to={CHANNELING_BOOKING_URL} className="navbar__cta navbar__cta--desktop">
          Book Appointment
        </Link>
      </header>

      {/*
        Mobile overlay is a sibling of the sticky header (not a child) so
        position:fixed is relative to the viewport. Nested fixed + backdrop-filter
        on iOS Safari otherwise traps the menu inside the header bar.
      */}
      <nav
        id="main-navigation-mobile"
        className={`navbar__nav navbar__nav--mobile${menuOpen ? " navbar__nav--open" : ""}`}
        aria-label="Main navigation"
        aria-hidden={!menuOpen}
      >
        <NavLinks onNavigate={closeMenu} />
        <Link
          to={CHANNELING_BOOKING_URL}
          className="navbar__cta navbar__cta--mobile"
          onClick={closeMenu}
        >
          Book Appointment
        </Link>
      </nav>

      {menuOpen ? (
        <button
          type="button"
          className="navbar__backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      ) : null}
    </>
  );
}

export default Navbar;
