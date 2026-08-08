import { Navbar } from "@/components/home/Navbar";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | SendLib",
  description: "SendLib Refund Policy and Satisfaction Guarantee",
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-20 mt-16">
        <div className="space-y-4 mb-12">
          <Link href="/" className="text-primary-sendlib hover:underline text-sm font-semibold">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary-sendlib">
            Refund Policy
          </h1>
          <p className="text-secondary text-lg">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-slate prose-headings:text-primary-sendlib prose-a:text-indigo-600 max-w-none text-secondary leading-relaxed space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold border-b border-outline-variant pb-2 mb-4">1. No Refunds</h2>
            <p>
              Due to the nature of our service and the costs associated with API infrastructure, <strong>all sales are final and non-refundable</strong>. Once a subscription is purchased and activated, we cannot issue any refunds, partial or otherwise.
            </p>
            <p>
              We highly encourage all users to fully utilize our Free plan to test the API, explore the dashboard, and ensure SendLib meets your requirements before upgrading to the Pro plan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b border-outline-variant pb-2 mb-4">2. Subscription Renewals & Cancellations</h2>
            <p>
              SendLib operates on an auto-renewing subscription model. You will be billed automatically at the start of each billing cycle.
            </p>
            <p>
              You may cancel your subscription at any time from your dashboard to prevent future charges. When you cancel, you will retain full access to all Pro features until the end of your current paid billing period. <strong>We do not offer prorated refunds for canceled subscriptions or for unused time in a billing cycle.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b border-outline-variant pb-2 mb-4">3. Plan Changes (Downgrades)</h2>
            <p>
              If you choose to downgrade from the Pro plan to the Free plan, the downgrade will take effect at the end of your current billing cycle. We do not issue prorated refunds for downgrades made in the middle of a billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b border-outline-variant pb-2 mb-4">4. Account Suspension</h2>
            <p>
              If your account is terminated or suspended due to a violation of our Terms of Service (e.g., using SendLib to send spam or malicious content), your subscription will be canceled immediately, and you will not be eligible for a refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b border-outline-variant pb-2 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about billing or this policy, please contact us at:
            </p>
            <ul>
              <li>Email: <a href="mailto:support@sendlib.com">support@sendlib.com</a></li>
            </ul>
          </section>

        </div>
      </main>

      <footer className="w-full mt-auto bg-surface-container border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-10 gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="font-bold text-primary-sendlib text-xl">SendLib</div>
            <p className="text-sm text-secondary">© 2026 SendLib. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/docs" className="text-sm text-secondary hover:text-primary-sendlib transition-colors underline">
              Documentation
            </Link>
            <a href="mailto:hello@samueltuoyo.com" className="text-sm text-secondary hover:text-primary-sendlib transition-colors underline">
              Contact Support
            </a>
            <Link href="/privacy-policy" className="text-sm text-secondary hover:text-primary-sendlib transition-colors underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-secondary hover:text-primary-sendlib transition-colors underline">
              Terms of Service
            </Link>
            <Link href="/refund" className="text-sm text-secondary hover:text-primary-sendlib transition-colors underline">
              Refund Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
