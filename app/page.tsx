import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "SendLib - Bypass SMTP Restrictions & Transactional Email API",
  description: "Bypass SMTP blocks on Railway, Render, and restricted hosting clouds. Send transactional emails via Google OAuth2 with zero DNS configuration.",
  alternates: {
    canonical: "https://sendlib.samueltuoyo.com",
  },
  openGraph: {
    title: "SendLib - Bypass SMTP Restrictions & Transactional Email API",
    description: "Bypass SMTP blocks on Railway, Render, and restricted hosting clouds. Send transactional emails via Google OAuth2 with zero DNS configuration.",
    url: "https://sendlib.samueltuoyo.com",
    siteName: "SendLib",
    type: "website",
  },
};

export default function Home() {
  return <HomeClient />;
}
