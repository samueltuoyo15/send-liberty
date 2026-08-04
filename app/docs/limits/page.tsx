import { DocsPagination } from "@/components/docs/DocsPagination";

export default function LimitsPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-sendlib mb-4">
          Limits & Quotas
        </h1>
        <p className="text-secondary text-lg leading-relaxed">
          Overview of API rate limits, request payload limits, and daily Gmail quotas.
        </p>
      </div>

      <p className="text-secondary leading-relaxed">
        The following limits apply to accounts to ensure platform stability and protect fair usage. Pro plan upgrades increase these limits significantly.
      </p>

      {/* Section 1: Rate Limits */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-primary-sendlib">API Rate Limits</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-variant/40">
                <th className="text-left px-4 py-3 font-semibold text-primary-sendlib">Endpoint</th>
                <th className="text-left px-4 py-3 font-semibold text-primary-sendlib">Limit</th>
                <th className="text-left px-4 py-3 font-semibold text-primary-sendlib">Window</th>
                <th className="text-left px-4 py-3 font-semibold text-primary-sendlib">Keyed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              <tr className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-secondary"><code>POST /api/send</code></td>
                <td className="px-4 py-3 font-bold text-primary-sendlib">60 requests <span className="font-normal text-xs text-secondary block mt-1">(300 on Pro)</span></td>
                <td className="px-4 py-3 text-secondary">per minute</td>
                <td className="px-4 py-3 text-secondary">API key</td>
              </tr>
              <tr className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-secondary"><code>GET /api/auth/*</code></td>
                <td className="px-4 py-3 font-bold text-primary-sendlib">10 requests</td>
                <td className="px-4 py-3 text-secondary">per minute</td>
                <td className="px-4 py-3 text-secondary">IP address</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-secondary">
          When a rate limit is hit, the API returns <code className="bg-surface-variant px-1 rounded">429 Too Many Requests</code> with a <code className="bg-surface-variant px-1 rounded">Retry-After</code> header indicating how many seconds to wait.
        </p>
      </div>

      {/* Section 2: Request Size Limits */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-primary-sendlib">Request Payload Limits</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-variant/40">
                <th className="text-left px-4 py-3 font-semibold text-primary-sendlib">Field</th>
                <th className="text-left px-4 py-3 font-semibold text-primary-sendlib">Limit</th>
                <th className="text-left px-4 py-3 font-semibold text-primary-sendlib">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              <tr className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-secondary"><code>subject</code></td>
                <td className="px-4 py-3 font-bold text-primary-sendlib">998 characters</td>
                <td className="px-4 py-3 text-secondary">RFC 2822 maximum</td>
              </tr>
              <tr className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-secondary"><code>html</code></td>
                <td className="px-4 py-3 font-bold text-primary-sendlib">2 MB <span className="font-normal text-xs text-secondary block mt-1">(5 MB on Pro)</span></td>
                <td className="px-4 py-3 text-secondary">UTF-8 encoded</td>
              </tr>
              <tr className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-secondary"><code>text</code></td>
                <td className="px-4 py-3 font-bold text-primary-sendlib">1 MB <span className="font-normal text-xs text-secondary block mt-1">(2 MB on Pro)</span></td>
                <td className="px-4 py-3 text-secondary">UTF-8 encoded</td>
              </tr>
              <tr className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-secondary"><code>to</code> / <code>cc</code> / <code>bcc</code></td>
                <td className="px-4 py-3 font-bold text-primary-sendlib">50 recipients each</td>
                <td className="px-4 py-3 text-secondary">String or array of strings</td>
              </tr>
              <tr className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-secondary"><code>attachments</code></td>
                <td className="px-4 py-3 font-bold text-primary-sendlib">10 files · 25 MB total <span className="font-normal text-xs text-secondary block mt-1">(20 files · 50 MB total on Pro)</span></td>
                <td className="px-4 py-3 text-secondary">Base64-encoded content (Max 10MB per file)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Account & Daily Limits */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-primary-sendlib">Account & Daily Limits</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-variant/40">
                <th className="text-left px-4 py-3 font-semibold text-primary-sendlib">Resource</th>
                <th className="text-left px-4 py-3 font-semibold text-primary-sendlib">Limit</th>
                <th className="text-left px-4 py-3 font-semibold text-primary-sendlib">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              <tr className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-4 py-3 text-secondary">Connected Gmail Accounts</td>
                <td className="px-4 py-3 font-bold text-primary-sendlib">10 accounts max <span className="font-normal text-xs text-secondary block mt-1">(50 max on Pro)</span></td>
                <td className="px-4 py-3 text-secondary">Per SendLib user account</td>
              </tr>
              <tr className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-4 py-3 text-secondary">Active API Keys</td>
                <td className="px-4 py-3 font-bold text-primary-sendlib">15 keys max <span className="font-normal text-xs text-secondary block mt-1">(100 max on Pro)</span></td>
                <td className="px-4 py-3 text-secondary">Per SendLib user account</td>
              </tr>
              <tr className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-4 py-3 text-secondary">Personal Gmail (<code className="text-xs bg-surface-variant px-1 rounded">@gmail.com</code>)</td>
                <td className="px-4 py-3 font-bold text-primary-sendlib">500 emails / day</td>
                <td className="px-4 py-3 text-secondary">Resets daily at UTC midnight (enforced by Google)</td>
              </tr>
              <tr className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-4 py-3 text-secondary">Google Workspace Account</td>
                <td className="px-4 py-3 font-bold text-primary-sendlib">2,000 emails / day</td>
                <td className="px-4 py-3 text-secondary">Resets daily at UTC midnight (enforced by Google)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-secondary">
          Daily sending quotas are set and enforced directly by Google&apos;s Gmail API. SendLib monitors your send volume and resets your limit tracking daily at UTC midnight.
        </p>
      </div>

      <DocsPagination
        prev={{ title: "Quick Start", href: "/docs/quickstart" }}
        next={{ title: "Connecting Gmail", href: "/docs/gmail" }}
      />
    </div>
  );
}
