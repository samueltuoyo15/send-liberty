export type TemplateCategory = "auth" | "billing" | "account";

export interface DefaultTemplate {
  slug: string;
  name: string;
  category: TemplateCategory;
  description: string;
  subject: string;
  html: string;
  variables: string[];
}

function wrapEmail(inner: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e4e4e7;">
        <tr><td style="padding:28px 32px;font-size:14px;line-height:1.55;">${inner}</td></tr>
      </table>
      <p style="font-size:11px;color:#71717a;margin:16px 0 0;text-align:center;">Sent via your app. This is a transactional email.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

const h1 = (t: string) =>
  `<h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#18181b;">${t}</h1>`;
const p = (t: string) => `<p style="margin:0 0 12px;">${t}</p>`;
const code = (t: string) =>
  `<p style="margin:16px 0;padding:14px 16px;background:#f4f4f5;border-radius:6px;font-size:22px;letter-spacing:4px;text-align:center;font-family:ui-monospace,monospace;font-weight:700;">${t}</p>`;
const btn = (href: string, label: string) =>
  `<p style="margin:20px 0 8px;"><a href="${href}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:6px;font-size:13px;font-weight:700;">${label}</a></p>`;
const mute = (t: string) => `<p style="margin:16px 0 0;font-size:12px;color:#71717a;">${t}</p>`;

export const DEFAULT_TEMPLATES: DefaultTemplate[] = [
  {
    slug: "welcome",
    name: "Welcome",
    category: "auth",
    description: "Greet a new user after they sign up.",
    subject: "Welcome to {{product}}, {{name}}",
    variables: ["name", "product"],
    html: wrapEmail(
      `${h1("Welcome, {{name}}")}
      ${p("Your {{product}} account is ready. You can sign in and start using the product right away.")}
      ${mute("If you did not create this account, you can ignore this email.")}`
    ),
  },
  {
    slug: "verify-email",
    name: "Verify Email",
    category: "auth",
    description: "Ask the user to confirm their email address.",
    subject: "Verify your email, {{name}}",
    variables: ["name", "link"],
    html: wrapEmail(
      `${h1("Verify your email")}
      ${p("Hi {{name}}, confirm this address so we know it is you.")}
      ${btn("{{link}}", "Verify email")}
      ${mute("This link expires in 24 hours. If you did not sign up, ignore this email.")}`
    ),
  },
  {
    slug: "password-reset",
    name: "Reset Password",
    category: "auth",
    description: "Send a reset code or link when a user forgets their password.",
    subject: "Reset your password",
    variables: ["name", "code"],
    html: wrapEmail(
      `${h1("Reset your password")}
      ${p("Hi {{name}}, use this code to reset your password.")}
      ${code("{{code}}")}
      ${mute("The code expires in 10 minutes. If you did not request this, you can ignore this email.")}`
    ),
  },
  {
    slug: "otp",
    name: "OTP",
    category: "auth",
    description: "One-time passcode for sign-in or sensitive actions.",
    subject: "Your verification code is {{code}}",
    variables: ["name", "code"],
    html: wrapEmail(
      `${h1("Your code")}
      ${p("Hi {{name}}, here is your one-time code.")}
      ${code("{{code}}")}
      ${mute("Expires in 10 minutes. Do not share this code.")}`
    ),
  },
  {
    slug: "invoice",
    name: "Invoice",
    category: "billing",
    description: "Send an invoice after a charge is created.",
    subject: "Invoice {{invoice_id}} for {{amount}}",
    variables: ["name", "amount", "invoice_id", "date"],
    html: wrapEmail(
      `${h1("Invoice {{invoice_id}}")}
      ${p("Hi {{name}}, here is your invoice dated {{date}}.")}
      ${p("<strong>Amount due:</strong> {{amount}}")}
      ${mute("Reply to this email if something looks wrong.")}`
    ),
  },
  {
    slug: "payment-successful",
    name: "Payment Successful",
    category: "billing",
    description: "Confirm a completed payment.",
    subject: "Payment received — {{amount}}",
    variables: ["name", "amount", "product"],
    html: wrapEmail(
      `${h1("Payment received")}
      ${p("Hi {{name}}, we received {{amount}} for {{product}}.")}
      ${mute("Keep this email as your receipt.")}`
    ),
  },
  {
    slug: "payment-failed",
    name: "Payment Failed",
    category: "billing",
    description: "Tell the user a charge did not go through.",
    subject: "Payment failed for {{amount}}",
    variables: ["name", "amount", "retry_url"],
    html: wrapEmail(
      `${h1("Payment failed")}
      ${p("Hi {{name}}, we could not charge {{amount}}. No action was taken on your account.")}
      ${btn("{{retry_url}}", "Update payment method")}
      ${mute("If you already paid, you can ignore this email.")}`
    ),
  },
  {
    slug: "subscription-expiring",
    name: "Subscription Expiring",
    category: "billing",
    description: "Warn before a plan ends.",
    subject: "Your {{plan}} plan ends on {{date}}",
    variables: ["name", "plan", "date"],
    html: wrapEmail(
      `${h1("Your plan is ending")}
      ${p("Hi {{name}}, your {{plan}} plan ends on {{date}}. Renew to keep access.")}
      ${mute("You will not be charged unless you renew.")}`
    ),
  },
  {
    slug: "account-suspended",
    name: "Account Suspended",
    category: "account",
    description: "Notify a user that their account is locked.",
    subject: "Your account has been suspended",
    variables: ["name", "reason", "support_url"],
    html: wrapEmail(
      `${h1("Account suspended")}
      ${p("Hi {{name}}, your account is suspended.")}
      ${p("<strong>Reason:</strong> {{reason}}")}
      ${btn("{{support_url}}", "Contact support")}
      ${mute("If you think this is a mistake, contact support.")}`
    ),
  },
];

const VAR_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

export function extractVariables(...parts: string[]): string[] {
  const found = new Set<string>();
  for (const part of parts) {
    if (!part) continue;
    VAR_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = VAR_RE.exec(part)) !== null) {
      found.add(match[1]);
    }
  }
  return [...found];
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function interpolate(
  source: string,
  data: Record<string, unknown>
): { result: string; missing: string[]; unresolved: string[] } {
  const missing: string[] = [];
  const result = source.replace(VAR_RE, (_, key: string) => {
    const raw = data[key];
    if (raw === undefined || raw === null || String(raw).trim() === "") {
      missing.push(key);
      return `{{${key}}}`;
    }
    return escapeHtml(String(raw));
  });
  const unresolved = extractVariables(result);
  return { result, missing: [...new Set(missing)], unresolved };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 64;
}

export function sampleDataFor(variables: string[]): Record<string, string> {
  const samples: Record<string, string> = {
    name: "John",
    product: "Acme",
    link: "https://example.com/verify",
    code: "482921",
    amount: "$49.00",
    invoice_id: "INV-1042",
    date: "Aug 26, 2026",
    retry_url: "https://example.com/billing",
    plan: "Pro",
    reason: "Unusual sending activity",
    support_url: "https://example.com/support",
  };
  const out: Record<string, string> = {};
  for (const key of variables) {
    out[key] = samples[key] ?? `sample_${key}`;
  }
  return out;
}
