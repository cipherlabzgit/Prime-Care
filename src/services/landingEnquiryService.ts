import axios from "axios";
import type { LandingEnquiryPayload } from "../types/landingPage";

const ENQUIRY_URL = "/api/public/landing-enquiry";

export async function submitLandingEnquiry(payload: LandingEnquiryPayload): Promise<void> {
  await axios.post(ENQUIRY_URL, payload, {
    headers: { "Content-Type": "application/json" },
  });
}
