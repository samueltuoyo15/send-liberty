"use client";

import { CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";

export default function DocsIntroduction() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(`npm install @send-liberty/sdk`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Introduction
        </h1>
        <p className="text-xl text-[#888] leading-relaxed">
          Welcome to the SendLiberty documentation. Learn how to connect your Gmail via OAuth and send batch transactional emails using our TypeScript SDK.
        </p>
      </div>

      {/* Section 1 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-white border-b border-[#222] pb-2">
          What is SendLiberty?
        </h2>
        <p className="text-[#A0A0A0] leading-relaxed">
          SendLiberty removes the friction of configuring ancient SMTP ports, storing risky App Passwords, and managing strict firewall rules. By using secure Google Workspace OAuth2 flows, you grant our background worker temporary, revokable access to relay messages securely through your own inbox.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
           <div className="p-5 rounded-xl border border-[#222] bg-[#0A0A0A]">
              <h3 className="font-bold text-white mb-2">Secure by Default</h3>
              <p className="text-sm text-[#777]">We never see your Google password. You use a standard Bearer API key to talk to us.</p>
           </div>
           <div className="p-5 rounded-xl border border-[#222] bg-[#0A0A0A]">
              <h3 className="font-bold text-white mb-2">Batching & Scheduling</h3>
              <p className="text-sm text-[#777]">Pass an array of 5,000 personalized emails. We'll trickle them out to respect Gmail limits safely.</p>
           </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-white border-b border-[#222] pb-2">
          Installation
        </h2>
        <p className="text-[#A0A0A0] leading-relaxed">
          The fastest way to get started is by installing our strongly-typed NPM package.
        </p>
        
        <div className="relative rounded-lg overflow-hidden border border-[#333] bg-[#0a0a0a]">
           <div className="flex h-10 items-center gap-4 px-4 border-b border-[#222] bg-[#111] overflow-x-auto text-xs font-mono text-[#888]">
             <span className="text-white border-b border-indigo-400 py-2">npm</span>
             <span>yarn</span>
             <span>pnpm</span>
             <span>bun</span>
           </div>
           <div className="p-5 flex items-center justify-between">
             <code className="text-sm font-mono text-[#ccc]">
               <span className="text-pink-500">npm</span> install @send-liberty/sdk
             </code>
             <button 
               onClick={copyCode}
               className="p-2 hover:bg-[#222] rounded transition-colors"
             >
               {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-[#666]" />}
             </button>
           </div>
        </div>
      </div>
      
      {/* Section 3 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-white border-b border-[#222] pb-2">
          Basic Usage
        </h2>
        <p className="text-[#A0A0A0] leading-relaxed">
          Initialize the SDK with your API key, and call the `.send()` or `.sendBatch()` methods.
        </p>
        
        <div className="relative group rounded-lg overflow-hidden border border-[#333] bg-[#0a0a0a]">
           <div className="flex h-10 items-center px-4 border-b border-[#222] bg-[#111]">
             <span className="text-xs font-mono text-[#666]">example.ts</span>
           </div>
           <div className="p-5 overflow-x-auto">
<pre className="text-sm font-mono leading-relaxed text-[#ccc] whitespace-pre bg-[#0a0a0a] p-4 rounded block overflow-x-auto w-full">
<span className="text-pink-400">import</span> {'{'} SendLiberty {'}'} <span className="text-pink-400">from</span> <span className="text-green-300">"@send-liberty/sdk"</span>;{"\n"}
{"\n"}
<span className="text-[#666]">// 1. Initialize with your Dashboard API Key</span>{"\n"}
<span className="text-pink-400">const</span> client = <span className="text-pink-400">new</span> <span className="text-yellow-200">SendLiberty</span>(<span className="text-slate-300">"sl_9ab501..."</span>);{"\n"}
{"\n"}
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

    </div>
  );
}
