import { Globe2, CheckCircle2, XCircle } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { supabase, type VisaInfo } from "@/lib/supabase";

export const revalidate = 300;

async function getVisaInfo(search?: string) {
  let query = supabase.from("visa_info").select("*").order("country");
  if (search) {
    query = query.ilike("country", `%${search}%`);
  }
  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data as VisaInfo[];
}

export default async function VisaPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const countries = await getVisaInfo(params.search);
  const withDnVisa = countries.filter((c) => c.has_dn_visa).length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <section className="border-b border-border bg-secondary/40 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              Visa intelligence
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Know before you fly.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Tourist stay limits and digital nomad visa options for{" "}
              {countries.length} countries — {withDnVisa} of them now offer a
              dedicated nomad visa.
            </p>

            <form className="mt-8 flex gap-3" action="/visa">
              <input
                type="text"
                name="search"
                defaultValue={params.search ?? ""}
                placeholder="Search a country…"
                className="w-full max-w-sm rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {countries.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border py-20 text-center">
                <Globe2 className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No countries match that search.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-border bg-card">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-4 font-medium">Country</th>
                      <th className="px-5 py-4 font-medium">Tourist stay</th>
                      <th className="px-5 py-4 font-medium">Nomad visa</th>
                      <th className="px-5 py-4 font-medium">Cost</th>
                      <th className="px-5 py-4 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {countries.map((c) => (
                      <tr key={c.id} className="transition-colors hover:bg-secondary/30">
                        <td className="px-5 py-4 font-serif text-base font-semibold">
                          {c.flag} {c.country}
                        </td>
                        <td className="px-5 py-4 text-foreground/80">
                          {c.tourist_days} days
                        </td>
                        <td className="px-5 py-4">
                          {c.has_dn_visa ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-2.5 py-1 text-xs font-semibold text-forest">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                              <XCircle className="h-3.5 w-3.5" /> Not offered
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-foreground/80">
                          {c.has_dn_visa ? c.dn_visa_cost : "—"}
                        </td>
                        <td className="px-5 py-4 text-foreground/80">
                          {c.has_dn_visa ? c.dn_visa_duration : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
