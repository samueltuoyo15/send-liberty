"use client";

import { DocsPagination } from "@/components/docs/DocsPagination";

export default function DebuggerDocsPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-primary-sendlib mb-4">Debugger</h1>
        <p className="text-secondary text-lg leading-relaxed">
          Every send leaves a short trace: request in, template out, Gmail accepted, message sent — plus warnings you can act on.
        </p>
      </div>

      <div className="space-y-8 text-secondary leading-relaxed">
        <div>
          <h2 className="text-xl font-bold text-primary-sendlib mb-3">Where to look</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Dashboard → Debugger</strong> — pick a recent send, or paste a JSON body to inspect without sending.</li>
            <li><strong>Templates</strong> — Run debugger on a draft before you ship it.</li>
            <li>The <code>/api/send</code> response includes <code>debug.issues</code> so your app can log them too.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary-sendlib mb-3">Pipeline</h2>
          <div className="rounded-xl border border-outline-variant divide-y divide-outline-variant/50 text-sm">
            {[
              ["Request received", "Sendlib accepted the POST."],
              ["Template rendered", "HTML built from your slug, or skipped for custom html."],
              ["Variables resolved", "All {{placeholders}} filled from data."],
              ["Gmail accepted request", "Google queued the message for that from account."],
              ["Message sent", "Gmail returned a message ID."],
            ].map(([title, hint]) => (
              <div key={title} className="px-4 py-3">
                <p className="font-semibold text-primary-sendlib">{title}</p>
                <p className="text-xs mt-0.5">{hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary-sendlib mb-3">What we flag</h2>
          <div className="grid gap-2 text-sm">
            {[
              ["Missing {{variable}}", "Pass it in data or remove it from the template."],
              ["Bad email address", "to / from / cc / bcc must look like name@domain.com."],
              ["Invalid HTML", "Unclosed tags can clip the email in some inboxes."],
              ["Image has no alt", "Add alt so the image is readable without loading."],
              ["No unsubscribe URL", "Needed for marketing. Ignore for OTP, reset, and receipts."],
              ["Broken link", "Use a full https:// URL or a {{variable}} that becomes one."],
              ["HTML too large", "Over 100 KB is slow on mobile. Plans also cap max size."],
            ].map(([title, hint]) => (
              <div key={title} className="rounded-lg border border-outline-variant px-3 py-2.5">
                <p className="font-semibold text-primary-sendlib text-xs">{title}</p>
                <p className="text-xs mt-0.5">{hint}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DocsPagination
        prev={{ title: "Templates", href: "/docs/templates" }}
        next={{ title: "Batch Send", href: "/docs/batch" }}
      />
    </div>
  );
}
