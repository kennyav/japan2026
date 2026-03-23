import "~/styles/globals.css";

import { type Metadata } from "next";
import { Fredoka } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import Footer from "~/components/footer";
import { Navigation } from "~/components/navigation";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Japan 2026",
  description:
    "Plan your Japan trip together—shared itineraries, ideas, and quick reactions from everyone in your group.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${fredoka.variable}`}
    >
      <body className="relative min-h-screen font-sans">
        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -left-1/4 -top-1/4 h-[min(70vh,520px)] w-[min(70vh,520px)] rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-[min(60vh,480px)] w-[min(60vh,480px)] rounded-full bg-[oklch(0.85_0.12_290)]/35 blur-3xl" />
          <div className="absolute left-1/3 top-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[oklch(0.88_0.1_200)]/25 blur-2xl" />
        </div>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
