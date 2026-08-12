import type { Metadata } from "next";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const metadata: Metadata = {
  title: "Community — Nomad meetups, forums & remote-worker events | RoamIQ",
  description:
    "Join digital nomad meetups, browse the community forum, and connect with remote workers worldwide. Discover events near you and share tips on visas, cities, and workations.",
  alternates: {
    canonical: `${BASE_URL}/community`,
  },
  openGraph: {
    title: "Community — Nomad meetups, forums & remote-worker events | RoamIQ",
    description:
      "Join digital nomad meetups, browse the community forum, and connect with remote workers worldwide. Discover events and share tips on visas, cities, and workations.",
    url: `${BASE_URL}/community`,
    siteName: "RoamIQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community — Nomad meetups, forums & remote-worker events | RoamIQ",
    description:
      "Join digital nomad meetups, browse the community forum, and connect with remote workers worldwide.",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
