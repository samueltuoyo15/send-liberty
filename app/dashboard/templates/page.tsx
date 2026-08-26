"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Copy01Icon,
  Delete01Icon,
  Layout01Icon,
  MailEdit01Icon,
  PlusSignIcon,
  SearchVisualIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useTemplates,
  useSaveTemplate,
  useDeleteTemplate,
  useResetTemplate,
  useRestoreDefaultTemplates,
  type EmailTemplate,
  type TemplateCategory,
} from "@/hooks/useTemplates";
import { useInspectEmail } from "@/hooks/useDebugger";
import { useMe } from "@/hooks/useAuth";
import { useGmailAccounts } from "@/hooks/useGmailAccounts";
import { DebugPipeline } from "@/components/debugger/DebugPipeline";
import { toast } from "sonner";

const CATEGORY_LABEL: Record<TemplateCategory, string> = {
  auth: "Auth",
  billing: "Billing",
  account: "Account",
  custom: "Custom",
};

function extractVars(subject: string, html: string): string[] {
  const found = new Set<string>();
  const re = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
  for (const src of [subject, html]) {
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(src)) !== null) found.add(m[1]);
  }
  return [...found];
}

function fillPreview(source: string, data: Record<string, string>): string {
  return source.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => {
    const v = data[key];
    if (v === undefined || v === "") return `{{${key}}}`;
    return v
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  });
}

