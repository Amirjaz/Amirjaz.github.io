import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import { site } from "@/content/site";

// Fades `.reveal` blocks in as they scroll into view. Inline, so it runs before React loads.
const revealScript = `(function(){var els=document.querySelectorAll('.reveal');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-visible')});return}var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('is-visible');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0.08});els.forEach(function(e){io.observe(e)})})();`;

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#141413" },
  ],
};

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
        {/* Lets the scroll-entry styles apply only when JavaScript runs. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </body>
    </html>
  );
}
