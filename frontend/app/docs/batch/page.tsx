import { Code2, Zap } from "lucide-react";

export default function BatchSendingPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">Batch Sending</h1>
        <p className="text-[#a0a0a0] text-lg leading-relaxed">
          Queue thousands of emails at scale without managing background workers.
        </p>
      </div>

      <div className="space-y-6 text-[#ccc] leading-relaxed">
        <p>
          SendLiberty features a built-in background queue, allowing you to trigger a batch of emails in a single API request. 
          The delivery is automatically throttled according to rate limits and handled asynchronously.
        </p>

        <div className="p-4 border border-indigo-500/30 bg-indigo-500/10 rounded-lg text-indigo-200 text-sm flex items-start gap-3 my-8">
          <Zap className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            <strong>No BullMQ required:</strong> Why manage your own Redis queues for emails? SendLiberty processes your batch jobs natively, managing concurrency and retries automatically.
          </p>
        </div>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Example</h3>
        <pre className="p-4 bg-black border border-[#222] rounded text-sm font-mono text-[#ccc] whitespace-pre-wrap overflow-x-auto">
          <span className="text-[#666]">// Send to 1000 users with a single call</span>{"\n"}
          <span className="text-pink-400">const</span> job = <span className="text-pink-400">await</span> client.<span className="text-blue-300">sendBatch</span>({'{'}{"\n"}
          &nbsp;&nbsp;name: <span className="text-green-300">"March Newsletter"</span>,{"\n"}
          &nbsp;&nbsp;batchSize: <span className="text-purple-400">50</span>, <span className="text-[#666]">// Optional: Chunk size</span>{"\n"}
          &nbsp;&nbsp;batchDelayMs: <span className="text-purple-400">1000</span>, <span className="text-[#666]">// Optional: Delay between chunks</span>{"\n"}
          &nbsp;&nbsp;recipients: users.<span className="text-blue-300">map</span>(<span className="text-orange-300">u</span> ={'>'} ({'{'}{"\n"}
          &nbsp;&nbsp;&nbsp;&nbsp;to: u.email,{"\n"}
          &nbsp;&nbsp;&nbsp;&nbsp;subject: <span className="text-green-300">`Hello ${'{'}u.name{'}'}`</span>,{"\n"}
          &nbsp;&nbsp;&nbsp;&nbsp;html: <span className="text-green-300">"&lt;p&gt;Big news today!&lt;/p&gt;"</span>{"\n"}
          &nbsp;&nbsp;{'}'})){"\n"}
          {'}'});{"\n\n"}
          console.<span className="text-blue-300">log</span>(<span className="text-green-300">"Job ID:"</span>, job.id);
        </pre>
      </div>
    </div>
  );
}
