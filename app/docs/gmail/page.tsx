import Link from "next/link";
import { DocsPagination } from "@/components/docs/DocsPagination";

export default function GmailOAuthPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-primary-sendlib mb-4">Connecting Gmail</h1>
        <p className="text-secondary text-lg leading-relaxed">
          Learn how to securely connect your Google Workspace or personal Gmail account.
        </p>
      </div>

      <div className="space-y-6 text-secondary leading-relaxed">
        <p>
          SendLib uses secure OAuth2 flows to connect to your Gmail account. We never see, store, or have access to your Google password.
        </p>
        
        <div className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl text-[#505f76] text-sm">
          <strong className="text-primary-sendlib">Daily Limits:</strong> Standard Gmail accounts are limited to 500 emails per day. Google Workspace accounts can send up to 2,000 emails per day.
        </div>

        <div className="p-4 border border-emerald-100 bg-emerald-50/50 rounded-xl text-emerald-900 text-sm space-y-1">
          <strong className="text-emerald-950 font-bold block">Custom Company Domains:</strong>
          <p className="text-emerald-800 leading-relaxed">
            You can send emails directly from custom domain addresses (e.g. <code className="bg-emerald-100/80 px-1 rounded text-xs">hello@yourcompany.com</code>). Simply link your Google Workspace account using standard Google OAuth. Google Workspace handles all the DNS, SPF, and DKIM authentication for you automatically, so no domain configuration is needed on SendLib!
          </p>
        </div>

        <h3 className="text-xl font-bold text-primary-sendlib mt-8 mb-4">Steps to Connect</h3>
        <ol className="list-decimal pl-5 space-y-4 text-[#75777d]">
          <li>Navigate to your SendLib dashboard <Link href="/dashboard/accounts" className="text-indigo-600 hover:text-indigo-700 underline font-semibold">Gmail Accounts</Link> tab.</li>
          <li>Click the <Link href="/dashboard/accounts" className="text-indigo-600 hover:text-indigo-700 underline font-semibold">Connect New Account</Link> button.</li>
          <li>You will be securely redirected to Google&apos;s consent screen.</li>
          <li>Select the account you want to send transactional emails from.</li>
          <li>Grant SendLib permission to send transactional emails on your behalf.</li>
          <li>You will be redirected back to the dashboard. Your account is now active!</li>
        </ol>
      </div>

      <DocsPagination
        prev={{ title: "Limits & Quotas", href: "/docs/limits" }}
        next={{ title: "API Keys", href: "/docs/keys" }}
      />
    </div>
  );
}
