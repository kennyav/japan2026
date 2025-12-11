import "~/styles/globals.css";

import { type Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import Footer from "~/components/footer";
import { Navigation } from "~/components/navigation";

export const metadata: Metadata = {
  title: "Trademarktopia™",
  description: "Trademark Protection Made Simple",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
