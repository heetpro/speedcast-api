import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "SpeedCast API - Modern API Client for JavaScript Applications",
  description: "Blazing fast API client with built-in caching, rate limiting, toast notifications, and TypeScript support for modern JavaScript applications",
  keywords: ["API client", "JavaScript", "TypeScript", "caching", "rate limiting", "toast notifications", "React", "Next.js", "frontend", "developer tools"],
  openGraph: {
    title: "SpeedCast API - Modern API Client",
    description: "Blazing fast API client with built-in caching, rate limiting, and TypeScript support",
    images: [
      {
        url: "/banner.svg",
        width: 1200,
        height: 630,
        alt: "SpeedCast API Banner"
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedCast API - Modern API Client",
    description: "Blazing fast API client with built-in caching and rate limiting",
    images: ["/banner.svg"],
  },
  alternates: {
    canonical: 'https://speedcast.heet.pro',
  }
};

export default function Home() {
  return <HomeClient />;
}
