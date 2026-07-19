import Link from "next/link";
import type { Metadata } from "next";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Terms of Service | SendLib",
  description: "SendLib Terms of Service and API usage terms.",
  alternates: {
    canonical: "https://sendlib.samueltuoyo.com/terms-of-service",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background-sendlib text-on-background py-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-3xl mx-auto space-y-xl relative">
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-xs font-label-sm text-label-sm text-secondary hover:text-primary-sendlib transition-colors mb-8"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          Back to Home
        </Link>

        <div className="space-y-sm">
          <h1 className="font-headline-lg text-headline-lg text-primary-sendlib">Terms of Service</h1>
          <p className="font-body-md text-on-surface-variant">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-lg text-body-md font-body-md text-on-background">
          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-primary-sendlib">1. Acceptance of Terms</h2>
            <p>
              By accessing and using SendLib, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-primary-sendlib">2. Use License</h2>
            <p>
              Permission is granted to temporarily use SendLib's API for personal or commercial use, subject to rate limits and fair use policies. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-primary-sendlib">3. API Usage and Limits</h2>
            <p>
              You agree not to misuse the SendLib API. Any attempt to bypass rate limits, send spam, or use the service for illegal activities will result in immediate termination of your account.
            </p>
          </section>

          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-primary-sendlib">4. Disclaimer</h2>
            <p>
              The materials on SendLib's website and API are provided on an 'as is' basis. SendLib makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.
            </p>
          </section>

          <section className="space-y-sm">
            <h2 className="font-headline-sm text-headline-sm text-primary-sendlib">5. Limitations</h2>
            <p>
              In no event shall SendLib or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the SendLib API.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

