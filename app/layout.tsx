import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ReactQueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import siteMetadata from "../utils/siteMetaData";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | SendLib`,
    default: siteMetadata.title,
  },
  description: siteMetadata.description,
  alternates: {
    canonical: siteMetadata.siteUrl,
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: "SendLib",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      </head>
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          {children}
          <Toaster position="top-right" theme="light" />
          <Analytics />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