function samplesFor(vars: string[]): Record<string, string> {
  const map: Record<string, string> = {
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
  for (const key of vars) out[key] = map[key] ?? `sample_${key}`;
  return out;
}

type Draft = {
  id?: string;
  name: string;
  slug: string;
  subject: string;
  html: string;
  description: string;
  isDefault?: boolean;
};

export default function TemplatesPage() {
  const { data: templates, isLoading } = useTemplates();
  const { mutate: save, isPending: isSaving } = useSaveTemplate();
  const { mutate: remove, isPending: isDeleting } = useDeleteTemplate();
  const { mutate: resetTpl, isPending: isResetting } = useResetTemplate();
  const { mutate: restoreDefaults, isPending: isRestoring } = useRestoreDefaultTemplates();
  const inspect = useInspectEmail();
  const { data: user } = useMe();
  const { data: gmailAccounts } = useGmailAccounts();
  const connectedFrom = gmailAccounts?.find((a) => a.connected)?.email ?? "";

  const [filter, setFilter] = useState<"all" | TemplateCategory>("all");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [sample, setSample] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [testTo, setTestTo] = useState("");

  const vars = useMemo(
    () => (draft ? extractVars(draft.subject, draft.html) : []),
    [draft]
  );

  const previewData = useMemo(() => {
    const defaults = samplesFor(vars);
    const out = { ...defaults };
    for (const key of vars) {
      if (sample[key] !== undefined && sample[key] !== "") out[key] = sample[key];
    }
    return out;
  }, [vars, sample]);

  useEffect(() => {
    if (!draft) {
      setSample({});
      return;
    }
    setSample((prev) => {
      const next = samplesFor(vars);
      for (const key of vars) {
        if (prev[key]) next[key] = prev[key];
      }
      const same =
        Object.keys(next).length === Object.keys(prev).length &&
        Object.keys(next).every((k) => next[k] === prev[k]);
      return same ? prev : next;
    });
  }, [draft, vars]);

  const filtered = (templates ?? []).filter((t) => filter === "all" || t.category === filter);

  const openTemplate = (t: EmailTemplate) => {
    const nextDraft = {
      id: t.id,
      name: t.name,
      slug: t.slug,
      subject: t.subject,
      html: t.html,
      description: t.description,
      isDefault: t.isDefault,
    };
    setDraft(nextDraft);
    setSample(samplesFor(extractVars(nextDraft.subject, nextDraft.html)));
  };

  const openNew = () => {
    const html = `<p>Hi {{name}},</p>\n<p>Write your email here.</p>`;
    setDraft({
      name: "",
      slug: "",
      subject: "",
      html,
      description: "",
    });
    setSample(samplesFor(extractVars("", html)));
  };

  const previewHtml = draft ? fillPreview(draft.html, previewData) : "";
  const previewSubject = draft ? fillPreview(draft.subject, previewData) : "";

  const snippet = draft
    ? `{
  "template": "${draft.slug || "your-slug"}",
  "to": "user@gmail.com",
  "data": ${JSON.stringify(previewData, null, 4).replace(/\n/g, "\n  ")}
}`
    : "";

  const handleSave = () => {
    if (!draft) return;
    if (!draft.name.trim() || !draft.slug.trim() || !draft.subject.trim() || !draft.html.trim()) {
      toast.error("Name, slug, subject, and HTML are required.");
      return;
    }
    save(
      {
        id: draft.id,
        name: draft.name.trim(),
        slug: draft.slug.trim().toLowerCase(),
        subject: draft.subject,
        html: draft.html,
        description: draft.description,
      },
      {
        onSuccess: (saved) => {
          toast.success("Template saved.");
          setDraft({
            id: saved.id,
            name: saved.name,
            slug: saved.slug,
            subject: saved.subject,
            html: saved.html,
            description: saved.description,
            isDefault: saved.isDefault,
          });
        },
        onError: (err) => toast.error(typeof err === "string" ? err : "Could not save template."),
      }
    );
  };

  if (draft) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-outline-variant shrink-0"
              onClick={() => setDraft(null)}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} color="currentColor" strokeWidth={1.5} />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl font-headline-md font-bold tracking-tight text-primary-sendlib truncate">
                {draft.id ? draft.name || "Edit template" : "New template"}
              </h1>
              <p className="text-xs text-secondary mt-0.5">
                Send with <code className="font-mono text-[11px]">template: &quot;{draft.slug || "slug"}&quot;</code>
                {vars.length > 0 ? ` · {{${vars.join("}}, {{")}}}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {draft.id && draft.isDefault && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg border-outline-variant text-xs"
                disabled={isResetting}
                onClick={() =>
                  resetTpl(draft.id!, {
                    onSuccess: (t) => {
                      toast.success("Reset to starter copy.");
                      openTemplate(t);
                    },
                    onError: (err) => toast.error(typeof err === "string" ? err : "Reset failed."),
                  })
                }
              >
                Reset
              </Button>
            )}
            <Button
              size="sm"
              className="h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold border-0"
              disabled={isSaving}
              onClick={handleSave}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name">
                <Input
                  value={draft.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            name,
                            slug: d.id ? d.slug : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                          }
                        : d
                    );
                  }}
                  placeholder="Reset Password"
                  className="h-9 bg-surface-container-low border-outline-variant"
                />
              </Field>
              <Field label="Slug">
                <Input
                  value={draft.slug}
                  onChange={(e) => setDraft((d) => (d ? { ...d, slug: e.target.value.toLowerCase() } : d))}
                  placeholder="password-reset"
                  className="h-9 bg-surface-container-low border-outline-variant font-mono text-xs"
                />
              </Field>
            </div>
            <Field label="Subject">
              <Input
                value={draft.subject}
                onChange={(e) => setDraft((d) => (d ? { ...d, subject: e.target.value } : d))}
                placeholder="Reset your password"
                className="h-9 bg-surface-container-low border-outline-variant"
              />
            </Field>
            <Field label="HTML">
              <Textarea
                value={draft.html}
                onChange={(e) => setDraft((d) => (d ? { ...d, html: e.target.value } : d))}
                className="min-h-[280px] font-mono text-xs bg-surface-container-low border-outline-variant leading-relaxed"
              />
            </Field>
            {vars.length > 0 && (
              <div className="rounded-xl border border-outline-variant bg-surface p-3 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Preview data</p>
                <div className="grid grid-cols-2 gap-2">
                  {vars.map((key) => (
                    <label key={key} className="space-y-1">
                      <span className="text-[10px] font-mono text-secondary">{`{{${key}}}`}</span>
                      <Input
                        value={previewData[key] ?? ""}
                        onChange={(e) => setSample((s) => ({ ...s, [key]: e.target.value }))}
                        className="h-8 bg-surface-container-low border-outline-variant text-xs"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 xl:sticky xl:top-20">
            <div className="rounded-xl border border-outline-variant bg-surface overflow-hidden">
              <div className="px-3 py-2 border-b border-outline-variant/60 flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Preview</p>
                <span className="text-[11px] text-secondary truncate">{previewSubject || "No subject"}</span>
              </div>
              <iframe
                key={`${draft.id ?? "new"}:${previewHtml}`}
                title="Template preview"
                sandbox=""
                srcDoc={previewHtml}
                className="w-full h-[320px] bg-white"
              />
            </div>

            <div className="rounded-xl border border-outline-variant bg-surface p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">API request</p>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-secondary hover:text-primary-sendlib inline-flex items-center gap-1"
                  onClick={async () => {
                    await navigator.clipboard.writeText(snippet);
                    toast.success("Copied request body.");
                  }}
                >
                  <HugeiconsIcon icon={Copy01Icon} size={12} color="currentColor" strokeWidth={1.5} />
                  Copy
                </button>
              </div>
              <pre className="text-[11px] font-mono text-secondary/90 whitespace-pre-wrap break-all bg-surface-container-low rounded-lg p-3 border border-outline-variant/40">
                {snippet}
              </pre>
              <p className="text-[11px] text-secondary leading-relaxed">
                POST /api/send with your API key.{" "}
                <Link href="/docs/templates" className="underline underline-offset-2 hover:text-primary-sendlib">
                  Docs
                </Link>
              </p>
            </div>

            <div className="rounded-xl border border-outline-variant bg-surface p-3 space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Debugger</p>
                <p className="text-[11px] text-secondary mt-0.5 leading-relaxed">
                  Sends this preview through your connected Gmail and traces every step.
                </p>
              </div>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Send test to</span>
                <Input
                  type="email"
                  value={testTo}
                  onChange={(e) => setTestTo(e.target.value)}
                  placeholder={user?.email || connectedFrom || "you@gmail.com"}
                  className="h-8 bg-surface-container-low border-outline-variant text-xs"
                />
              </label>
              <Button
                className="w-full h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold border-0 text-xs"
                disabled={inspect.isPending || !draft.subject.trim() || !draft.html.trim()}
                onClick={() => {
                  const to = testTo.trim() || user?.email || connectedFrom;
                  if (!connectedFrom) {
                    toast.error("Connect a Gmail account first.");
                    return;
                  }
                  if (!to) {
                    toast.error("Add a recipient for the test send.");
                    return;
                  }
                  inspect.mutate(
                    {
                      send: true,
                      template: draft.id ? draft.slug : undefined,
                      data: previewData,
                      html: previewHtml,
                      subject: previewSubject,
                      to,
                      from: connectedFrom,
                    },
                    {
                      onSuccess: (result) => {
                        if (result.sent) {
                          toast.success(`Test sent to ${to}.`);
                        } else {
                          toast.error(result.message || "Gmail did not accept the test.");
                        }
                      },
                      onError: (err) => toast.error(typeof err === "string" ? err : "Test send failed."),
                    }
                  );
                }}
              >
                {inspect.isPending ? "Sending…" : "Run debugger"}
              </Button>
              {inspect.data?.debug ? (
                <DebugPipeline report={inspect.data.debug} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline-md font-bold tracking-tight text-primary-sendlib">Templates</h1>
          <p className="text-secondary font-body-md mt-1">
            Build once. Send with a slug and <code className="font-mono text-xs">data</code>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-outline-variant"
            disabled={isRestoring}
            onClick={() =>
              restoreDefaults(undefined, {
                onSuccess: (res) =>
                  toast.success(res.restored ? `Restored ${res.restored} starter template${res.restored === 1 ? "" : "s"}.` : "All starter templates are already present."),
                onError: (err) => toast.error(typeof err === "string" ? err : "Restore failed."),
              })
            }
          >
            Restore starters
          </Button>
          <Button
            size="sm"
            className="h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold border-0"
            onClick={openNew}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={14} color="currentColor" strokeWidth={1.5} className="mr-1" />
            New template
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["all", "auth", "billing", "account", "custom"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`h-7 px-2.5 rounded-md text-xs font-semibold transition-colors ${
              filter === key
                ? "bg-surface-container text-primary-sendlib"
                : "text-secondary hover:text-on-background hover:bg-surface-container-low"
            }`}
          >
            {key === "all" ? "All" : CATEGORY_LABEL[key]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[124px] rounded-xl bg-outline-variant/10" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-outline-variant bg-surface py-14 text-center px-6">
          <HugeiconsIcon icon={Layout01Icon} size={36} color="currentColor" strokeWidth={1.5} className="mx-auto text-secondary/50 mb-3" />
          <h3 className="text-base font-bold text-primary-sendlib">No templates here</h3>
          <p className="text-xs text-secondary mt-1 max-w-sm mx-auto">
            Starters cover welcome, OTP, invoices, and more. Create a custom one anytime.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => openTemplate(t)}
              className="text-left rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors p-4 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-center justify-center text-primary-sendlib">
                  <HugeiconsIcon icon={MailEdit01Icon} size={15} color="currentColor" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
                  {CATEGORY_LABEL[t.category]}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-primary-sendlib truncate">{t.name}</h3>
              <p className="text-[11px] font-mono text-secondary mt-0.5">{t.slug}</p>
              <p className="text-xs text-secondary mt-2 line-clamp-2 leading-relaxed">{t.description || t.subject}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[10px] text-secondary truncate">
                  {t.variables.length ? t.variables.map((v) => `{{${v}}}`).join(" ") : "No variables"}
                </span>
                {t.id && !t.isDefault && (
                  <span
                    role="button"
                    tabIndex={0}
                    className="opacity-0 group-hover:opacity-100 text-secondary hover:text-destructive p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(t.id);
                    }}
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-secondary flex items-center gap-1.5">
        <HugeiconsIcon icon={SearchVisualIcon} size={13} color="currentColor" strokeWidth={1.5} />
        After you send, open{" "}
        <Link href="/dashboard/debugger" className="underline underline-offset-2 hover:text-primary-sendlib">
          Debugger
        </Link>{" "}
        to see render and delivery steps.
      </p>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-headline-md font-bold">Delete template?</DialogTitle>
            <DialogDescription className="text-sm text-secondary">
              API calls using this slug will fail until you recreate it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 rounded-lg border-outline-variant" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-lg bg-destructive text-white hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={() => {
                if (!deleteId) return;
                remove(deleteId, {
                  onSuccess: () => {
                    toast.success("Template deleted.");
                    setDeleteId(null);
                  },
                  onError: (err) => toast.error(typeof err === "string" ? err : "Delete failed."),
                });
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{label}</span>
      {children}
    </label>
  );
}
