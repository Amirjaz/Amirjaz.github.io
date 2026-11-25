import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name}, ${site.role}`,
  description: site.description,
  alternates: { canonical: "/" },
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: `${site.name}, ${site.role}`,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `${site.name}, ${site.role}`,
    description: site.description,
  },
};

// The page opens on the dark hero whatever the visitor's system theme is.
export const viewport: Viewport = { themeColor: "#141413" };

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: "Software Engineer",
  email: `mailto:${site.email}`,
  sameAs: [site.github, site.linkedin],
  worksFor: { "@type": "Organization", name: "Nisatech" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Sharif University of Technology" },
  address: { "@type": "PostalAddress", addressLocality: "Tehran", addressCountry: "IR" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks that scripts run, so the hero only waits for its intro when something can play it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
