"use client";

import Link from "next/link";

import { AuthNavLinks } from "~/components/travel/auth-nav-links";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const navLink =
  "rounded-full px-3 py-1.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-secondary hover:text-foreground";

export function Navigation() {
  return (
    <nav className="page-gutter-x sticky top-0 z-50 border-b border-primary/10 bg-card/70 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-card/55">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-3">
        <Link
          href="/"
          className="font-display flex items-center gap-2 text-xl font-bold tracking-tight text-foreground md:text-2xl"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-lg text-primary-foreground shadow-md shadow-primary/30"
            aria-hidden
          >
            🗾
          </span>
          <span>Japan 2026</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link href="/" className={navLink}>
            Home
          </Link>
          <Link href="/services" className={navLink}>
            How it works
          </Link>
          <Link href="/about" className={navLink}>
            About
          </Link>
          <Link
            href="/trips"
            className={cn(navLink, "font-semibold text-primary")}
          >
            Trips
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <AuthNavLinks />
          <Button
            asChild
            size="sm"
            className="hidden shadow-md sm:inline-flex"
          >
            <Link href="/trips">Let&apos;s go ✈️</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
