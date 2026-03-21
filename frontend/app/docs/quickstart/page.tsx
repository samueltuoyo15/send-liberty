import { Code2, Zap } from "lucide-react";

export default function QuickstartPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">Quick Start</h1>
        <p className="text-[#a0a0a0] text-lg leading-relaxed">
          Get up and running with SendLiberty in under 5 minutes.
        </p>
      </div>

      <div className="space-y-8">
        <div className="p-6 rounded-lg border border-[#333] bg-[#111]">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">1</span>
            Installation
          </h3>
          <p className="text-[#888] mb-4">Install the SDK using your preferred package manager.</p>
          <pre className="p-4 bg-black border border-[#222] rounded text-sm font-mono text-green-400">
            npm install @send-liberty/sdk
          </pre>
        </div>

        <div className="p-6 rounded-lg border border-[#333] bg-[#111]">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">2</span>
            Sending your first email
          </h3>
          <p className="text-[#888] mb-4">Initialize the client and fire away.</p>
          <pre className="p-4 bg-black border border-[#222] rounded text-sm font-mono text-[#ccc] whitespace-pre-wrap">
            <span className="text-pink-400">import</span> {'{'} SendLiberty {'}'} <span className="text-pink-400">from</span> <span className="text-green-300">"@send-liberty/sdk"</span>;{"\n\n"}
            <span className="text-[#666]">// 1. Initialize with your Dashboard API Key</span>{"\n"}
            <span className="text-pink-400">const</span> client = <span className="text-pink-400">new</span> <span className="text-yellow-200">SendLiberty</span>(<span className="text-slate-300">"sl_9ab501..."</span>);{"\n\n"}
            <span className="text-[#666]">// 2. Send instantly</span>{"\n"}
            <span className="text-pink-400">await</span> client.<span className="text-blue-300">send</span>({'{'}{"\n"}
            &nbsp;&nbsp;to: <span className="text-green-300">"customer@example.com"</span>,{"\n"}
            &nbsp;&nbsp;subject: <span className="text-green-300">"Welcome aboard!"</span>,{"\n"}
            &nbsp;&nbsp;html: <span className="text-green-300">"&lt;h1&gt;Hello World&lt;/h1&gt;"</span>{"\n"}
            {'}'});
          </pre>
        </div>
      </div>
    </div>
  );
}
