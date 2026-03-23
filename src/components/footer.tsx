import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-primary/10 bg-secondary/40 page-shell-x py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-display text-lg font-bold text-foreground">
              Japan 2026
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Our little corner of the internet for ramen dreams, train passes,
              and &ldquo;are we doing this?&rdquo; votes. 🍜
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-foreground">
              Trip stuff
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/trips"
                  className="transition-colors hover:text-primary"
                >
                  All trips
                </Link>
              </li>
              <li>
                <Link
                  href="/trips/new"
                  className="transition-colors hover:text-primary"
                >
                  Start something new
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="transition-colors hover:text-primary"
                >
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-foreground">
              Elsewhere
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacyPolicy"
                  className="transition-colors hover:text-primary"
                >
                  Privacy (the boring page)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-foreground">
              Your account
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Google sign-in keeps it simple—no new password to forget.
            </p>
            <Link
              href="/login"
              className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
            >
              Hop in →
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-primary/10 pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>Made for friends & family on this adventure · 2026 here we come</p>
          <p className="font-display font-semibold text-primary/80">✌️</p>
        </div>
      </div>
    </footer>
  );
}
