import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Evently — Discover & Create Unforgettable Events",
    template: "%s | Evently",
  },
  description:
    "Discover and create unforgettable events. From intimate gatherings to grand conferences, manage everything in one place.",
  keywords: ["events", "event management", "tickets", "RSVP", "conferences"],
  authors: [{ name: "Evently" }],
  openGraph: {
    title: "Evently — Discover & Create Unforgettable Events",
    description:
      "Discover and create unforgettable events. From intimate gatherings to grand conferences, manage everything in one place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
