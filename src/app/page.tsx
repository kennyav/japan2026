import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Calendar, ListChecks, MapPin, Sparkles, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="page-shell-x py-16 text-center sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="font-display mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Squad trip planning, but make it cute
          </p>
          <h1 className="font-display text-balance text-4xl font-bold leading-tight text-foreground sm:text-6xl md:text-7xl">
            Japan 2026
            <span className="mt-2 block bg-gradient-to-r from-primary via-[oklch(0.55_0.2_320)] to-[oklch(0.55_0.18_200)] bg-clip-text text-transparent">
              let&apos;s figure it out together
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Dump your wildest ideas, ramen stops, and &ldquo;maybe we should
            sleep&rdquo; hotels in one place—then tap if you&apos;re in, booked,
            or bowing out so nobody has to @ everyone twice.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg">
              <Link href="/login">Sign in &amp; peek the trips</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">Wait, how does this work?</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="page-shell-x py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Four things we actually use
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              Less scrolling the group chat for that one Google Maps link from
              Tuesday.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: MapPin,
                title: "Trips as buckets",
                body: "Name it, date it-ish, and you’ve got a home for that leg of the adventure.",
                tilt: "-rotate-1",
              },
              {
                icon: ListChecks,
                title: "Idea pile",
                body: "Activities, beds, trains, snacks—stack it all with links so we’re not hunting DMs.",
                tilt: "rotate-1",
              },
              {
                icon: Users,
                title: "Vibe check",
                body: "Interested / booked / nah—counts show what the group actually wants.",
                tilt: "-rotate-1",
              },
              {
                icon: Calendar,
                title: "Google = easy",
                body: "Sign in once. No new password living rent-free in your brain.",
                tilt: "rotate-1",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
              <Card
                key={item.title}
                className={`text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg ${item.tilt} hover:rotate-0`}
              >
                <CardContent className="pt-8">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary text-primary">
                    <Icon className="h-7 w-7" strokeWidth={2.25} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </CardContent>
              </Card>
            );
            })}
          </div>
        </div>
      </section>

      <section className="page-shell-x pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-secondary/80 via-accent/50 to-primary/15 px-5 py-14 text-center sm:px-10 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Your turn—add something weird &amp; wonderful
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Sign in, open Trips, and throw your best ideas on the board. Worst
            case we laugh and pass.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/trips">Take me to trips</Link>
          </Button>
        </div>
        </div>
      </section>
    </div>
  );
}
