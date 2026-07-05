import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Comparison } from "@/components/site/comparison";
import { CTA } from "@/components/site/cta";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Explorer",
    price: "Free",
    tagline: "Everything you need to start researching your next move.",
    features: [
      "Browse all destinations & scores",
      "Visa finder for 190+ countries",
      "Browse coworking & coliving listings",
      "Read-only community access",
    ],
    highlighted: false,
  },
  {
    name: "Nomad",
    price: "$9/mo",
    tagline: "For nomads actively planning and tracking trips.",
    features: [
      "Everything in Explorer",
      "Save trips & visa-stay tracking",
      "Post & reply in the community",
      "Priority AI trip planning",
    ],
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <section className="border-b border-border bg-secondary/40 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              Pricing
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Free to explore. Simple to upgrade.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              No credit card needed to browse. Upgrade when you're ready to
              save trips and join the community.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-6 px-5 sm:px-8 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border p-8 ${
                  plan.highlighted
                    ? "border-accent bg-card shadow-xl shadow-accent/10"
                    : "border-border bg-card"
                }`}
              >
                <h2 className="font-serif text-2xl font-semibold">{plan.name}</h2>
                <div className="mt-2 font-serif text-4xl font-semibold text-forest">
                  {plan.price}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{plan.tagline}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest/15 text-forest">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <Comparison />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
