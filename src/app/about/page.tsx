import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="page-shell-x py-16 text-center sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="text-4xl" aria-hidden>
            🍡
          </span>
          <h1 className="font-display mt-4 text-balance text-4xl font-bold text-foreground sm:text-5xl">
            The tea on this app
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Private toy for our Japan trip—not a startup, not a product launch,
            just a nicer place than a 200-message thread to park plans.
          </p>
        </div>
      </section>

      <section className="page-shell-x pb-16 sm:pb-20">
        <div className="mx-auto max-w-2xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Why bother?</CardTitle>
              <CardDescription>
                Because nobody wants to re-find that one onsen link at 1am.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="leading-relaxed">
                We wanted a shared board with just enough structure: ideas,
                links, and a quick read on who&apos;s hyped. Auth is Google via
                Supabase so nobody has to remember Yet Another Password™.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access is kinda exclusive (on purpose)</CardTitle>
              <CardDescription>
                Trips are gated in the database—not a vibe, just safety.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="leading-relaxed">
                If you sign in and see nothing, someone needs to add you as a
                member on that trip in Supabase. Text your most responsible
                friend—or bribe them with melon pan.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/trips">Trips, please</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
