import { NextRequest } from "next/server";

export const runtime = "edge";

function mapToPersona(
  country: string,
  referrer: string,
  language: string
): { persona: string; reason: string } {
  // Referral source signals (strongest signal)
  if (referrer.includes("linkedin.com")) {
    return { persona: "enterprise", reason: "LinkedIn referral" };
  }
  if (referrer.includes("github.com") || referrer.includes("dev.to")) {
    return { persona: "startup", reason: "Developer community referral" };
  }
  if (
    referrer.includes("college") ||
    referrer.includes("university") ||
    referrer.includes("edu")
  ) {
    return { persona: "student", reason: "Education referral" };
  }

  // Country-based mapping
  const enterpriseCountries = [
    "US", "GB", "DE", "JP", "SG", "AU",
    "CA", "FR", "NL", "SE", "CH", "AE",
  ];
  const startupCountries = [
    "IN", "NG", "BR", "ID", "PK", "BD",
    "PH", "VN", "KE", "EG", "ZA",
  ];

  if (enterpriseCountries.includes(country)) {
    return { persona: "enterprise", reason: `Enterprise market (${country})` };
  }
  if (startupCountries.includes(country)) {
    return { persona: "startup", reason: `Startup ecosystem (${country})` };
  }

  // Language-based fallback
  if (language.startsWith("en-US") || language.startsWith("en-GB")) {
    return { persona: "enterprise", reason: "English enterprise locale" };
  }

  return { persona: "startup", reason: "Default" };
}

export async function GET(req: NextRequest) {
  // Vercel provides these automatically on deployment
  const country = req.headers.get("x-vercel-ip-country") || "IN";
  const city =
    req.headers.get("x-vercel-ip-city") || "Chennai";
  const region =
    req.headers.get("x-vercel-ip-country-region") || "TN";
  const referrer = req.headers.get("referer") || "";
  const language = req.headers.get("accept-language") || "en-IN";
  const timezone = req.headers.get("x-vercel-ip-timezone") || "Asia/Kolkata";

  const { persona, reason } = mapToPersona(country, referrer, language);

  return Response.json({
    country,
    city,
    region,
    timezone,
    language: language.split(",")[0],
    referrer: referrer || "direct",
    detectedPersona: persona,
    reason,
    signals: {
      fromLinkedIn: referrer.includes("linkedin"),
      fromGitHub: referrer.includes("github"),
      isEnterpriseCountry: [
        "US","GB","DE","JP","SG","AU","CA","FR",
      ].includes(country),
      isStartupEcosystem: ["IN","NG","BR","ID"].includes(country),
    },
  });
}
