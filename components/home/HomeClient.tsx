"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMe } from "@/hooks/useAuth";
import { getCodeSnippet, CodeTab } from "@/utils/codeSnippets";

import TopNavBar from "@/components/home/TopNavBar";

export default function HomeClient() {
  const { data: user } = useMe();
  const [apiUrl] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : "https://sendlib.samueltuoyo.com"
  );
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

  return (
    <div className="flex flex-col min-h-screen bg-background-sendlib text-on-background font-body-md">
      <TopNavBar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full relative overflow-hidden bg-[#1d2b3e]">
          <Image
            src="/forest_background/forest-background.webp"
            alt="SendLib Hero Background"
            fill
            priority
            quality={60}
            sizes="100vw"
            className="object-cover object-top md:object-center pointer-events-none opacity-55 md:opacity-70 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1d2b3e]/60 via-[#1d2b3e]/30 to-[#1d2b3e]/20 md:from-[#1d2b3e]/30 md:via-[#1d2b3e]/10 md:to-[#1d2b3e]/40 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-xl md:pt-40 md:pb-32 grid md:grid-cols-2 gap-xl items-center relative z-10">
            <div className="space-y-lg">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white font-extrabold drop-shadow-sm">
                Send Transactional Emails to Your Customers Without Verifying a Single Domain
              </h1>
              <p className="font-body-lg text-body-lg max-w-[500px] text-white/95 leading-relaxed drop-shadow-sm">
                The fastest way for founders and devs to send transactional emails to your customers (welcome messages, password resets, receipts) using their product's existing Gmail account. Zero domains to verify. Zero SMTP server stress. Just connect and send.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-md pt-md">
                {user ? (
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

        {/* Comparison Table */}
        <section id="compare" className="py-16 md:py-24 bg-white border-b border-outline-variant/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center mb-12 space-y-3 w-full">
              <span className="px-4 py-1.5 rounded-full bg-primary-sendlib/10 text-primary-sendlib text-xs font-bold tracking-wide uppercase">Why SendLib</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-sendlib">Stop verifying domains. Just send.</h2>
              <p className="text-secondary w-full max-w-2xl mx-auto text-base leading-relaxed">
                Traditional email APIs force you to configure DNS records and verify custom domains before sending a single email. SendLib uses the Gmail account your product already has.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-outline-variant shadow-sm bg-white">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant text-on-background">
                    <th className="px-6 py-4 font-bold text-secondary w-2/5">Feature</th>
                    <th className="px-6 py-4 text-center w-3/10 bg-primary-sendlib/5 border-x border-outline-variant/40">
                      <span className="bg-primary-sendlib text-white text-xs font-extrabold px-3.5 py-1 rounded-full shadow-xs inline-block">SendLib</span>
                    </th>
                    <th className="px-6 py-4 text-center font-bold text-secondary w-3/10">Traditional Email APIs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {[
                    {
                      feature: "Zero Domain Verification",
                      sendlib: "Instant (No domain needed)",
                      others: "Required (DNS verification)",
                    },
                    {
                      feature: "Free Emails Per Day",
                      sendlib: "500 to 2,000 / account",
                      others: "100 / day",
                    },
                    {
                      feature: "Uses Existing Product Gmail",
                      sendlib: "Yes (Google OAuth2)",
                      others: "No (Requires SMTP server)",
                    },
                  ].map((row) => (
                    <tr key={row.feature} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-on-background">{row.feature}</td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-600 bg-primary-sendlib/5 border-x border-outline-variant/40 text-xs sm:text-sm">
                        {row.sendlib}
                      </td>
                      <td className="px-6 py-4 text-center text-secondary text-xs sm:text-sm">
                        {row.others}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-xl md:py-32 bg-surface-container border-b border-outline-variant/60" id="pricing">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-12 space-y-3">
              <h2 className="font-headline-lg text-headline-lg text-primary-sendlib font-extrabold">Simple, Honest Pricing</h2>
              <p className="text-secondary font-body-lg max-w-2xl mx-auto">Start for free, no credit card required.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">

              {/* Free Card */}
              <div className="rounded-2xl border-2 border-primary-sendlib bg-white shadow-lg p-8 flex flex-col gap-6 relative">
                {(!user || user.plan !== "pro") && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-primary-sendlib text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">CURRENT PLAN</span>
                  </div>
                )}
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
                    "No custom domain needed",
                    "Up to 3 connected Gmail accounts",
                    "5 API keys",
                    "30 API requests / minute",
                    "2MB HTML body · 1MB text body",
                    "Up to 5 attachments · 1MB per file",
                    "50 recipients per field (to/cc/bcc)",
                    "5 days email log retention",
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

              {/* Pro Card */}
              <div className="rounded-2xl border-2 border-primary-sendlib/80 bg-white shadow-xl p-8 flex flex-col gap-6 relative">
                <div className="absolute -top-3 left-6">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">{user?.plan === "pro" ? "CURRENT PLAN" : "PRO PLAN"}</span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-primary-sendlib">Pro</h3>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-4xl font-extrabold text-primary-sendlib">$3.99</span>
                    <span className="text-secondary mb-1">/ month</span>
                  </div>
                  <p className="text-sm text-secondary mt-2">Higher limits & scale for growing applications.</p>
                </div>
                <ul className="space-y-3 text-sm text-secondary flex-1">
                  {[
                    "Everything in Free",
                    "Up to 50 connected Gmail accounts",
                    "Up to 100 API keys",
                    "300 API requests / minute",
                    "5MB HTML body · 2MB text body",
                    "Up to 20 attachments · 10MB per file",
                    "90 days email log retention",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={user ? "/dashboard/settings" : "/login"}
                  className="block w-full text-center bg-primary-sendlib hover:bg-primary-sendlib/90 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-md"
                >
                  {user?.plan === "pro" ? "Manage Subscription" : user ? "Upgrade to Pro ($3.99/mo)" : "Get Started Pro ($3.99/mo)"}
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-surface">
          <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-12 space-y-3">
              <span className="px-4 py-1.5 rounded-full bg-primary-sendlib/10 text-primary-sendlib text-xs font-bold inline-block tracking-wide uppercase">Get started in 60 seconds</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-sendlib">Three steps, then you are sending</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Connect your Gmail",
                  body: "Sign in with Google OAuth. We never see your password, only an encrypted refresh token that you can revoke at any time.",
                  color: "bg-[#eae3fc] border-[#d8cbf9] text-[#2e1065]",
                  sub: "text-[#4c2d96]",
                },
                {
                  step: "02",
                  title: "Generate an API key",
                  body: "Create a key in the dashboard. Scope it to specific origins if you want, or leave it open for server-side use.",
                  color: "bg-[#cbf1ec] border-[#b0e8e0] text-[#064e45]",
                  sub: "text-[#0f685c]",
                },
                {
                  step: "03",
                  title: "POST /api/send",
                  body: "One JSON request from any language. No SDK, no library, no config file. Your email is in the inbox within seconds.",
                  color: "bg-[#d7e6fc] border-[#bfd7fa] text-[#1e3a8a]",
                  sub: "text-[#1d4ed8]",
                },
              ].map((item) => (
                <div key={item.step} className={`rounded-2xl border p-8 flex flex-col gap-4 ${item.color}`}>
                  <span className="text-5xl font-black opacity-20 leading-none">{item.step}</span>
                  <h3 className="text-xl font-extrabold">{item.title}</h3>
                  <p className={`text-sm leading-relaxed ${item.sub}`}>{item.body}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link
                href="/login"
                className="bg-primary-sendlib hover:bg-primary-sendlib/90 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-md text-sm"
              >
                Start for free. No credit card required.
              </Link>
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
                  Yes, absolutely. Because the emails are sent using Google&apos;s official, highly trusted outbound mail servers, they inherit the absolute highest deliverability rates out of the box.
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



        {/* CTA Section */}
        <section className="w-full relative py-xl md:py-32 mt-xl overflow-hidden bg-[#1d2b3e]">
          <Image
            src="/forest_background/forest-background.webp"
            alt=""
            fill
            quality={50}
            sizes="100vw"
            className="object-cover object-center pointer-events-none"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[#1d2b3e]/75 pointer-events-none" />
          {/* Blur blobs for premium aesthetic */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <h2 className="font-headline-lg text-headline-lg text-white mb-lg">Stop fighting your hosting provider. Start delivering to your customers.</h2>
            <p className="font-body-lg text-body-lg text-white/80 mb-xl max-w-2xl mx-auto">
              Join developers who have simplified their email delivery pipeline and reliably reach their customers. Start sending in seconds.
            </p>
            {user ? (
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
            <p className="font-label-sm text-label-sm text-on-surface-variant">© 2026 SendLib. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-md">
            <Link href="/docs" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-sendlib transition-colors underline">
              Documentation
            </Link>
            <a href="mailto:hello@samueltuoyo.com" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-sendlib transition-colors underline">
              Contact Support
            </a>
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
