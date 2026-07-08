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
                SendLiberty acts as a proxy. We do <strong>not</strong> permanently store the content of the emails you send through our API. We only process the payload in memory long enough to deliver it to the respective upstream provider (e.g., Google OAuth2). We log metadata (timestamps, success/failure status) for debugging and rate-limiting purposes.
              </p>
            </section>

            <section className="space-y-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary-sendliberty">4. Information Sharing</h2>
              <p>
                We do not share your personal information or API data with third parties except as necessary to provide the service (e.g., authenticating with Google/GitHub) or when required by law.
              </p>
            </section>

            <section className="space-y-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary-sendliberty">5. Security</h2>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. Your API keys are hashed and encrypted at rest.
              </p>
            </section>
          </div>
        </div>
      </div>
    </SEO>
  );
}
