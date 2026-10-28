import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { landingPages } from "../data/landingPagesData";

interface NavbarServicesNavItemProps {
  layout: "desktop" | "mobile";
  onNavigate?: () => void;
}

function NavbarServicesNavItem({ layout, onNavigate }: NavbarServicesNavItemProps) {
  const menuId = useId();
  const containerRef = useRef<HTMLLIElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const { pathname } = useLocation();

  const isServicesHubActive = pathname === "/services";
  const isLandingActive = landingPages.some((page) => pathname === `/${page.slug}`);
  const isActive = isServicesHubActive || isLandingActive;

  useEffect(() => {
    setPanelOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (layout !== "desktop" || !panelOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (target && !containerRef.current?.contains(target)) {
        setPanelOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [layout, panelOpen]);

  const closePanel = () => {
    setPanelOpen(false);
    onNavigate?.();
  };

  if (layout === "mobile") {
    return (
      <li className="navbar__item navbar__item--services-mobile">
        <div className="navbar__mobile-services-row">
          <NavLink
            to="/services"
            className={({ isActive: linkActive }) =>
              `navbar__link navbar__link--services-main${
                linkActive || isActive ? " navbar__link--active" : ""
              }`
            }
            onClick={onNavigate}
          >
            Services
          </NavLink>
          <button
            type="button"
            className="navbar__services-expand"
            aria-expanded={panelOpen}
            aria-controls={menuId}
            onClick={() => setPanelOpen((open) => !open)}
          >
            <span className="navbar__services-expand-label">
              {panelOpen ? "Hide service pages" : "Show service pages"}
            </span>
            <span className="navbar__services-expand-icon" aria-hidden="true">
              {panelOpen ? "−" : "+"}
            </span>
          </button>
        </div>
        {panelOpen ? (
          <ul id={menuId} className="navbar__mobile-subnav">
            {landingPages.map((page) => (
              <li key={page.id}>
                <Link
                  to={`/${page.slug}`}
                  className="navbar__mobile-sublink"
                  onClick={closePanel}
                >
                  {page.seoTitle}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="navbar__mobile-sublink navbar__mobile-sublink--all" onClick={closePanel}>
                View all services
              </Link>
            </li>
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <li
      ref={containerRef}
      className={`navbar__item navbar__item--dropdown${
        panelOpen ? " navbar__item--dropdown-open" : ""
      }`}
      onMouseEnter={() => setPanelOpen(true)}
      onMouseLeave={() => setPanelOpen(false)}
    >
      <div className="navbar__dropdown-trigger">
        <NavLink
          to="/services"
          className={({ isActive: linkActive }) =>
            `navbar__link${linkActive || isActive ? " navbar__link--active" : ""}`
          }
          end={false}
        >
          Services
        </NavLink>
        <button
          type="button"
          className="navbar__dropdown-toggle"
          aria-expanded={panelOpen}
          aria-controls={menuId}
          aria-haspopup="true"
          aria-label="Show healthcare service pages"
          onClick={() => setPanelOpen((open) => !open)}
        >
          <span className="navbar__dropdown-caret" aria-hidden="true" />
        </button>
      </div>
      <ul
        id={menuId}
        className="navbar__dropdown-panel"
        role="menu"
        aria-label="Healthcare service pages"
      >
        {landingPages.map((page) => (
          <li key={page.id} role="none">
            <Link
              role="menuitem"
              to={`/${page.slug}`}
              className="navbar__dropdown-link"
              onClick={() => setPanelOpen(false)}
            >
              {page.seoTitle}
            </Link>
          </li>
        ))}
        <li role="none" className="navbar__dropdown-divider">
          <Link
            role="menuitem"
            to="/services"
            className="navbar__dropdown-link navbar__dropdown-link--all"
            onClick={() => setPanelOpen(false)}
          >
            View all services
          </Link>
        </li>
      </ul>
    </li>
  );
}

export default NavbarServicesNavItem;
