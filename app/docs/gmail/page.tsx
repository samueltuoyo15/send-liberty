import Link from "next/link";

export default function GmailOAuthPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-primary-sendliberty mb-4">Connecting Gmail</h1>
        <p className="text-secondary text-lg leading-relaxed">
          Learn how to securely connect your Google Workspace or personal Gmail account.
        </p>
      </div>

      <div className="space-y-6 text-secondary leading-relaxed">
        <p>
          SendLiberty uses secure OAuth2 flows to connect to your Gmail account. We never see, store, or have access to your Google password.
        </p>
        
        <div className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl text-[#505f76] text-sm">
          <strong className="text-primary-sendliberty">Daily Limits:</strong> Standard Gmail accounts are limited to 500 emails per day. Google Workspace accounts can send up to 2,000 emails per day.
        </div>

        <h3 className="text-xl font-bold text-primary-sendliberty mt-8 mb-4">Steps to Connect</h3>
        <ol className="list-decimal pl-5 space-y-4 text-[#75777d]">
          <li>Navigate to your SendLiberty dashboard <Link href="/dashboard/accounts" className="text-indigo-600 hover:text-indigo-700 underline font-semibold">Gmail Accounts</Link> tab.</li>
          <li>Click the <Link href="/dashboard/accounts" className="text-indigo-600 hover:text-indigo-700 underline font-semibold">Connect New Account</Link> button.</li>
          <li>You will be securely redirected to Google's consent screen.</li>
          <li>Select the account you want to send emails from.</li>
          <li>Grant SendLiberty permission to send emails on your behalf.</li>
          <li>You will be redirected back to the dashboard. Your account is now active!</li>
        </ol>
      </div>
    </div>
  );
}
