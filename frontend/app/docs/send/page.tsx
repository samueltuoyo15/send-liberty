export default function BasicSendPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">Basic Send</h1>
        <p className="text-[#a0a0a0] text-lg leading-relaxed">
          Send a single transactional email instantly using the API.
        </p>
      </div>

      <div className="space-y-6 text-[#ccc] leading-relaxed">
        <p>
          The <code>send()</code> method is the primary way to dispatch immediate, one-off transactional emails to a user.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Example</h3>
        <pre className="p-4 bg-black border border-[#222] rounded text-sm font-mono text-[#ccc] whitespace-pre-wrap">
          <span className="text-pink-400">const</span> response = <span className="text-pink-400">await</span> client.<span className="text-blue-300">send</span>({'{'}{"\n"}
          &nbsp;&nbsp;to: <span className="text-green-300">"user@domain.com"</span>,{"\n"}
          &nbsp;&nbsp;subject: <span className="text-green-300">"Your Magic Link"</span>,{"\n"}
          &nbsp;&nbsp;html: <span className="text-green-300">"&lt;a href='https://...'&gt;Click here to log in&lt;/a&gt;"</span>,{"\n"}
          &nbsp;&nbsp;replyTo: <span className="text-green-300">"support@yourdomain.com"</span>{"\n"}
          {'}'});{"\n\n"}
          console.<span className="text-blue-300">log</span>(response.messageId);
        </pre>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Parameters</h3>
        <ul className="list-disc pl-5 space-y-4 text-[#888]">
          <li><strong>to</strong> (string): The recipient's email address.</li>
          <li><strong>subject</strong> (string): The email subject line.</li>
          <li><strong>html</strong> (string): The HTML body of the email.</li>
          <li><strong>text</strong> (string, optional): The plain text fallback body.</li>
          <li><strong>replyTo</strong> (string, optional): Setup a reply-to address block.</li>
        </ul>
      </div>
    </div>
  );
}
