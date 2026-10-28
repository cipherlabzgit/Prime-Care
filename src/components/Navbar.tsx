import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import PremierCareLogo from "./branding/PremierCareLogo";
import { usePatientAuth } from "../context/PatientAuthContext";
import {
  CHANNELING_BOOKING_URL,
  MY_BOOKINGS_URL,
} from "../utils/bookingNavigation";
import NavbarServicesNavItem from "./NavbarServicesNavItem";
import "../styles/navbar.css";

const navItems = [
  { label: "About Us", to: "/about" },
  { label: "Doctors", to: "/doctors" },
  { label: "Channeling", to: "/channeling" },
  { label: "Contact", to: "/contact" },
] as const;

function NavLinks({
  onNavigate,
  layout = "desktop",
}: {
  onNavigate?: () => void;
  layout?: "desktop" | "mobile";
}) {
  return (
    <ul className="navbar__links">
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `navbar__link${isActive ? " navbar__link--active" : ""}`
          }
          end
          onClick={onNavigate}
        >
          Home
        </NavLink>
      </li>
      <NavbarServicesNavItem layout={layout} onNavigate={onNavigate} />
      {navItems.map(({ label, to }) => (
        <li key={to}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `navbar__link${isActive ? " navbar__link--active" : ""}`
            }
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
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 12);
  const { pathname } = useLocation();
  const { isSignedIn, session, signOut } = usePatientAuth();
  const isHome = pathname === "/";

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 40);

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1240) setMenuOpen(false);
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
      <header
        className={`navbar${isScrolled || !isHome ? " navbar--surface" : ""}`}
      >
        <div className="navbar__bar">
          <Link
            to="/"
            className="navbar__logo"
            onClick={closeMenu}
            aria-label="PremierCare Home"
          >
            <PremierCareLogo context="header" />
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
            <NavLinks layout="desktop" />
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
            <span>Book Appointment</span>
            <span className="navbar__cta-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          </div>
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
        <NavLinks layout="mobile" onNavigate={closeMenu} />
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
            <span>Book Appointment</span>
            <span className="navbar__cta-arrow" aria-hidden="true">
              →
            </span>
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
