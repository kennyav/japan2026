import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  CheckCircle,
  Compass,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <section className="page-shell-x py-16 text-center sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-display mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1 text-sm font-semibold text-secondary-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            The unofficial manual
          </p>
          <h1 className="font-display text-balance text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
            So… what does this thing even do?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            TL;DR: one shared scratchpad for Japan 2026 ideas, plus quick
            reactions so we know who&apos;s actually in—without polling the
            group chat for the fifth time.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/login">Cool, let me in</Link>
          </Button>
        </div>
      </section>

      <section className="page-shell-x py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-stretch gap-8 lg:grid-cols-3">
            <Card className="flex h-full flex-col transition-transform hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="pb-3 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-secondary text-primary">
                  <Compass className="h-8 w-8" strokeWidth={2.25} />
                </div>
                <CardTitle className="font-display text-2xl">Trips</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col space-y-5">
                <p className="leading-relaxed text-muted-foreground">
                  Think of a trip as a folder: name, rough dates, maybe a city.
                  Everything for that chunk of travel lives inside.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    Bounce between trips if we&apos;re plotting more than one leg
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    Skim destination + dates without opening a spreadsheet
                  </li>
                </ul>
                <Button asChild className="mt-auto w-full">
                  <Link href="/trips">Peek at trips</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col transition-transform hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="pb-3 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-secondary text-primary">
                  <Sparkles className="h-8 w-8" strokeWidth={2.25} />
                </div>
                <CardTitle className="font-display text-2xl">Ideas</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col space-y-5">
                <p className="leading-relaxed text-muted-foreground">
                  Stack hotels, day trips, food crawls, transit—whatever. Notes
                  and links keep the chaos slightly organized.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    Tag the flavor: activity, stay, train, food, misc
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    Drop maps &amp; booking links for the chronically lost (us)
                  </li>
                </ul>
                <Button asChild className="mt-auto w-full">
                  <Link href="/trips/new">Start a trip</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col transition-transform hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="pb-3 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-secondary text-primary">
                  <Users className="h-8 w-8" strokeWidth={2.25} />
                </div>
                <CardTitle className="font-display text-2xl">Reactions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col space-y-5">
                <p className="leading-relaxed text-muted-foreground">
                  Three buttons, zero drama: into it, actually booked, or passing.
                  Counts update for everyone in real time-ish.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    Flip-flop friendly—change your vote whenever
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    &ldquo;Locked in&rdquo; when someone really books it
                  </li>
                </ul>
                <Button asChild className="mt-auto w-full">
                  <Link href="/login">Sign in to vote</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="page-shell-x pb-8 sm:pb-12">
        <div className="mx-auto max-w-4xl rounded-3xl bg-secondary/50 px-5 py-12 text-center sm:px-10 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="font-display text-3xl font-bold text-foreground">
            We still love the group chat
          </h2>
          <p className="mt-3 text-muted-foreground">
            This isn&apos;t replacing memes and voice notes—it&apos;s where we
            park the actual options so they don&apos;t vanish at 2am.
          </p>
        </div>
        </div>
      </section>

      <section className="page-shell-x py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Who&apos;s allowed?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Folks added to a trip in Supabase can sign in with Google. If
            you&apos;re locked out, bug whoever runs the database—or bring
            snacks until they add you.
          </p>
          <Button asChild size="lg" variant="outline" className="mt-8">
            <Link href="/about">More backstory</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
