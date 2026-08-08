import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
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
            <h2 className="text-2xl font-bold border-b border-outline-variant pb-2 mb-4">1. Satisfaction Guarantee (14-Day Refund)</h2>
            <p>
              We want you to be completely satisfied with SendLib. If you upgrade to our Pro plan and find that it doesn't meet your needs, you are eligible for a full refund within <strong>14 days of your initial purchase</strong>.
            </p>
            <p>
              To request a refund within this 14-day window, simply contact us at <a href="mailto:support@sendlib.com">support@sendlib.com</a> with your account details. We will process your refund no questions asked, though we always appreciate feedback on how we can improve.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b border-outline-variant pb-2 mb-4">2. Subscription Renewals</h2>
            <p>
              SendLib operates on an auto-renewing subscription model. You will be billed automatically at the start of each billing cycle.
            </p>
            <p>
              <strong>Renewal payments are generally non-refundable.</strong> We do not offer prorated refunds for canceled subscriptions or for unused time in a billing cycle. You can cancel your subscription at any time from your dashboard to prevent future charges. When you cancel, you will retain access to Pro features until the end of your current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b border-outline-variant pb-2 mb-4">3. Plan Changes (Downgrades)</h2>
            <p>
              If you choose to downgrade from the Pro plan to the Free plan, the downgrade will take effect at the end of your current billing cycle. We do not issue prorated refunds for downgrades made in the middle of a billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b border-outline-variant pb-2 mb-4">4. Exceptions and Abuse</h2>
            <p>
              While we stand by our 14-day guarantee, we reserve the right to deny refund requests in cases of suspected abuse of our service (e.g., using SendLib to send spam, violating our terms of service, or repeatedly subscribing and requesting refunds).
            </p>
            <p>
              If your account is terminated or suspended due to a violation of our Terms of Service, you will not be eligible for a refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b border-outline-variant pb-2 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this refund policy or need to request a refund, please contact us at:
            </p>
            <ul>
              <li>Email: <a href="mailto:support@sendlib.com">support@sendlib.com</a></li>
            </ul>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
