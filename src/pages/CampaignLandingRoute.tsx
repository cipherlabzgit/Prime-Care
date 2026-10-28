import { Navigate } from "react-router-dom";
import CampaignLandingPage from "../components/landing/CampaignLandingPage";
import { getLandingPageBySlug } from "../data/landingPagesData";
import { useEffect } from "react";
import "../styles/home.css";
import "../styles/landing.css";

interface CampaignLandingRouteProps {
  slug: string;
}

function CampaignLandingRoute({ slug }: CampaignLandingRouteProps) {
  const config = getLandingPageBySlug(slug);

  useEffect(() => {
    if (!config) return;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", config.seoDescription);
    } else {
      const el = document.createElement("meta");
      el.name = "description";
      el.content = config.seoDescription;
      document.head.appendChild(el);
    }
  }, [config]);

  if (!config) {
    return <Navigate to="/" replace />;
  }

  return <CampaignLandingPage config={config} />;
}

export default CampaignLandingRoute;
