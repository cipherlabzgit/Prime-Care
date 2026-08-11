import { Link } from "react-router-dom";
import PremierCareLogo from "../branding/PremierCareLogo";
import {
  footerBranding,
  footerContact,
  footerQuickLinks,
  footerServiceLinks,
  footerSocialLinks,
  footerTrustItems,
  footerTrustStats,
} from "../../data/footerData";
import "../../styles/footer.css";

function FooterLinkItem({ href, label }: { href: string; label: string }) {
  if (href.includes("#")) {
    return (
      <li>
        <a href={href}>{label}</a>
      </li>
    );
  }

  return (
    <li>
      <Link to={href}>{label}</Link>
    </li>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-footer__stats" aria-label="PremierCare trust statistics">
        {footerTrustStats.map((stat) => (
          <div key={stat.label} className="site-footer__stat">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo" aria-label="PremierCare — Home">
            <PremierCareLogo context="footer" showTagline />
          </Link>
          <p className="site-footer__tagline">{footerBranding.tagline}</p>
          <div className="site-footer__trust" aria-label="Trust indicators">
            {footerTrustItems.map((item) => (
              <span key={item.label} className="site-footer__trust-item">
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="site-footer__col">
          <h3 className="site-footer__heading">Quick Links</h3>
          <ul className="site-footer__links">
            {footerQuickLinks.map((link) => (
              <FooterLinkItem key={link.href} href={link.href} label={link.label} />
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h3 className="site-footer__heading">Medical Services</h3>
          <ul className="site-footer__links">
            {footerServiceLinks.map((link) => (
              <FooterLinkItem key={link.href} href={link.href} label={link.label} />
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h3 className="site-footer__heading">Contact</h3>
          <ul className="site-footer__contact">
            <li>
              <span>Phone</span>
              <a href={footerContact.phoneHref}>{footerContact.phone}</a>
            </li>
            <li>
              <span>Email</span>
              <a href={footerContact.emailHref}>{footerContact.email}</a>
            </li>
            <li>
              <span>Address</span>
              <address>{footerContact.address}</address>
            </li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h3 className="site-footer__heading">Follow Us</h3>
          <div className="site-footer__social">
            {footerSocialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="site-footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
              >
                {social.icon === "facebook" && "f"}
                {social.icon === "instagram" && "ig"}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>{footerBranding.copyright}</p>
      </div>
    </footer>
  );
}

export default SiteFooter;
