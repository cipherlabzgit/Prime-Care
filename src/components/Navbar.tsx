import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import PremierCareLogo from "./branding/PremierCareLogo";
import "../styles/navbar.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About Us", to: "/about" },
  { label: "Doctors", to: "/doctors" },
  { label: "Channeling", to: "/channeling" },
  { label: "Contact", to: "/contact" },
] as const;

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

  return (
    <header className="navbar">
      <Link
        to="/"
        className="navbar__logo"
        onClick={() => setMenuOpen(false)}
        aria-label="PremierCare — Home"
      >
        <PremierCareLogo context="header" showTagline />
      </Link>

      <button
        type="button"
        className="navbar__menu-btn"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={`navbar__menu-icon${menuOpen ? " navbar__menu-icon--open" : ""}`} />
      </button>

      <nav
        id="main-navigation"
        className={`navbar__nav${menuOpen ? " navbar__nav--open" : ""}`}
        aria-label="Main navigation"
      >
        <ul className="navbar__links">
          {navItems.map(({ label, to }) => (
            <li key={to}>
              {to.includes("#") ? (
                <a
                  href={to}
                  className="navbar__link"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ) : (
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `navbar__link${isActive ? " navbar__link--active" : ""}`
                  }
                  end={to === "/"}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
        <Link
          to="/channeling"
          className="navbar__cta navbar__cta--mobile"
          onClick={() => setMenuOpen(false)}
        >
          Book Appointment
        </Link>
      </nav>

      <Link to="/channeling" className="navbar__cta navbar__cta--desktop">
        Book Appointment
      </Link>

      {menuOpen ? (
        <button
          type="button"
          className="navbar__backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
    </header>
  );
}

export default Navbar;
