import Link from "next/link";
import SEO from "@/components/SEO";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export default function PrivacyPage() {
  return (
    <SEO title="Privacy Policy" description="SendLiberty Privacy Policy">
      <div className="min-h-screen bg-background-sendliberty text-on-background py-16 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mx-auto space-y-xl relative">
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-xs font-label-sm text-label-sm text-secondary hover:text-primary-sendliberty transition-colors mb-8"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            Back to Home
          </Link>

          <div className="space-y-sm">
            <h1 className="font-headline-lg text-headline-lg text-primary-sendliberty">Privacy Policy</h1>
            <p className="font-body-md text-on-surface-variant">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-lg text-body-md font-body-md text-on-background">
            <section className="space-y-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary-sendliberty">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create or modify your account, request customer support, or otherwise communicate with us. This includes your email address (via OAuth), name, and API usage metadata.
              </p>
            </section>

            <section className="space-y-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary-sendliberty">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services. Specifically, we use it to authenticate your API requests, route your emails through your connected OAuth providers, and monitor for abuse or spam.
              </p>
            </section>

            <section className="space-y-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary-sendliberty">3. Email Data Privacy</h2>
              <p>
                SendLiberty acts as a proxy. We do <strong>not</strong> permanently store the content (body) of the emails you send through our API. We only process the payload in memory long enough to deliver it to the respective upstream provider (e.g., Google Gmail API). We log metadata (timestamps, recipient address, subject line, success/failure status) for debugging, rate-limiting, and usage analytics purposes.
              </p>
            </section>

            <section className="space-y-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary-sendliberty">4. Google User Data</h2>
              <p>
                When you connect a Gmail account, SendLiberty requests the <code>gmail.send</code> OAuth scope, which allows us to send emails on your behalf. We do <strong>not</strong> read, index, or store the content of any emails in your Gmail inbox. The only Gmail data we access is your Gmail address (to identify the connected account) and the OAuth access and refresh tokens required to send emails on your behalf.
              </p>
              <p>
                Your OAuth access and refresh tokens are encrypted at rest using AES-256 encryption and are never exposed or shared with third parties.
              </p>
              <p>
                SendLiberty&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-sendliberty underline underline-offset-2"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </section>

            <section className="space-y-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary-sendliberty">5. Data Retention</h2>
              <p>We retain the following data for as long as your account is active:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Account information</strong> (name, email, provider ID): Retained indefinitely while your account exists.</li>
                <li><strong>Connected Gmail account credentials</strong> (encrypted OAuth tokens, Gmail address): Retained indefinitely until you disconnect the Gmail account from your dashboard or delete your SendLiberty account.</li>
                <li><strong>Email send logs</strong> (recipient address, subject line, send status, timestamp): Retained indefinitely while your account exists, used for usage analytics and rate-limiting.</li>
                <li><strong>API keys</strong> (hashed key, name, allowed origins): Retained indefinitely until you revoke them or delete your account.</li>
              </ul>
              <p>
                We do <strong>not</strong> retain the body/content of any emails you send through SendLiberty.
              </p>
            </section>

            <section className="space-y-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary-sendliberty">6. Data Deletion</h2>
              <p>
                You can delete your SendLiberty account and all associated data at any time directly from your dashboard:
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li>Go to <strong>Dashboard → Settings</strong></li>
                <li>Scroll to the <strong>Delete Account</strong> section</li>
                <li>Click <strong>Delete Account</strong> and confirm</li>
              </ol>
              <p>
                Deleting your account will permanently and immediately remove all of the following from our systems:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Your SendLiberty user profile</li>
                <li>All connected Gmail account credentials (OAuth tokens)</li>
                <li>All email send logs</li>
                <li>All API keys</li>
              </ul>
              <p>
                If you prefer to disconnect only a specific Gmail account without deleting your entire account, you can do so from <strong>Dashboard → Accounts</strong>.
              </p>
              <p>
                If you experience any issues deleting your account, please contact us at{" "}
                <a href="mailto:motionpipehq@gmail.com" className="text-primary-sendliberty underline underline-offset-2">
                  motionpipehq@gmail.com
                </a>{" "}
                and we will process the deletion manually within 30 days.
              </p>
            </section>

            <section className="space-y-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary-sendliberty">7. Information Sharing</h2>
              <p>
                We do not share your personal information or API data with third parties except as necessary to provide the service (e.g., authenticating with Google/GitHub) or when required by law.
              </p>
            </section>

            <section className="space-y-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary-sendliberty">8. Security</h2>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. Your API keys are hashed and encrypted at rest. Your Gmail OAuth tokens are encrypted using AES-256 encryption.
              </p>
            </section>
          </div>
        </div>
      </div>
    </SEO>
  );
}
