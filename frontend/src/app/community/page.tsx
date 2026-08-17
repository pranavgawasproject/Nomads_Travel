import type { Metadata } from "next";
import { CommunityClient } from "./community-client";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const metadata: Metadata = {
  title: "Nomad Community — Meetups, Forum & Co-working Events | RoamIQ",
  description:
    "Connect with remote workers, digital nomads, and global tech workers. Join city meetups, ask visa/tax questions, and share workspace advice worldwide.",
  alternates: {
    canonical: `${BASE_URL}/community`,
  },
  openGraph: {
    title: "Nomad Community — Meetups, Forum & Co-working Events | RoamIQ",
    description:
      "Connect with remote workers, digital nomads, and global tech workers. Join city meetups, ask visa/tax questions, and share workspace advice.",
    url: `${BASE_URL}/community`,
    siteName: "RoamIQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nomad Community — Meetups, Forum & Co-working Events | RoamIQ",
    description:
      "Connect with remote workers and digital nomads. Join city meetups, ask visa/tax questions, and share workspace advice.",
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
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Community", item: `${BASE_URL}/community` },
  ],
};

const communityHubJsonLd = {
  "@type": "DiscussionForumPosting",
  headline: "RoamIQ Global Nomad Community & Meetups Hub",
  url: `${BASE_URL}/community`,
  author: {
    "@type": "Organization",
    name: "RoamIQ Community",
    url: BASE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "RoamIQ",
    url: BASE_URL,
    founder: {
      "@type": "Person",
      name: "Pranav Gawas",
      jobTitle: "Founder & CEO",
    },
  },
};

const faqJsonLd = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can I find digital nomad meetups in my city on RoamIQ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Browse the Meetups tab on RoamIQ Community to find upcoming coworking Fridays, coffee meetups, walking tours, and tax workshops in cities like Bangkok, Lisbon, Bali, Berlin, and Medellín.",
      },
    },
    {
      "@type": "Question",
      name: "Can I post visa, tax, or workspace questions on the RoamIQ Forum?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the RoamIQ Nomad Forum allows remote workers and nomads to discuss digital nomad visas, tax residency rules, coworking Wi-Fi recommendations, and housing tips globally.",
      },
    },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [breadcrumbJsonLd, communityHubJsonLd, faqJsonLd],
};

export default function CommunityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CommunityClient />
    </>
  );
}
