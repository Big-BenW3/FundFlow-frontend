import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "FundFlow: Programmable Fundraising",
  description:
    "Raise money. Show where it is going. Release it according to rules. Powered by Kora.",
  openGraph: {
    images: [
      {
        url: "/images/hero-community.jpg",
        width: 1920,
        height: 1080,
        alt: "FundFlow community fundraising hero",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-sans">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

