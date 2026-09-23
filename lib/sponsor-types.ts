export type SponsorConfig = {
  name: string;
  website: string;
  fundsRaised: number;
  fundingCurrency: "USD" | "EUR" | "INR";
  showLiveVisitors: boolean;
  logoDataUrl: string | null;
  logoMime: "image/png" | "image/webp" | "image/svg+xml" | null;
  version: number;
  updatedAt: string;
};

export const DEFAULT_SPONSOR: SponsorConfig = {
  name: "Your Brand",
  website: "/",
  fundsRaised: 0,
  fundingCurrency: "USD",
  showLiveVisitors: true,
  // The default intentionally renders the requested YOUR BRAND placeholder.
  // Existing example assets remain available; public placements use the sponsor manager.
  logoDataUrl: null,
  logoMime: null,
  version: 1,
  updatedAt: "2026-09-17T00:00:00.000Z",
};

export function publicSponsor(config: SponsorConfig) {
  return { name: config.name, website: config.website, fundsRaised: config.fundsRaised, fundingCurrency: config.fundingCurrency, showLiveVisitors: config.showLiveVisitors, version: config.version, hasLogo: !!config.logoDataUrl };
}
