"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMe } from "@/hooks/useAuth";
import { getCodeSnippet, CodeTab } from "@/utils/codeSnippets";

export default function HomeClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: user, isLoading } = useMe();
  const [apiUrl, setApiUrl] = useState("https://sendlib.samueltuoyo.com");
  const [activeTab, setActiveTab] = useState<CodeTab>("curl");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = () => {
    const code = getCodeSnippet(activeTab, isExpanded, apiUrl);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
    <div className="flex flex-col min-h-screen bg-background-sendlib text-on-background font-body-md">
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
              isScrolled ? "text-primary-sendlib" : "text-white"
            }`}
          >
            SendLib
          </Link>
          <div className="hidden md:flex items-center gap-xl">
            <Link 
              href="#features" 
              className={`font-body-md text-body-md transition-colors duration-300 ${
                isScrolled ? "text-secondary hover:text-primary-sendlib" : "text-white/80 hover:text-white"
              }`}
            >
              Features
            </Link>
            <Link 
              href="#about-oauth" 
              className={`font-body-md text-body-md transition-colors duration-300 ${
                isScrolled ? "text-secondary hover:text-primary-sendlib" : "text-white/80 hover:text-white"
              }`}
            >
              About
            </Link>
            <Link 
              href="/docs" 
              className={`font-body-md text-body-md transition-colors duration-300 ${
                isScrolled ? "text-secondary hover:text-primary-sendlib" : "text-white/80 hover:text-white"
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
                    ? "bg-primary-sendlib text-white hover:bg-primary-sendlib/90" 
                    : "bg-white text-primary-sendlib hover:bg-white/90"
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`hidden sm:block font-label-sm text-label-sm transition-all duration-300 active:scale-95 px-lg py-sm ${
                    isScrolled ? "text-primary-sendlib" : "text-white/80 hover:text-white"
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/login" 
                  className={`px-lg py-sm rounded-xl font-label-sm text-label-sm transition-all duration-300 active:scale-95 inline-block ${
                    isScrolled 
                      ? "bg-primary-sendlib text-white hover:bg-primary-sendlib/90" 
                      : "bg-white text-primary-sendlib hover:bg-white/90"
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
        <section className="w-full relative overflow-hidden bg-[#1d2b3e]">
          <Image
            src="/forest_background/forest-background.webp"
            alt="SendLib Hero Background"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-top md:object-center pointer-events-none opacity-85 md:opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1d2b3e]/65 via-[#1d2b3e]/25 to-transparent md:from-[#1d2b3e]/30 md:via-transparent md:to-[#1d2b3e]/50 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-xl md:pt-40 md:pb-32 grid md:grid-cols-2 gap-xl items-center relative z-10">
            <div className="space-y-lg">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white font-extrabold drop-shadow-sm">
                Zero-Config Email for Developers
              </h1>
              <p className="font-body-lg text-body-lg max-w-[500px] text-white/95 leading-relaxed drop-shadow-sm">
                Send transactional emails with just your Gmail account from any hosting environment, even where port 25, 465, or 587 are strictly blocked. No more server configuration headaches.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-md pt-md">
                {!isLoading && user ? (
                  <Link href="/dashboard" className="bg-white hover:bg-white/95 text-primary-sendlib font-bold px-xl py-lg rounded-xl font-label-sm text-label-sm transition-all active:scale-95 shadow-lg text-center inline-block">
                    Open Console
                  </Link>
                ) : (
                  <Link href="/login" className="bg-white hover:bg-white/95 text-primary-sendlib font-bold px-xl py-lg rounded-xl font-label-sm text-label-sm transition-all active:scale-95 shadow-lg text-center inline-block">
                    Get Started For Free
                  </Link>
                )}
                <Link href="/docs" className="bg-white/10 hover:bg-white/20 text-white border border-white/25 px-xl py-lg rounded-xl font-label-sm text-label-sm transition-all active:scale-95 backdrop-blur-md text-center inline-block">
                  Read Documentation
                </Link>
              </div>
            </div>
            <div className="bg-[#090a0f] text-white rounded-2xl font-mono border border-zinc-800 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col transition-all hover:border-zinc-700">
              <div className="flex justify-between items-center px-4 py-3 bg-[#12131a] border-b border-zinc-800 gap-2">
                <div className="flex items-center rounded-xl bg-[#07080c] border border-zinc-800/80 p-1 text-xs overflow-x-auto max-w-full flex-1 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {(["curl", "js", "python", "go", "rust", "php", "net", "java"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap font-sans text-[11px] font-medium ${
                        activeTab === tab 
                          ? "bg-white text-zinc-950 shadow-sm font-bold" 
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
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
                <button
                  onClick={handleCopyCode}
                  className="text-xs font-sans font-medium text-zinc-300 hover:text-white bg-[#07080c] border border-zinc-800 hover:bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {isCopied ? "✓ Copied" : "Copy Code"}
                </button>
              </div>
              <pre className="text-sm overflow-auto max-h-[360px] leading-relaxed text-zinc-200 p-6 custom-scrollbar font-mono">
                {getCodeSnippet(activeTab, isExpanded, apiUrl)}
              </pre>
              <div className="flex justify-between items-center border-t border-zinc-800 text-xs px-6 py-3 bg-[#12131a]">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer flex items-center gap-1.5 transition-colors outline-none font-sans"
                >
                  {isExpanded ? "Collapse Parameters ▲" : "Show All Parameters (CC, BCC, Attachments) ▼"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* What is SendLib Section */}
        <section id="what-is-sendlib" className="py-xl md:py-20 bg-white border-b border-outline-variant/60">
          <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop text-center space-y-md">
            <span className="px-md py-xs rounded-full bg-primary-sendlib/10 text-primary-sendlib font-label-sm text-label-sm inline-block font-bold">
              Application Purpose
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary-sendlib font-extrabold">
              What is SendLib?
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-3xl mx-auto">
              SendLib is a transactional email API for developers. It allows applications to send emails using a connected Google account through OAuth 2.0. Developers can use SendLib for verification emails, notifications, password resets, and other application emails without configuring SMTP servers or dealing with blocked cloud ports.
            </p>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-xl md:py-32 bg-surface">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center max-w-[640px] mx-auto mb-16 space-y-md">
              <h2 className="font-headline-lg text-headline-lg text-primary-sendlib">Features</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Everything you need to deliver mission-critical emails without blocked SMTP ports, domain verifications, or complex DNS configurations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
              {/* Large Feature Card */}
              <div className="md:col-span-2 border border-[#d8cbf9] p-xl rounded-2xl bg-[#eae3fc] transition-all hover:bg-[#eae3fc]/90 duration-300">
                <span className="material-symbols-outlined text-[#6324f5] text-4xl mb-md">webhook</span>
                <h3 className="font-headline-md text-headline-md mb-sm text-[#2e1065]">Send Without SMTP Restrictions</h3>
                <p className="font-body-md text-body-md text-[#4c2d96] leading-relaxed">
                  Railway, Render, and most free cloud hosts block outbound SMTP ports. SendLib relays through your connected Google account, no SMTP port required. Improve deliverability by sending through Google's trusted mail infrastructure.
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

        {/* About SendLib & Google OAuth Integration Section */}
        <section id="about-oauth" className="py-xl md:py-24 bg-surface-container border-t border-outline-variant/60">
          <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-md">
          
              <h2 className="font-headline-lg text-headline-lg text-primary-sendlib">
                About SendLib & Google OAuth Integration
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                SendLib is designed specifically to provide developers with a simple, secure transactional email API without blocked SMTP ports or DNS record requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="p-xl rounded-2xl border border-outline-variant bg-white space-y-sm">
                <div className="w-10 h-10 rounded-xl bg-primary-sendlib/10 text-primary-sendlib flex items-center justify-center font-bold text-lg mb-md">
                  1
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary-sendlib">Application Purpose & Identity</h3>
                <p className="font-body-md text-secondary leading-relaxed">
                  The application name configured on this website is <strong>SendLib</strong>. SendLib operates as an API proxy that enables developers to dispatch transactional emails (such as user verification, notifications, and magic links) via Google OAuth2 credentials.
                </p>
              </div>

              <div className="p-xl rounded-2xl border border-outline-variant bg-white space-y-sm">
                <div className="w-10 h-10 rounded-xl bg-primary-sendlib/10 text-primary-sendlib flex items-center justify-center font-bold text-lg mb-md">
                  2
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary-sendlib">Why We Request Google OAuth Access</h3>
                <p className="font-body-md text-secondary leading-relaxed">
                  SendLib requests the <code className="bg-surface-container px-2 py-0.5 rounded text-xs">gmail.send</code> permission scope. This scope allows SendLib to route outbound transactional emails requested via your SendLib API keys without SMTP port restrictions.
                </p>
              </div>

              <div className="p-xl rounded-2xl border border-outline-variant bg-white space-y-sm">
                <div className="w-10 h-10 rounded-xl bg-primary-sendlib/10 text-primary-sendlib flex items-center justify-center font-bold text-lg mb-md">
                  3
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary-sendlib">User Data Protection & Security</h3>
                <p className="font-body-md text-secondary leading-relaxed">
                  We value your privacy. SendLib never reads, views, indexes, or stores any messages from your Gmail inbox. Your Google password is never requested or stored. OAuth access tokens are encrypted using AES-256 encryption at rest, and access can be revoked at any time in your Google Account settings.
                </p>
              </div>

              <div className="p-xl rounded-2xl border border-outline-variant bg-white space-y-sm">
                <div className="w-10 h-10 rounded-xl bg-primary-sendlib/10 text-primary-sendlib flex items-center justify-center font-bold text-lg mb-md">
                  4
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary-sendlib">Google API User Data Policy Compliance</h3>
                <p className="font-body-md text-secondary leading-relaxed">
                  SendLib&apos;s use and transfer to any other app of information received from Google APIs adheres strictly to the Google API Services User Data Policy, including Limited Use requirements.
                </p>
                <div className="pt-sm flex flex-wrap gap-md text-sm">
                  <Link href="/privacy-policy" className="text-primary-sendlib font-semibold underline underline-offset-2 hover:opacity-80">
                    Privacy Policy
                  </Link>
                  <Link href="/terms-of-service" className="text-primary-sendlib font-semibold underline underline-offset-2 hover:opacity-80">
                    Terms of Service
                  </Link>
                  <a href="mailto:motionpipehq@gmail.com" className="text-primary-sendlib font-semibold underline underline-offset-2 hover:opacity-80">
                    Support Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-xl md:py-32 bg-surface-container-low border-t border-outline-variant/60">
          <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16 space-y-3">
              <h2 className="font-headline-lg text-headline-lg text-primary-sendlib">Frequently Asked Questions</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[600px] mx-auto">
                Got questions about how SendLib is different from other transactional email sending platforms? We have answers.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-outline-variant bg-white/70 hover:bg-white transition-colors duration-300">
                <h3 className="font-bold text-base text-[#1d2b3e] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Do I need to verify my domain or configure DNS records?
                </h3>
                <p className="text-sm text-secondary leading-relaxed pl-4">
                  No! Because SendLib routes your email relay requests securely through your already verified, connected Google accounts, there is absolutely zero DNS configuration required. You do not need to add SPF, DKIM, MX, or TXT records to start sending immediately.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-outline-variant bg-white/70 hover:bg-white transition-colors duration-300">
                <h3 className="font-bold text-base text-[#1d2b3e] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Can I send from my custom domain (e.g. hello@mycompany.com)?
                </h3>
                <p className="text-sm text-secondary leading-relaxed pl-4">
                  Yes! If your custom company domain is connected to Google Workspace, simply link that account to SendLib via Google OAuth. SendLib will send transactional emails directly from your custom domain (e.g. <code className="bg-surface-variant/80 px-1.5 py-0.5 rounded text-xs">hello@mycompany.com</code>) with zero extra DNS or SPF configuration required on SendLib. Plus, Google Workspace accounts get <strong>2,000 emails/day</strong> per account!
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-outline-variant bg-white/70 hover:bg-white transition-colors duration-300">
                <h3 className="font-bold text-base text-[#1d2b3e] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Will my emails land in the inbox?
                </h3>
                <p className="text-sm text-secondary leading-relaxed pl-4">
                  Yes, absolutely. Because the emails are sent using Google's official, highly trusted outbound mail servers, they inherit the absolute highest deliverability rates out of the box.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-outline-variant bg-white/70 hover:bg-white transition-colors duration-300">
                <h3 className="font-bold text-base text-[#1d2b3e] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  How does this compare to the free tier of Resend, Mailgun, or SendGrid?
                </h3>
                <p className="text-sm text-secondary leading-relaxed pl-4">
                  Other platforms limit you to only 100 free emails per day on their free plans and require strict domain verification. With SendLib, you can send up to <strong>500 emails/day</strong> per connected personal/product Gmail account, or up to <strong>2,000 emails/day</strong> per connected Google Workspace account.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-outline-variant bg-white/70 hover:bg-white transition-colors duration-300">
                <h3 className="font-bold text-base text-[#1d2b3e] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Can I send attachments and CC/BCC recipients?
                </h3>
                <p className="text-sm text-secondary leading-relaxed pl-4">
                  Yes, our REST API supports complete transactional payloads. You can specify a custom Reply-To header, carbon copies (CC), blind carbon copies (BCC), and pass an array of base64-encoded attachments.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl border border-outline-variant bg-white/70 hover:bg-white transition-colors duration-300">
                <h3 className="font-bold text-base text-[#1d2b3e] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Is my Google account password secure?
                </h3>
                <p className="text-sm text-secondary leading-relaxed pl-4">
                  We never see, ask for, or store your Google password. Authorization is done entirely through standard, secure Google OAuth2 credentials. We only store encrypted access and refresh tokens, which you can manually revoke from your Google Account settings page at any time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-xl md:py-32 bg-surface-container" id="pricing">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-12 space-y-3">
              <h2 className="font-headline-lg text-headline-lg text-primary-sendlib font-extrabold">Simple, Honest Pricing</h2>
              <p className="text-secondary font-body-lg max-w-2xl mx-auto">Start for free, no credit card required. Pro features coming soon.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">

              {/* Free Card */}
              <div className="rounded-2xl border-2 border-primary-sendlib bg-white shadow-lg p-8 flex flex-col gap-6 relative">
                <div className="absolute -top-3 left-6">
                  <span className="bg-primary-sendlib text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">CURRENT PLAN</span>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-primary-sendlib">Free</h3>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-4xl font-extrabold text-primary-sendlib">$0</span>
                    <span className="text-secondary mb-1">/ forever</span>
                  </div>
                  <p className="text-sm text-secondary mt-2">No credit card. No expiry. No catch.</p>
                </div>
                <ul className="space-y-3 text-sm text-secondary flex-1">
                  {[
                    "Up to 10 connected Gmail accounts",
                    "500 emails / day per account",
                    "15 API keys",
                    "60 API requests / minute",
                    "2MB HTML body · 1MB text body",
                    "Up to 10 attachments · 25MB total",
                    "50 recipients per field (to/cc/bcc)",
                    "7 days email analytics",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="block w-full text-center bg-primary-sendlib hover:bg-primary-sendlib/90 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Pro Card — blurred, coming soon */}
              <div className="rounded-2xl border border-outline-variant bg-white shadow-sm p-8 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute -top-3 left-6">
                  <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full tracking-wide">COMING SOON</span>
                </div>

                {/* Blurred overlay */}
                <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center gap-3 rounded-2xl">
                  <p className="font-bold text-primary-sendlib text-lg">Pro Plan</p>
                  <p className="text-secondary text-sm text-center max-w-[220px]">More accounts, higher limits & advanced features. Coming soon.</p>
                </div>

                <div className="opacity-30 pointer-events-none select-none">
                  <h3 className="text-2xl font-extrabold text-primary-sendlib">Pro</h3>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-4xl font-extrabold text-primary-sendlib">$?</span>
                    <span className="text-secondary mb-1">/ credits</span>
                  </div>
                  <p className="text-sm text-secondary mt-2">Pay as you go. No subscriptions.</p>
                </div>
                <ul className="space-y-3 text-sm text-secondary flex-1 opacity-30 pointer-events-none select-none">
                  {[
                    "Everything in Free",
                    "More connected Gmail accounts",
                    "Higher rate limits",
                    "Larger HTML body & attachments",
                    "90-day email analytics",
                    "Email open & click tracking",
                    "Webhooks & scheduled sends",
                    "Priority support",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="h-12 rounded-xl bg-outline-variant/30 opacity-30 pointer-events-none select-none" />
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="w-full relative py-xl md:py-32 mt-xl overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(rgba(29, 43, 62, 0.75), rgba(29, 43, 62, 0.75)), url('/forest_background/forest-background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Blur blobs for premium aesthetic */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <h2 className="font-headline-lg text-headline-lg text-white mb-lg">Stop fighting your hosting provider.</h2>
            <p className="font-body-lg text-body-lg text-white/80 mb-xl max-w-2xl mx-auto">
              Join developers who have simplified their email delivery pipeline. Start sending in seconds.
            </p>
            {!isLoading && user ? (
              <Link href="/dashboard" className="bg-white text-primary-sendlib hover:bg-gray-100 px-xl py-lg rounded-xl font-label-sm text-label-sm transition-transform active:scale-95 shadow-sm inline-block">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/login" className="bg-white text-primary-sendlib hover:bg-gray-100 px-xl py-lg rounded-xl font-label-sm text-label-sm transition-transform active:scale-95 shadow-sm inline-block">
                Create Free Account
              </Link>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-surface-container border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-xl gap-md max-w-7xl mx-auto">
          <div className="flex flex-col gap-xs text-center md:text-left">
            <div className="font-headline-md text-headline-md font-bold text-primary-sendlib">SendLib</div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">© {new Date().getFullYear()} SendLib. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-md">
            <Link href="/docs" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-sendlib transition-colors underline">
              Documentation
            </Link>
            <Link href="/privacy-policy" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-sendlib transition-colors underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-sendlib transition-colors underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
