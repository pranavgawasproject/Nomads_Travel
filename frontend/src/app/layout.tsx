import type { Metadata } from "next";
import { Inter, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

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

export const metadata: Metadata = {
  title: "RoamIQ — The Operating System for Digital Nomads",
  description:
    "The all-in-one platform for digital nomads: AI-powered visa intelligence, remote job board, global city listings, workation planning, and community. Built for the 35M remote workers living their best location-independent life.",
  keywords: [
    "digital nomad",
    "remote work",
    "visa",
    "workation",
    "remote jobs",
    "nomad visa",
    "travel",
    "work abroad",
    "location independent",
    "digital nomad tools",
  ],
  authors: [{ name: "RoamIQ" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "RoamIQ — The Operating System for Digital Nomads",
    description:
      "The all-in-one platform for digital nomads: AI-powered visa intelligence, remote job board, global city listings, workation planning, and community.",
    siteName: "RoamIQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoamIQ — The Operating System for Digital Nomads",
    description:
      "The all-in-one platform for digital nomads: AI-powered visa intelligence, remote job board, global city listings, workation planning, and community.",
  },
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
