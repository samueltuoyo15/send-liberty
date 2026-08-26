"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchVisualIcon, Refresh01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebuggerLogs, useInspectEmail, type DebuggerLog } from "@/hooks/useDebugger";
import { DebugPipeline, HealthBadge } from "@/components/debugger/DebugPipeline";
import { redactEmail } from "@/utils/redact";
import { toast } from "sonner";

function syntheticReport(log: DebuggerLog) {
  if (log.debug) return log.debug;
  const sent = log.status === "sent";
  return {
    health: sent ? ("healthy" as const) : ("failed" as const),
    htmlBytes: 0,
    templateSlug: log.templateSlug,
    steps: [
      { key: "received", label: "Request received", ok: true, detail: "Logged by Sendlib." },
      { key: "template", label: "Template rendered", ok: true, skipped: !log.templateSlug, detail: log.templateSlug ? `Used ${log.templateSlug}.` : "Custom HTML." },
      { key: "variables", label: "Variables resolved", ok: true, skipped: !log.templateSlug, detail: log.templateSlug ? "Template data applied." : "No template variables." },
      { key: "gmail", label: "Gmail accepted request", ok: sent, detail: sent ? "Gmail queued the message." : (log.error || "Gmail rejected the request.") },
      { key: "sent", label: "Message sent", ok: sent, detail: sent ? (log.messageId ? `ID ${log.messageId}.` : "Accepted.") : "Not delivered." },
    ],
    issues: sent
      ? []
      : [{ severity: "error" as const, code: "send_failed", title: "Send failed", hint: log.error || "Gmail did not accept this message." }],
  };
}

const EXAMPLE = `{
  "template": "password-reset",
  "to": "user@gmail.com",
  "data": {
    "name": "John",
    "code": "482921"
  }
}`;

export default function DebuggerPage() {
  const { data: logs, isLoading, refetch, isFetching } = useDebuggerLogs();
  const inspect = useInspectEmail();
  const [tab, setTab] = useState<"recent" | "inspect">("recent");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [payload, setPayload] = useState(EXAMPLE);

  const selected = useMemo(() => {
    if (!logs?.length) return null;
    return logs.find((l) => l.id === selectedId) ?? logs[0];
  }, [logs, selectedId]);

  const report = selected ? syntheticReport(selected) : null;

  const runInspect = () => {
    try {
      const parsed = JSON.parse(payload);
      inspect.mutate(parsed, {
        onError: (err) => toast.error(typeof err === "string" ? err : "Could not inspect payload."),
      });
    } catch {
      toast.error("Payload must be valid JSON.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline-md font-bold tracking-tight text-primary-sendlib">Debugger</h1>
          <p className="text-secondary font-body-md mt-1">
            See each send step, then fix warnings before they hit the inbox.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-outline-variant p-0.5 bg-surface">
            <TabBtn active={tab === "recent"} onClick={() => setTab("recent")}>Recent sends</TabBtn>
            <TabBtn active={tab === "inspect"} onClick={() => setTab("inspect")}>Inspect</TabBtn>
          </div>
          {tab === "recent" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => refetch()}
            >
              <HugeiconsIcon
                icon={Refresh01Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.5}
                className={isFetching ? "animate-spin" : ""}
              />
            </Button>
          )}
        </div>
      </div>

      {tab === "inspect" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-outline-variant bg-surface p-4 space-y-3">
            <div>
              <h2 className="text-sm font-bold text-primary-sendlib">Paste a send body</h2>
              <p className="text-xs text-secondary mt-0.5">Same JSON you POST to /api/send. Nothing is delivered.</p>
            </div>
            <Textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="min-h-[280px] font-mono text-xs bg-surface-container-low border-outline-variant"
            />
            <Button
              className="rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold border-0"
              disabled={inspect.isPending}
              onClick={runInspect}
            >
              {inspect.isPending ? "Checking..." : "Inspect"}
            </Button>
          </div>
          <div className="rounded-xl border border-outline-variant bg-surface p-4">
            <h2 className="text-sm font-bold text-primary-sendlib mb-3">Result</h2>
            {inspect.data ? (
              <DebugPipeline report={inspect.data.debug} />
            ) : (
              <p className="text-xs text-secondary leading-relaxed">
                We check missing fields, broken <code>{"{{variables}}"}</code>, invalid HTML, bad addresses, oversized markup, images without alt, and weak links.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
          <div className="lg:col-span-2 rounded-xl border border-outline-variant bg-surface overflow-hidden">
            <div className="px-4 py-2.5 border-b border-outline-variant/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Sends</p>
            </div>
            {isLoading ? (
              <div className="p-3 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-lg bg-outline-variant/10" />
                ))}
              </div>
            ) : !logs?.length ? (
              <div className="px-5 py-10 text-center">
                <HugeiconsIcon icon={SearchVisualIcon} size={32} color="currentColor" strokeWidth={1.5} className="mx-auto text-secondary/40 mb-2" />
                <p className="text-sm font-bold text-primary-sendlib">No sends yet</p>
                <p className="text-xs text-secondary mt-1 leading-relaxed">
                  Send via the API or{" "}
                  <Link href="/dashboard/templates" className="underline underline-offset-2">
                    a template
                  </Link>
                  . The pipeline appears here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-outline-variant/40 max-h-[560px] overflow-y-auto custom-scrollbar">
                {logs.map((log) => {
                  const active = selected?.id === log.id;
                  return (
                    <li key={log.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(log.id)}
                        className={`w-full text-left px-4 py-3 transition-colors ${active ? "bg-surface-container-low" : "hover:bg-surface-container-low/60"}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-primary-sendlib truncate">{log.subject}</span>
                          <HealthBadge health={log.debug?.health ?? (log.status === "failed" ? "failed" : undefined)} />
                        </div>
                        <p className="text-[11px] text-secondary mt-1 truncate">
                          {redactEmail(log.to)} · {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {log.templateSlug ? ` · ${log.templateSlug}` : ""}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="lg:col-span-3 rounded-xl border border-outline-variant bg-surface p-5 min-h-[320px]">
            {!report ? (
              <div className="h-full flex items-center justify-center text-xs text-secondary">
                Select a send to inspect it.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-headline-md font-bold text-primary-sendlib truncate">{selected?.subject}</h2>
                    <p className="text-xs text-secondary mt-0.5">
                      To {selected ? redactEmail(selected.to) : "—"}
                      {selected?.from ? ` · From ${redactEmail(selected.from)}` : ""}
                    </p>
                  </div>
                  <HealthBadge health={report.health} />
                </div>
                <DebugPipeline report={report} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 px-3 rounded-md text-xs font-semibold transition-colors ${
        active ? "bg-surface-container-low text-primary-sendlib" : "text-secondary hover:text-on-background"
      }`}
    >
      {children}
    </button>
  );
}
