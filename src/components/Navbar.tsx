import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import PremierCareLogo from "./branding/PremierCareLogo";
import { usePatientAuth } from "../context/PatientAuthContext";
import {
  CHANNELING_BOOKING_URL,
  MY_BOOKINGS_URL,
} from "../utils/bookingNavigation";
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
  const { isSignedIn, session, signOut } = usePatientAuth();

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

        <div className="navbar__actions navbar__actions--desktop">
          {isSignedIn && session ? (
            <div className="navbar__session">
              <span className="navbar__session-name" title={session.patient.fullName}>
                {session.patient.fullName.split(" ")[0]}
              </span>
              <button
                type="button"
                className="navbar__session-out"
                onClick={() => {
                  void signOut();
                }}
              >
                Sign out
              </button>
            </div>
          ) : null}
          <Link to={MY_BOOKINGS_URL} className="navbar__secondary">
            My Bookings
          </Link>
          <Link to={CHANNELING_BOOKING_URL} className="navbar__cta">
            Book Appointment
          </Link>
        </div>
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
        <div className="navbar__actions navbar__actions--mobile">
          {isSignedIn && session ? (
            <div className="navbar__session navbar__session--mobile">
              <span className="navbar__session-name">{session.patient.fullName}</span>
              <button
                type="button"
                className="navbar__session-out"
                onClick={() => {
                  void signOut().then(closeMenu);
                }}
              >
                Sign out
              </button>
            </div>
          ) : null}
          <Link
            to={MY_BOOKINGS_URL}
            className="navbar__secondary"
            onClick={closeMenu}
          >
            My Bookings
          </Link>
          <Link
            to={CHANNELING_BOOKING_URL}
            className="navbar__cta"
            onClick={closeMenu}
          >
            Book Appointment
          </Link>
        </div>
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
