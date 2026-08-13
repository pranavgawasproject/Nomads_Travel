import type { Metadata } from "next";
import { Inter, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "RoamIQ | #1 Digital Nomad & Remote Work Travel Operating System",
  description:
    "RoamIQ (Roam IQ) is the all-in-one digital nomad travel tool & operating system. Explore AI visa intelligence, 1,000+ remote job listings, cost of living data, coworking spaces, and workation planning for remote workers worldwide.",
  keywords: [
    "roamiq",
    "roam iq",
    "digital nomad",
    "digital nomad travel tool",
    "digital nomad visa",
    "remote work travel",
    "workation planner",
    "cost of living for nomads",
    "remote jobs",
    "work abroad",
    "location independent tools",
  ],
  authors: [{ name: "RoamIQ" }],
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "RoamIQ | #1 Digital Nomad & Remote Work Travel Operating System",
    description:
      "RoamIQ is the premier AI-powered digital nomad operating system. Compare cost of living, check visa rules, find remote jobs, and plan workations seamlessly.",
    siteName: "RoamIQ",
    type: "website",
    url: BASE_URL,
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "RoamIQ Digital Nomad Travel Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoamIQ | #1 Digital Nomad & Remote Work Travel Operating System",
    description:
      "RoamIQ is the premier AI-powered digital nomad operating system. Compare cost of living, check visa rules, find remote jobs, and plan workations seamlessly.",
    images: ["/logo.svg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "RoamIQ",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.svg`,
      description:
        "AI-powered platform for digital nomads: visa intelligence, city cost data, workspaces, and community.",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      name: "RoamIQ",
      url: BASE_URL,
      description:
        "The operating system for digital nomads — discover cities, compare costs, find workspaces, and plan workations.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/destinations?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QBDK33Q2NZ"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag(js, new Date());
            gtag(config, G-QBDK33Q2NZ);
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
