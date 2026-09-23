import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brand-our-l5qjpmwtg-deepakchandart12-gmailcoms-projects.vercel.app"),
  title: "BrandMyReach — One Brand. Every Spot.",
  description: "One exclusive sponsor. All 16 MacBook spaces, the full kit and a year of documented presence.",
  openGraph: {
    type: "website",
    siteName: "BrandMyReach",
    title: "BrandMyReach — One Brand. Every Spot.",
    description: "An exclusive sponsorship opportunity across 16 MacBook spaces and a year of documented presence.",
    images: [{ url: "/brand/brandmyreach-social.png", width: 1200, height: 630, alt: "BrandMyReach — One Brand. Every Spot." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandMyReach — One Brand. Every Spot.",
    description: "One exclusive sponsor receives the complete BrandMyReach presence.",
    images: ["/brand/brandmyreach-social.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
