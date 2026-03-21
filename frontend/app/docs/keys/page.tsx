import { Key } from "lucide-react";

export default function ApiKeysPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">API Keys</h1>
        <p className="text-[#a0a0a0] text-lg leading-relaxed">
          Authentication and security for your API requests.
        </p>
      </div>

      <div className="space-y-6 text-[#ccc] leading-relaxed">
        <p>
          To interact with the SendLiberty API, you must include a valid API key in your request. 
          The official TypeScript SDK handles this automatically when you initialize the client.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Generating a Key</h3>
        <ul className="list-disc pl-5 space-y-2 text-[#888]">
          <li>Go to the <strong>API Keys</strong> section in your dashboard.</li>
          <li>Click <strong>Generate Key</strong>.</li>
          <li>Copy the key immediately. For security reasons, it will never be fully visible again.</li>
        </ul>

        <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-lg text-red-200 text-sm mt-6">
          <strong>Security Warning:</strong> Never commit your API keys to version control (e.g., GitHub). Always use environment variables (e.g., <code>process.env.SL_API_KEY</code>).
        </div>
      </div>
    </div>
  );
}
