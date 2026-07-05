import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Features } from "@/components/site/features";
import { DestinationsPreview } from "@/components/site/destinations-preview";
import { WhyRoamIQ } from "@/components/site/why-roamiq";
import { Testimonials } from "@/components/site/testimonials";
import { CTA } from "@/components/site/cta";
import { Footer } from "@/components/site/footer";

export const revalidate = 300;

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <DestinationsPreview />
        <WhyRoamIQ />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
