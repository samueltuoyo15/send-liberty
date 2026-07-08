"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { useMe } from "@/hooks/useAuth";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: user, isLoading } = useMe();
  const [apiUrl, setApiUrl] = useState("https://api.sendliberty.com");
  const [activeTab, setActiveTab] = useState<"curl" | "js" | "python" | "go" | "rust" | "php" | "net" | "java">("curl");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    if (typeof window !== "undefined") {
      setApiUrl(window.location.origin);
    }
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SEO title="Bypass SMTP Restrictions" description="Bypass SMTP blocks on Railway, Render and other restricted hosting clouds. Send emails via Google OAuth2 with zero DNS configuration.">
      <div className="flex flex-col min-h-screen bg-background-sendliberty text-on-background font-body-md">
      {/* TopNavBar */}
      <header 
        className={`w-full fixed top-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? "border-outline-variant shadow-sm" : "border-transparent"
        }`}
        style={{ 
          backgroundColor: isScrolled ? 'rgba(247, 249, 251, 0.75)' : 'transparent', 
          backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)', 
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)' 
        }}
      >
        <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-md max-w-7xl mx-auto">
          <Link 
            href="/" 
            className={`font-headline-md text-headline-md font-bold transition-colors duration-300 ${
              isScrolled ? "text-primary-sendliberty" : "text-white"
            }`}
          >
            SendLiberty
          </Link>
          <div className="hidden md:flex items-center gap-xl">
            <Link 
              href="#features" 
              className={`font-body-md text-body-md transition-colors duration-300 ${
                isScrolled ? "text-secondary hover:text-primary-sendliberty" : "text-white/80 hover:text-white"
              }`}
            >
              Features
            </Link>
            <Link 
              href="/docs" 
              className={`font-body-md text-body-md transition-colors duration-300 ${
                isScrolled ? "text-secondary hover:text-primary-sendliberty" : "text-white/80 hover:text-white"
              }`}
            >
              API Docs
            </Link>
          </div>
          <div className="flex items-center gap-md">
            {!isLoading && user ? (
              <Link 
                href="/dashboard" 
                className={`px-lg py-sm rounded-xl font-label-sm text-label-sm transition-all duration-300 active:scale-95 inline-block ${
                  isScrolled 
                    ? "bg-primary-sendliberty text-white hover:bg-primary-sendliberty/90" 
                    : "bg-white text-primary-sendliberty hover:bg-white/90"
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`hidden sm:block font-label-sm text-label-sm transition-all duration-300 active:scale-95 px-lg py-sm ${
                    isScrolled ? "text-primary-sendliberty" : "text-white/80 hover:text-white"
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/login" 
                  className={`px-lg py-sm rounded-xl font-label-sm text-label-sm transition-all duration-300 active:scale-95 inline-block ${
                    isScrolled 
                      ? "bg-primary-sendliberty text-white hover:bg-primary-sendliberty/90" 
                      : "bg-white text-primary-sendliberty hover:bg-white/90"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="w-full relative"
          style={{
            backgroundImage: "linear-gradient(rgba(29, 43, 62, 0.7), rgba(29, 43, 62, 0.45)), url('/forest_background/forest-background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-xl md:pt-40 md:pb-32 grid md:grid-cols-2 gap-xl items-center">
          <div className="space-y-lg">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white">
              Bypass SMTP Restrictions
            </h1>
            <p className="font-body-lg text-body-lg max-w-[500px] text-white/90 leading-relaxed">
              Send emails with just your gmail account from any hosting environment, even where port 25, 465, or 587 are strictly blocked. No more server configuration headaches.
            </p>
            <div className="flex flex-col sm:flex-row gap-md pt-md">
              <Link href="/login" className="bg-primary-sendliberty hover:bg-primary-sendliberty/90 text-white px-xl py-lg rounded-xl font-label-sm text-label-sm transition-transform active:scale-95 shadow-sm text-center w-full sm:w-auto inline-block">
                Get Started Free
              </Link>
              <Link href="/docs" className="border border-white text-white px-xl py-lg rounded-xl font-label-sm text-label-sm transition-transform active:scale-95 hover:bg-white/10 text-center w-full sm:w-auto inline-block">
                Read Documentation
              </Link>
            </div>
          </div>
          <div className="bg-primary-sendliberty text-primary-fixed rounded-xl p-lg font-mono border border-outline-variant hover:border-primary-sendliberty transition-colors overflow-hidden shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-md border-b border-[#2d3b4e] pb-3">
              <div className="flex gap-xs">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex rounded-lg bg-[#16202e] border border-[#2d3b4e] p-1 text-[11px] overflow-x-auto max-w-full gap-1 custom-scrollbar">
                {(["curl", "js", "python", "go", "rust", "php", "net", "java"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === tab ? "bg-indigo-600/30 text-indigo-400 border border-indigo-500/20" : "text-white/40 hover:text-white/80"
                    }`}
                  >
                    {tab === "curl"
                      ? "cURL"
                      : tab === "js"
                      ? "JavaScript"
                      : tab === "python"
                      ? "Python"
                      : tab === "go"
                      ? "Go"
                      : tab === "rust"
                      ? "Rust"
                      : tab === "php"
                      ? "PHP"
                      : tab === "net"
                      ? ".NET"
                      : "Java"}
                  </button>
                ))}
              </div>
            </div>
            <pre className="text-sm overflow-auto max-h-[360px] leading-relaxed text-[#c0caf5] p-md custom-scrollbar">
              {activeTab === "curl" && (
                `curl -X POST ${apiUrl}/api/send \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "sender@gmail.com",
    "to": "user@example.com",
    "subject": "Hello via Webhook!",
    "html": "<p>No SMTP needed.</p>",
    "replyTo": "support@yourdomain.com",
    "cc": "anotheruser@example.com",
    "bcc": ["audit@example.com"],
    "attachments": [
      { "filename": "invoice.pdf", "content": "base64..." }
    ]
  }'`
              )}
              {activeTab === "js" && (
                `await fetch('${apiUrl}/api/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'sender@gmail.com',
    to: 'user@example.com',
    subject: 'Hello via Webhook!',
    html: '<p>No SMTP needed.</p>',
    replyTo: 'support@yourdomain.com',
    cc: 'anotheruser@example.com',
    bcc: ['audit@example.com'],
    attachments: [
      { filename: 'invoice.pdf', content: 'base64...' }
    ]
  })
});`
              )}
              {activeTab === "python" && (
                `import requests

url = "${apiUrl}/api/send"
headers = {
  "Authorization": "Bearer YOUR_KEY",
  "Content-Type": "application/json"
}
payload = {
  "from": "sender@gmail.com",
  "to": "user@example.com",
  "subject": "Hello via Webhook!",
  "html": "<p>No SMTP needed.</p>",
  "replyTo": "support@yourdomain.com",
  "cc": "anotheruser@example.com",
  "bcc": ["audit@example.com"],
  "attachments": [
    { "filename": "invoice.pdf", "content": "base64..." }
  ]
}

res = requests.post(url, json=payload, headers=headers)`
              )}
              {activeTab === "go" && (
                `package main

import (
  "bytes"
  "encoding/json"
  "net/http"
)

func main() {
  payload, _ := json.Marshal(map[string]interface{}{
    "from":    "sender@gmail.com",
    "to":      "user@example.com",
    "subject": "Hello via Webhook!",
    "html":    "<p>No SMTP needed.</p>",
    "replyTo": "support@yourdomain.com",
    "cc":      "anotheruser@example.com",
    "bcc":     []string{"audit@example.com"},
    "attachments": []map[string]string{
      {"filename": "invoice.pdf", "content": "base64..."},
    },
  })
  req, _ := http.NewRequest("POST", "${apiUrl}/api/send", bytes.NewBuffer(payload))
  req.Header.Set("Authorization", "Bearer YOUR_KEY")
  req.Header.Set("Content-Type", "application/json")
  
  http.DefaultClient.Do(req)
}`
              )}
              {activeTab === "rust" && (
                `use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
  let client = reqwest::Client::new();
  let payload = json!({
    "from": "sender@gmail.com",
    "to": "user@example.com",
    "subject": "Hello via Webhook!",
    "html": "<p>No SMTP needed.</p>",
    "replyTo": "support@yourdomain.com",
    "cc": "anotheruser@example.com",
    "bcc": ["audit@example.com"],
    "attachments": [
      { "filename": "invoice.pdf", "content": "base64..." }
    ]
  });
  
  client.post("${apiUrl}/api/send")
    .header("Authorization", "Bearer YOUR_KEY")
    .json(&payload)
    .send()
    .await?;
    
  Ok(())
}`
              )}
              {activeTab === "php" && (
                `<?php
$ch = curl_init('${apiUrl}/api/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Authorization: Bearer YOUR_KEY',
  'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'from' => 'sender@gmail.com',
  'to' => 'user@example.com',
  'subject' => 'Hello via Webhook!',
  'html' => '<p>No SMTP needed.</p>',
  'replyTo' => 'support@yourdomain.com',
  'cc' => 'anotheruser@example.com',
  'bcc' => ['audit@example.com'],
  'attachments' => [
    ['filename' => 'invoice.pdf', 'content' => 'base64...']
  ]
]));

curl_exec($ch);`
              )}
              {activeTab === "net" && (
                `var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_KEY");

var payload = new {
  from = "sender@gmail.com",
  to = "user@example.com",
  subject = "Hello via Webhook!",
  html = "<p>No SMTP needed.</p>",
  replyTo = "support@yourdomain.com",
  cc = "anotheruser@example.com",
  bcc = new[] { "audit@example.com" },
  attachments = new[] { new { filename = "invoice.pdf", content = "base64..." } }
};`
              )}
              {activeTab === "java" && (
                `var client = HttpClient.newHttpClient();
var payload = """
    {
      "from": "sender@gmail.com",
      "to": "user@example.com",
      "subject": "Hello via Webhook!",
      "html": "<p>No SMTP needed.</p>",
      "replyTo": "support@yourdomain.com",
      "cc": "anotheruser@example.com",
      "bcc": ["audit@example.com"],
      "attachments": [
        { "filename": "invoice.pdf", "content": "base64..." }
      ]
    }
    """;

var req = HttpRequest.newBuilder()
  .uri(URI.create("${apiUrl}/api/send"))
  .header("Authorization", "Bearer YOUR_KEY")
  .header("Content-Type", "application/json")
  .POST(HttpRequest.BodyPublishers.ofString(payload))
  .build();`
              )}
            </pre>
          </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-xl md:py-32 bg-surface">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center max-w-[640px] mx-auto mb-16 space-y-md">
              <h2 className="font-headline-lg text-headline-lg text-primary-sendliberty">Features</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Everything you need to deliver mission-critical emails without blocked SMTP ports, domain verifications, or complex DNS configurations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
              {/* Large Feature Card */}
              <div className="md:col-span-2 border border-[#d8cbf9] p-xl rounded-2xl bg-[#eae3fc] transition-all hover:bg-[#eae3fc]/90 duration-300">
                <span className="material-symbols-outlined text-[#6324f5] text-4xl mb-md">webhook</span>
                <h3 className="font-headline-md text-headline-md mb-sm text-[#2e1065]">Bypass Blocked Ports</h3>
                <p className="font-body-md text-body-md text-[#4c2d96] leading-relaxed">
                  Railway, Render, and most free cloud hosts block outbound SMTP ports. SendLiberty relays through your connected Google account, no SMTP port required. Emails land in the inbox, not spam.
                </p>
              </div>
              {/* Regular Card */}
              <div className="border border-[#b0e8e0] p-xl rounded-2xl bg-[#cbf1ec] transition-all hover:bg-[#cbf1ec]/90 duration-300">
                <span className="material-symbols-outlined text-[#0d9488] text-4xl mb-md">dns</span>
                <h3 className="font-label-sm text-label-sm uppercase tracking-widest mb-sm text-[#064e45]">Zero DNS Setup</h3>
                <p className="font-body-md text-body-md text-[#0f685c] leading-relaxed">No domain needed, no MX records, SPF, or DKIM to configure. Connect your Google account and start sending immediately.</p>
              </div>
              {/* Regular Card */}
              <div className="border border-[#fbb3d3] p-xl rounded-2xl bg-[#fec8e1] transition-all hover:bg-[#fec8e1]/90 duration-300">
                <span className="material-symbols-outlined text-[#ec4899] text-4xl mb-md">api</span>
                <h3 className="font-label-sm text-label-sm uppercase tracking-widest mb-sm text-[#6d0935]">Simple API</h3>
                <p className="font-body-md text-body-md text-[#9d1b54] leading-relaxed">One POST request. No SDK to install. Works from any language or framework.</p>
              </div>
              {/* Image Integration Card */}
              <div className="md:col-span-2 relative h-64 md:h-auto overflow-hidden rounded-2xl border border-[#c5c6cd] group">
                <div
                  className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnw8bH2IFtHCVDRA6W-KwT6_yuapqxq9Dc97vtn-iJac5CTLw9dPDHcRu-5rGIcqfkqcG9kZsR0ui6aZV4GPjium0pjFKhCCzgJnrHCY1JBsU0KWK8f3utSiHlBty52P3FWaXi8e3FYsZBI_WfVBvj5BbliJ0lVWtMWAouYmTYqW_CwC22uivzomECi45BkZGRJ0QBZuS8wKAMaYlguwol9vNRnJeQJoEMYxIioLFOkir5mIaqKpwxLFGh-wAJBdMIuQiE0j2zBKM')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="absolute inset-0 bg-black/45 z-10"></div>
                <div className="relative z-20 p-xl h-full flex flex-col justify-end text-white">
                  <h3 className="font-headline-md text-headline-md font-bold text-white">Inbox Delivery</h3>
                  <p className="font-body-md text-body-md opacity-90 text-white">Because emails are sent from your own Google account, they land in the inbox, not the spam folder.</p>
                </div>
              </div>
              {/* OAuth2 Card */}
              <div className="md:col-span-2 border border-[#bfd7fa] p-xl rounded-2xl flex items-center gap-xl bg-[#d7e6fc] transition-all hover:bg-[#d7e6fc]/90 duration-300">
                <div className="hidden sm:block">
                  <span className="material-symbols-outlined text-[#3b82f6] text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    security
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md mb-sm text-[#1e3a8a]">OAuth2 Secured</h3>
                  <p className="font-body-md text-body-md text-[#1d4ed8] leading-relaxed">
                    We connect to your Google account via OAuth2. We never see or store your password, only an encrypted access token you can revoke at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-primary-sendliberty py-xl md:py-32 mt-xl">
          <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <h2 className="font-headline-lg text-headline-lg text-white mb-lg">Stop fighting your hosting provider.</h2>
            <p className="font-body-lg text-body-lg text-white/80 mb-xl max-w-2xl mx-auto">
              Join a couple of developers who have simplified their email delivery pipeline. Start sending in seconds.
            </p>
            <Link href="/login" className="bg-white text-primary-sendliberty hover:bg-gray-100 px-xl py-lg rounded-xl font-label-sm text-label-sm transition-transform active:scale-95 shadow-sm inline-block">
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-surface-container border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-xl gap-md max-w-7xl mx-auto">
          <div className="flex flex-col gap-xs text-center md:text-left">
            <div className="font-headline-md text-headline-md font-bold text-primary-sendliberty">SendLiberty</div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">© {new Date().getFullYear()} SendLiberty. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-md">
            <Link href="#docs" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-sendliberty transition-colors underline">
              Documentation
            </Link>
            <Link href="/privacy-policy" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-sendliberty transition-colors underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-sendliberty transition-colors underline">
              Terms of Service
            </Link>
            <Link href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-sendliberty transition-colors underline">
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
    </SEO>
  );
}
