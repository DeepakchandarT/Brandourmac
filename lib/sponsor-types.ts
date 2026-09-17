export type SponsorConfig = {
  name: string;
  website: string;
  logoDataUrl: string | null;
  logoMime: "image/png" | "image/webp" | "image/svg+xml" | null;
  version: number;
  updatedAt: string;
};

export const DEFAULT_SPONSOR: SponsorConfig = {
  name: "Postiz",
  website: "https://postiz.com/",
  // The default intentionally renders the requested YOUR BRAND placeholder.
  // Existing Postiz assets remain in /public and are not deleted.
  logoDataUrl: null,
  logoMime: null,
  version: 1,
  updatedAt: "2026-09-17T00:00:00.000Z",
};

export function publicSponsor(config: SponsorConfig) {
  return { name: config.name, website: config.website, version: config.version, hasLogo: !!config.logoDataUrl };
}
