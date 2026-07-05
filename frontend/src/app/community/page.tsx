import { Users2, MapPin, Calendar, MessageSquare, Heart, Pin } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { supabase, type Meetup, type ForumPost } from "@/lib/supabase";

export const revalidate = 120;

async function getCommunityData() {
  const [{ data: meetups }, { data: posts }] = await Promise.all([
    supabase.from("meetups").select("*").order("date").limit(9),
    supabase
      .from("forum_posts")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(9),
  ]);
  return {
    meetups: (meetups ?? []) as Meetup[],
    posts: (posts ?? []) as ForumPost[],
  };
}

export default async function CommunityPage() {
  const { meetups, posts } = await getCommunityData();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <section className="border-b border-border bg-secondary/40 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              Nomad community
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Meetups and conversations happening right now.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Browsing is open to everyone. Sign in (coming soon) to RSVP,
              post, and reply.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              Upcoming meetups
            </h2>

            {meetups.length === 0 ? (
              <EmptyState
                icon={Users2}
                message="No meetups scheduled yet — check back soon, or be the first to host one once accounts are live."
              />
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {meetups.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{m.icon}</span>
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
                        {m.type}
                      </span>
                    </div>
                    <h3 className="mt-3 font-serif text-lg font-semibold">{m.title}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {m.city} · {m.location}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> {m.date} at {m.time}
                    </div>
                    <div className="mt-4 border-t border-border pt-3 text-sm text-foreground/80">
                      {m.attendees} / {m.max_attendees} attending
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-border py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              Latest from the forum
            </h2>

            {posts.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                message="No forum posts yet. Once sign-in ships, this is where nomad Q&A and trip reports will live."
              />
            ) : (
              <div className="mt-6 space-y-4">
                {posts.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2">
                      {p.pinned && <Pin className="h-3.5 w-3.5 text-accent" />}
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
                        {p.category}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                      {p.content}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" /> {p.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" /> {p.reply_count} replies
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: typeof Users2;
  message: string;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border py-16 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
