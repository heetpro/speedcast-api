import type { Metadata } from "next";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import "@/styles/globals.css";
import "@/styles/fonts.css";

export const metadata: Metadata = {
  title: "SpeedCast API - Streamlined API Request Handling with Toast Notifications",
  metadataBase: new URL("https://speedcast.heet.pro"),
  description: "SpeedCast API - A lightweight library for simplified API request handling with integrated error management, toast notifications, caching, and rate limiting capabilities",
  keywords: ["API handling", "toast notifications", "error management", "React hooks", "API requests", "caching", "rate limiting", "data fetching", "React API library"],
  authors: [{ name: "SpeedCast API" }],
  creator: "SpeedCast API Team",
  publisher: "SpeedCast API",
  openGraph: {
    title: "SpeedCast API - Streamlined API Request Handling",
    description: "Simplify API requests with built-in error handling, toast notifications, caching and rate limiting",
    url: "https://speedcast.heet.pro",
    siteName: "SpeedCast API",
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "SpeedCast API Banner"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedCast API - Streamlined API Request Handling",
    description: "Simplify API requests with built-in error handling and toast notifications",
    images: ["/banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://speedcast.heet.pro',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className="antialiased tracking-wide"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <main className=" mx-auto h-auto scroll-smooth">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
