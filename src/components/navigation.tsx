import Link from "next/link"
import { Button } from "~/components/ui/button"

export function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <Link href="/" className="text-2xl font-bold text-foreground">
        Trademarktopia™
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-foreground hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/services" className="text-foreground hover:text-primary transition-colors">
          Services
        </Link>
        <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
          Contact
        </Link>
      </div>

      <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href="/contact">Book Free Consultation Now</Link>
      </Button>
    </nav>
  )
}
