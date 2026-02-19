import "./globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-mono",
});

const siteUrl = "https://nabaraj-bhandari.com.np";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nabaraj Bhandari — Full Stack Web Developer",
    template: "%s | Nabaraj Bhandari",
  },
  description:
    "Portfolio of Nabaraj Bhandari, a Full Stack Web Developer and 2nd-year Computer Engineering student at IOE Pulchowk Campus. Specialising in React, Next.js, TypeScript, and Node.js.",
  keywords: [
    "Nabaraj Bhandari",
    "Full Stack Developer",
    "Web Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "IOE Pulchowk",
    "Nepal developer",
    "portfolio",
  ],
  authors: [{ name: "Nabaraj Bhandari", url: siteUrl }],
  creator: "Nabaraj Bhandari",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Nabaraj Bhandari",
    title: "Nabaraj Bhandari — Full Stack Web Developer",
    description:
      "Full Stack Web Developer and Computer Engineering student building clean, fast web applications.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nabaraj Bhandari",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nabaraj Bhandari — Full Stack Web Developer",
    description:
      "Full Stack Web Developer and Computer Engineering student building clean, fast web applications.",
    images: ["/og-image.png"],
    creator: "@nabaraj",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: { canonical: siteUrl },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={jetbrains.className}>{children}</body>
    </html>
  );
}
