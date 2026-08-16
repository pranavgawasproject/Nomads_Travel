import type { Metadata } from "next";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const metadata: Metadata = {
  title: "Nomad Community & Discussions — Meetups, Forum & Q&A | RoamIQ",
  description:
    "Join the RoamIQ digital nomad community. Connect with remote workers, join local meetups, ask tax/visa questions, and share city advice.",
  alternates: {
    canonical: `${BASE_URL}/community`,
  },
  openGraph: {
    title: "Nomad Community & Discussions | RoamIQ",
    description:
      "Connect with remote workers, join local meetups, ask tax/visa questions, and share city advice on RoamIQ.",
    url: `${BASE_URL}/community`,
    siteName: "RoamIQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nomad Community & Discussions | RoamIQ",
    description:
      "Connect with remote workers, join local meetups, ask tax/visa questions, and share city advice on RoamIQ.",
  },
  other: {
    founder: "Pranav Gawas",
    ceo: "Pranav Gawas",
    cto: "RoamIQ Tech Leadership",
    "organization:ceo": "Pranav Gawas",
    "organization:cto": "RoamIQ Tech Leadership",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Community",
      item: `${BASE_URL}/community`,
    },
  ],
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      {children}
    </>
  );
}
