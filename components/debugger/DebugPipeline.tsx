"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Alert02Icon,
  MinusSignCircleIcon,
} from "@hugeicons/core-free-icons";
import type { DebugIssue, DebugReport, DebugStep } from "@/hooks/useDebugger";

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n >= 100 * 1024 ? 0 : 1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function StepIcon({ step }: { step: DebugStep }) {
  if (step.skipped) {
    return (
      <HugeiconsIcon icon={MinusSignCircleIcon} size={16} color="currentColor" strokeWidth={1.5} className="text-secondary/50" />
    );
  }
  if (step.ok) {
    return (
      <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} color="currentColor" strokeWidth={1.5} className="text-emerald-400" />
    );
  }
  return (
    <HugeiconsIcon icon={CancelCircleIcon} size={16} color="currentColor" strokeWidth={1.5} className="text-destructive" />
  );
}

export function DebugPipeline({
  report,
  compact = false,
}: {
  report: DebugReport;
  compact?: boolean;
}) {
  const errors = report.issues.filter((i) => i.severity === "error");
  const warnings = report.issues.filter((i) => i.severity === "warning");

  return (
    <div className="space-y-4">
      <ol className="space-y-0">
        {report.steps.map((step, idx) => (
          <li key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="mt-0.5">
                <StepIcon step={step} />
              </div>
              {idx < report.steps.length - 1 && (
                <div className={`w-px flex-1 my-1 ${step.ok && !step.skipped ? "bg-emerald-500/30" : "bg-outline-variant/50"}`} />
              )}
            </div>
            <div className={`pb-3 min-w-0 ${idx === report.steps.length - 1 ? "pb-0" : ""}`}>
              <p className={`text-sm font-semibold leading-5 ${step.skipped ? "text-secondary" : step.ok ? "text-on-background" : "text-destructive"}`}>
                {step.label}
              </p>
              {!compact && (
                <p className="text-xs text-secondary mt-0.5 leading-relaxed">{step.detail}</p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {(errors.length > 0 || warnings.length > 0) && (
        <div className="space-y-2">
          {errors.map((issue) => (
            <IssueRow key={`${issue.code}-${issue.title}`} issue={issue} />
          ))}
          {warnings.map((issue) => (
            <IssueRow key={`${issue.code}-${issue.title}`} issue={issue} />
          ))}
        </div>
      )}

      {errors.length === 0 && warnings.length === 0 && (
        <p className="text-xs text-secondary border border-outline-variant/50 rounded-lg px-3 py-2">
          No issues found{typeof report.htmlBytes === "number" ? ` · HTML ${formatBytes(report.htmlBytes)}` : ""}.
        </p>
      )}
    </div>
  );
}

function IssueRow({ issue }: { issue: DebugIssue }) {
  const isError = issue.severity === "error";
  return (
    <div
      className={`rounded-lg border px-3 py-2.5 ${
        isError
          ? "border-destructive/20 bg-destructive/5"
          : "border-amber-500/20 bg-amber-500/5"
      }`}
    >
      <div className="flex items-start gap-2">
        <HugeiconsIcon
          icon={isError ? CancelCircleIcon : Alert02Icon}
          size={14}
          color="currentColor"
          strokeWidth={1.5}
          className={`mt-0.5 shrink-0 ${isError ? "text-destructive" : "text-amber-400"}`}
        />
        <div className="min-w-0">
          <p className={`text-xs font-semibold ${isError ? "text-destructive" : "text-amber-200"}`}>
            {issue.title}
          </p>
          <p className="text-[11px] text-secondary mt-0.5 leading-relaxed">{issue.hint}</p>
        </div>
      </div>
    </div>
  );
}

export function HealthBadge({ health }: { health: DebugReport["health"] | undefined }) {
  if (!health) {
    return (
      <span className="text-[10px] font-semibold tracking-wide uppercase text-secondary bg-surface-container px-1.5 py-0.5 rounded">
        No trace
      </span>
    );
  }
  const map = {
    healthy: "bg-emerald-500/10 text-emerald-400",
    warnings: "bg-amber-500/10 text-amber-400",
    failed: "bg-destructive/10 text-destructive",
  };
  const label = { healthy: "Clean", warnings: "Warnings", failed: "Failed" };
  return (
    <span className={`text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded ${map[health]}`}>
      {label[health]}
    </span>
  );
}
