import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ReactQueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import siteMetadata from "../utils/siteMetaData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: siteMetadata.title,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
  },
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION_TOKEN || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <ReactQueryProvider>
          {children}
          <Toaster position="bottom-right" theme="light" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
