import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Features } from "@/components/site/features";
import { Destinations } from "@/components/site/destinations";
import { Comparison } from "@/components/site/comparison";
import { WhyRoamIQ } from "@/components/site/why-roamiq";
import { Roadmap } from "@/components/site/roadmap";
import { Testimonials } from "@/components/site/testimonials";
import { CTA } from "@/components/site/cta";
import { Footer } from "@/components/site/footer";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <Destinations />
        <Comparison />
        <WhyRoamIQ />
        <Roadmap />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
