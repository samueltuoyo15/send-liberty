import { extractVariables } from "@/lib/templates";

export type DebugStep = {
  key: string;
  label: string;
  ok: boolean;
  skipped?: boolean;
  detail: string;
};

export type DebugIssue = {
  severity: "warning" | "error";
  code: string;
  title: string;
  hint: string;
};

export type DebugHealth = "healthy" | "warnings" | "failed";

export type DebugReport = {
  health: DebugHealth;
  steps: DebugStep[];
  issues: DebugIssue[];
  htmlBytes: number;
  templateSlug?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

function toList(v?: string | string[]): string[] {
  if (!v) return [];
  return (Array.isArray(v) ? v : [v])
    .flatMap((s) => s.split(","))
    .map((s) => {
      const match = s.match(/<([^>]+)>/);
      return (match ? match[1] : s).trim().toLowerCase();
    })
    .filter(Boolean);
}

function htmlBytesOf(html?: string, text?: string): number {
  const src = html || text || "";
  return Buffer.byteLength(src, "utf8");
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n >= 100 * 1024 ? 0 : 1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function isValidEmailAddress(value: string): boolean {
  return EMAIL_RE.test(value);
}

export function analyzeHtmlIssues(opts: {
  html?: string;
  text?: string;
  subject?: string;
  to?: string | string[];
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  missingVars?: string[];
  unresolvedVars?: string[];
  maxHtmlBytes?: number;
  templateSlug?: string;
}): DebugIssue[] {
  const issues: DebugIssue[] = [];
  const html = opts.html || "";
  const text = opts.text || "";
  const body = html || text;
  const bytes = htmlBytesOf(opts.html, opts.text);

  const checkAddr = (label: string, values: string[]) => {
    for (const addr of values) {
      if (!isValidEmailAddress(addr)) {
        issues.push({
          severity: "error",
          code: "malformed_address",
          title: `Bad ${label} address`,
          hint: `"${addr}" is not a valid email. Use name@domain.com.`,
        });
      }
    }
  };

  const toAddrs = toList(opts.to);
  const fromAddrs = toList(opts.from);
  if (toAddrs.length === 0) {
    issues.push({
      severity: "error",
      code: "missing_to",
      title: "Missing recipient",
      hint: "Add a to address before sending.",
    });
  }
  checkAddr("to", toAddrs);
  checkAddr("from", fromAddrs);
  checkAddr("cc", toList(opts.cc));
  checkAddr("bcc", toList(opts.bcc));

  if (!opts.subject || !String(opts.subject).trim()) {
    issues.push({
      severity: "error",
      code: "missing_subject",
      title: "Missing subject",
      hint: "Inbox filters often drop mail with an empty subject.",
    });
  }

  if (!body.trim()) {
    issues.push({
      severity: "error",
      code: "missing_body",
      title: "Missing email body",
      hint: "Provide html, text, or a template.",
    });
  }

  const missing = [...new Set(opts.missingVars ?? [])];
  const unresolved = [...new Set(opts.unresolvedVars ?? extractVariables(html, opts.subject || ""))];

  for (const key of missing) {
    issues.push({
      severity: "error",
      code: "missing_variable",
      title: `Missing {{${key}}}`,
      hint: `Pass data.${key} in the send request.`,
    });
  }
  for (const key of unresolved.filter((k) => !missing.includes(k))) {
    issues.push({
      severity: "warning",
      code: "broken_variable",
      title: `Unresolved {{${key}}}`,
      hint: "This placeholder is still in the email. Add it to data or remove it.",
    });
  }

  if (html) {
    const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
    const missingAlt = imgTags.filter((tag) => !/\balt\s*=/i.test(tag)).length;
    if (missingAlt > 0) {
      issues.push({
        severity: "warning",
        code: "img_no_alt",
        title: missingAlt === 1 ? "Image has no alt" : `${missingAlt} images have no alt`,
        hint: "Add alt text so screen readers can describe the image.",
      });
    }

    const hasUnsub =
      /unsubscribe/i.test(html) ||
      /List-Unsubscribe/i.test(html);
    const transactionalSlugs = new Set([
      "welcome", "verify-email", "password-reset", "otp",
      "invoice", "payment-successful", "payment-failed",
      "subscription-expiring", "account-suspended",
    ]);
    const isTransactional = opts.templateSlug
      ? transactionalSlugs.has(opts.templateSlug)
      : /(password|verify|otp|invoice|receipt|one-time|suspended|subscription|welcome|payment)/i.test(`${opts.subject || ""} ${html}`);
    if (!hasUnsub && html.length > 200 && !isTransactional) {
      issues.push({
        severity: "warning",
        code: "missing_unsubscribe",
        title: "No unsubscribe URL",
        hint: "Required for marketing mail. Skip this for password resets, OTPs, and receipts.",
      });
    }

    const hrefs = [...html.matchAll(/href\s*=\s*["']([^"']*)["']/gi)].map((m) => m[1].trim());
    const broken = hrefs.filter((href) => {
      if (!href || href === "#" || href.toLowerCase() === "javascript:void(0)") return true;
      if (href.startsWith("javascript:")) return true;
      if (href.startsWith("{{")) return false;
      if (/^(https?:|mailto:|tel:|\/)/i.test(href)) return false;
      return true;
    });
    if (broken.length > 0) {
      issues.push({
        severity: "warning",
        code: "broken_link",
        title: broken.length === 1 ? "Broken link" : `${broken.length} broken links`,
        hint: "Use a full https:// URL, mailto:, or a {{variable}} that resolves to one.",
      });
    }

    const unclosed = findUnclosedTags(html);
    if (unclosed.length > 0) {
      issues.push({
        severity: "warning",
        code: "invalid_html",
        title: "Invalid HTML",
        hint: `Unclosed <${unclosed.slice(0, 3).join(">, <")}> tag${unclosed.length > 1 ? "s" : ""}. Some inboxes will clip the email.`,
      });
    }
  }

  if (bytes >= 100 * 1024) {
    issues.push({
      severity: bytes > (opts.maxHtmlBytes ?? 2 * 1024 * 1024) ? "error" : "warning",
      code: "oversized",
      title: `HTML size: ${formatBytes(bytes)}`,
      hint: bytes > 1024 * 1024
        ? "This may be rejected. Keep HTML well under your plan limit."
        : "Over 100 KB can load slowly in mobile inboxes. Compress images and trim markup.",
    });
  } else if (html && bytes > 0) {
    // informational size is shown in the UI from htmlBytes; no issue needed under 100KB
  }

  if (opts.maxHtmlBytes && bytes > opts.maxHtmlBytes) {
    if (!issues.some((i) => i.code === "oversized" && i.severity === "error")) {
      issues.push({
        severity: "error",
        code: "oversized",
        title: `HTML size: ${formatBytes(bytes)}`,
        hint: "This exceeds your plan's HTML size limit.",
      });
    }
  }

  return dedupeIssues(issues);
}

function findUnclosedTags(html: string): string[] {
  const stack: string[] = [];
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(html)) !== null) {
    const full = match[0];
    const name = match[1].toLowerCase();
    if (full.startsWith("<!")) continue;
    if (VOID_TAGS.has(name) || full.endsWith("/>")) continue;
    if (full.startsWith("</")) {
      const idx = stack.lastIndexOf(name);
      if (idx === -1) continue;
      stack.splice(idx, 1);
    } else {
      stack.push(name);
    }
  }
  return [...new Set(stack)];
}

function dedupeIssues(issues: DebugIssue[]): DebugIssue[] {
  const seen = new Set<string>();
  return issues.filter((i) => {
    const key = `${i.severity}:${i.code}:${i.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildDebugReport(opts: {
  issues: DebugIssue[];
  steps: DebugStep[];
  html?: string;
  text?: string;
  templateSlug?: string;
}): DebugReport {
  const htmlBytes = htmlBytesOf(opts.html, opts.text);
  const failed = opts.steps.some((s) => !s.ok && !s.skipped) || opts.issues.some((i) => i.severity === "error");
  const health: DebugHealth = failed ? "failed" : opts.issues.length > 0 ? "warnings" : "healthy";
  return {
    health,
    steps: opts.steps,
    issues: opts.issues,
    htmlBytes,
    templateSlug: opts.templateSlug,
  };
}

export function formatHtmlSize(bytes: number): string {
  return formatBytes(bytes);
}
