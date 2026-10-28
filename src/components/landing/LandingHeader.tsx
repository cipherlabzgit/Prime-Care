import { Link } from "react-router-dom";
import PremierCareLogo from "../branding/PremierCareLogo";
import { CHANNELING_BOOKING_URL } from "../../utils/bookingNavigation";

function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="landing-header__inner">
        <Link to="/" className="landing-header__logo" aria-label="Premier Care — home">
          <PremierCareLogo context="header" />
        </Link>
        <nav className="landing-header__nav" aria-label="Campaign page">
          <Link to="/" className="landing-header__link">
            Main website
          </Link>
          <a href={CHANNELING_BOOKING_URL} className="landing-header__cta">
            Book appointment
          </a>
        </nav>
      </div>
    </header>
  );
}

export default LandingHeader;
