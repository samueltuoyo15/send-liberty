
import Link from "next/link";
import { DocsPagination } from "@/components/docs/DocsPagination";

export default function DocsIntroduction() {
  return (
    <div className="space-y-10 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary-sendlib">
          Introduction
        </h1>
        <p className="text-xl text-secondary leading-relaxed">
          Welcome to the Sendlib documentation. Learn how to connect your Gmail via OAuth and send transactional emails using our REST API.
        </p>
      </div>

      {/* Section 1 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary-sendlib border-b border-outline-variant pb-2">
          What is Sendlib?
        </h2>
        <p className="text-secondary leading-relaxed">
          Sendlib removes the friction of configuring ancient SMTP ports, storing risky App Passwords, and managing strict firewall rules. By using secure Google OAuth2 flows, you grant Sendlib temporary, revokable access to relay messages securely through your own connected Gmail accounts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
           <div className="p-5 rounded-xl border border-outline-variant/60 bg-white">
              <h3 className="font-bold text-primary-sendlib mb-2">Secure by Default</h3>
              <p className="text-sm text-secondary">We never see your Google password. You use a standard Bearer API key to authorize request calls.</p>
           </div>
           <div className="p-5 rounded-xl border border-outline-variant/60 bg-white">
              <h3 className="font-bold text-primary-sendlib mb-2">API-First Design</h3>
              <p className="text-sm text-secondary">Send transactional emails instantly from any cloud hosting environment with a single HTTP POST request.</p>
           </div>
           <div className="p-5 rounded-xl border border-outline-variant/60 bg-white">
              <h3 className="font-bold text-primary-sendlib mb-2">Zero Domain Required (Custom Domains Supported)</h3>
              <p className="text-sm text-secondary">No DNS, MX, or SPF records needed. Connect @gmail.com or your custom domain Google Workspace account to send instantly.</p>
           </div>
           <div className="p-5 rounded-xl border border-outline-variant/60 bg-white">
              <h3 className="font-bold text-primary-sendlib mb-2">High Daily Limits</h3>
              <p className="text-sm text-secondary">Send up to 200 emails/day on Free (500/day on Pro) for personal/product Gmail accounts, or up to 1,000 on Free (2,000/day on Pro) for Google Workspace.</p>
           </div>
        </div>
      </div>

      {/* Next Step Banner */}
      <div className="p-6 rounded-xl border border-primary-sendlib/20 bg-primary-sendlib/[0.02] space-y-3">
        <h3 className="font-bold text-primary-sendlib text-lg">Ready to get started?</h3>
        <p className="text-sm text-secondary leading-relaxed">
          Follow our 5-minute Quick Start guide to connect your account, generate your first API key, and send a test email.
        </p>
        <div>
          <Link
            href="/docs/quickstart"
            className="inline-flex items-center text-sm font-bold text-primary-sendlib hover:underline"
          >
            Go to Quick Start
          </Link>
        </div>
      </div>

      <DocsPagination next={{ title: "Quick Start", href: "/docs/quickstart" }} />
    </div>
  );
}
