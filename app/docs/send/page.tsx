"use client";

import { useState, useEffect } from "react";
import { DocsPagination } from "@/components/docs/DocsPagination";

type Language = "curl" | "js" | "python" | "go" | "rust" | "php" | "net" | "java";

export default function BasicSendPage() {
  const [lang, setLang] = useState<Language>("curl");
  const [apiUrl] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : "https://sendlib.samueltuoyo.com"
  );
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = () => {
    let snippet = "";
    if (lang === "curl") {
      snippet = `curl -X POST ${apiUrl}/api/send \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "from": '"Motion pipe" <motionpipehq@gmail.com>',\n    "to": "user@example.com",\n    "subject": "Hello via REST API",\n    "html": "<p>No SMTP configuration needed!</p>",\n    "replyTo": "support@yourdomain.com",\n    "attachments": [\n      { "filename": "invoice.pdf", "content": "JVBERi0xLjQKJ..." }\n    ]\n  }'`;
    } else if (lang === "js") {
      snippet = `await fetch('${apiUrl}/api/send', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer YOUR_API_KEY',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    from: '"Motion pipe" <motionpipehq@gmail.com>',\n    to: 'user@example.com',\n    subject: 'Hello via Fetch!',\n    html: '<p>No SMTP configuration needed!</p>',\n    replyTo: 'support@yourdomain.com',\n    attachments: [\n      { filename: 'invoice.pdf', content: 'JVBERi0xLjQKJ...' }\n    ]\n  })\n});`;
    } else if (lang === "python") {
      snippet = `import requests\n\nurl = "${apiUrl}/api/send"\nheaders = {\n  "Authorization": "Bearer YOUR_API_KEY",\n  "Content-Type": "application/json"\n}\npayload = {\n  "from": '"Motion pipe" <motionpipehq@gmail.com>',\n  "to": "user@example.com",\n  "subject": "Hello via Python!",\n  "html": "<p>No SMTP configuration needed!</p>",\n  "replyTo": "support@yourdomain.com",\n  "attachments": [\n    { "filename": "invoice.pdf", "content": "JVBERi0xLjQKJ..." }\n  ]\n}\n\nres = requests.post(url, json=payload, headers=headers)`;
    } else {
      snippet = `POST ${apiUrl}/api/send`;
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(snippet);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = snippet;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-primary-sendlib mb-4">Basic Send</h1>
        <p className="text-secondary text-lg leading-relaxed">
          Send a single transactional email instantly using the Sendlib REST API.
        </p>
      </div>

      <div className="space-y-6 text-secondary leading-relaxed">
        <p>
          To send an email, make a secure HTTP <code>POST</code> request to the <code>/api/send</code> endpoint. If you have connected multiple Gmail accounts, you can specify which one to use by passing the <code>from</code> field in your request body. If omitted, Sendlib automatically defaults to your first connected Gmail account.
        </p>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className="text-xl font-bold text-primary-sendlib">Example Request</h3>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-white border border-outline-variant p-1 text-xs font-mono overflow-x-auto max-w-full">
                {(["curl", "js", "python", "go", "rust", "php", "net", "java"] as Language[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setLang(tab)}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      lang === tab ? "bg-primary-sendlib/10 text-primary-sendlib font-bold" : "text-[#75777d] hover:text-primary-sendlib"
                    }`}
                  >
                    {tab === "curl"
                      ? "cURL"
                      : tab === "js"
                      ? "JavaScript"
                      : tab === "python"
                      ? "Python"
                      : tab === "go"
                      ? "Go"
                      : tab === "rust"
                      ? "Rust"
                      : tab === "php"
                      ? "PHP"
                      : tab === "net"
                      ? ".NET"
                      : "Java"}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopyCode}
                className="text-xs font-mono bg-white border border-outline-variant hover:bg-surface-container-low text-primary-sendlib px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {isCopied ? "✓ Copied" : "Copy Code"}
              </button>
            </div>
          </div>

          <pre className="p-4 bg-[#1d2b3e] border border-outline-variant/50 rounded-lg text-sm font-mono text-white/95 overflow-x-auto whitespace-pre leading-relaxed">
            {lang === "curl" && (
              `curl -X POST ${apiUrl}/api/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": '"Motion pipe" <motionpipehq@gmail.com>',
    "to": "user@example.com",
    "subject": "Hello via REST API",
    "html": "<p>No SMTP configuration needed!</p>",
    "replyTo": "support@yourdomain.com",
    "attachments": [
      { "filename": "invoice.pdf", "content": "JVBERi0xLjQKJ..." }
    ]
  }'`
            )}

            {lang === "js" && (
              `await fetch('${apiUrl}/api/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: '"Motion pipe" <motionpipehq@gmail.com>',
    to: 'user@example.com',
    subject: 'Hello via Fetch!',
    html: '<p>No SMTP configuration needed!</p>',
    replyTo: 'support@yourdomain.com',
    attachments: [
      { filename: 'invoice.pdf', content: 'JVBERi0xLjQKJ...' }
    ]
  })
});`
            )}

            {lang === "python" && (
              `import requests

url = "${apiUrl}/api/send"
headers = {
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}
payload = {
  "from": '"Motion pipe" <motionpipehq@gmail.com>',
  "to": "user@example.com",
  "subject": "Hello via Python!",
  "html": "<p>No SMTP configuration needed!</p>",
  "replyTo": "support@yourdomain.com",
  "attachments": [
    { "filename": "invoice.pdf", "content": "JVBERi0xLjQKJ..." }
  ]
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
            )}

            {lang === "go" && (
              `package main

import (
  "bytes"
  "encoding/json"
  "net/http"
)

func main() {
  payload, _ := json.Marshal(map[string]interface{}{
    "from":    '"Motion pipe" <motionpipehq@gmail.com>',
    "to":      "user@example.com",
    "subject": "Hello via Go!",
    "html":    "<p>No SMTP configuration needed!</p>",
    "replyTo": "support@yourdomain.com",
  })
  req, _ := http.NewRequest("POST", "${apiUrl}/api/send", bytes.NewBuffer(payload))
  req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
  req.Header.Set("Content-Type", "application/json")
  
  http.DefaultClient.Do(req)
}`
            )}

            {lang === "rust" && (
              `use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
  let client = reqwest::Client::new();
  let payload = json!({
    "from": '"Motion pipe" <motionpipehq@gmail.com>',
    "to": "user@example.com",
    "subject": "Hello via Rust!",
    "html": "<p>No SMTP configuration needed!</p>",
    "replyTo": "support@yourdomain.com"
  });
  
  client.post("${apiUrl}/api/send")
    .header("Authorization", "Bearer YOUR_API_KEY")
    .json(&payload)
    .send()
    .await?;
    
  Ok(())
}`
            )}

            {lang === "php" && (
              `<?php
$ch = curl_init('${apiUrl}/api/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Authorization: Bearer YOUR_API_KEY',
  'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'from' => '"Motion pipe" <motionpipehq@gmail.com>',
  'to' => 'user@example.com',
  'subject' => 'Hello via PHP!',
  'html' => '<p>No SMTP configuration needed!</p>',
  'replyTo' => 'support@yourdomain.com'
]));

curl_exec($ch);`
            )}

            {lang === "net" && (
              `using System.Net.Http;
using System.Text;
using System.Text.Json;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");

var payload = new {
  from = '"Motion pipe" <motionpipehq@gmail.com>',
  to = "user@example.com",
  subject = "Hello via .NET!",
  html = "<p>No SMTP configuration needed!</p>",
  replyTo = "support@yourdomain.com",
  attachments = new[] { new { filename = "invoice.pdf", content = "JVBERi0xLjQKJ..." } }
};

var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
var response = await client.PostAsync("${apiUrl}/api/send", content);
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);`
            )}

            {lang === "java" && (
              `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

var client = HttpClient.newHttpClient();
var payload = """
    {
      "from": '"Motion pipe" <motionpipehq@gmail.com>',
      "to": "user@example.com",
      "subject": "Hello via Java!",
      "html": "<p>No SMTP configuration needed!</p>",
      "replyTo": "support@yourdomain.com",
      "attachments": [
        { "filename": "invoice.pdf", "content": "JVBERi0xLjQKJ..." }
      ]
    }
    """;

var request = HttpRequest.newBuilder()
  .uri(URI.create("${apiUrl}/api/send"))
  .header("Authorization", "Bearer YOUR_API_KEY")
  .header("Content-Type", "application/json")
  .POST(HttpRequest.BodyPublishers.ofString(payload))
  .build();

var response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
            )}
          </pre>
        </div>

        <div className="p-5 rounded-xl border border-outline-variant bg-[#1d2b3e]/[0.02] mt-8 space-y-2">
          <h4 className="font-bold text-[#1d2b3e] text-base">Authentication Headers</h4>
          <p className="text-sm text-[#75777d]">
            You can authenticate your requests with Sendlib in two ways:
          </p>
          <ul className="list-disc pl-5 text-sm text-[#75777d] space-y-2">
            <li><strong>Authorization Header:</strong> Send your API key as a Bearer token: <code>Authorization: Bearer YOUR_API_KEY</code></li>
            <li><strong>Custom x-api-key Header:</strong> If your HTTP client or environment makes Bearer auth difficult, pass it directly: <code>x-api-key: YOUR_API_KEY</code></li>
          </ul>
        </div>

        <h3 className="text-xl font-bold text-primary-sendlib mt-8 mb-4">Request Body Parameters</h3>
        <ul className="list-disc pl-5 space-y-4 text-[#75777d]">
          <li>
            <strong>from</strong> (string, required): The connected Gmail email address you want to send this email from. 
            You can optionally include a custom display name by using the format <code>"Motion pipe" &lt;motionpipehq@gmail.com&gt;</code>. 

            <div className="mt-4 mb-2 p-6 rounded-xl border border-[#d3c5ff]/40 bg-[#f7f5ff] space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#2c1075] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Pro Tip</span>
                <h4 className="font-bold text-[#2c1075] text-lg m-0">Look Professional with Display Names</h4>
              </div>
              <p className="text-sm text-[#463a5d]">
                By default, if you just send your email address (e.g. <code>yourproduct@gmail.com or in my case, samueltuoyo9082@gmail.com</code>), that is exactly what your recipients will see in their inbox. This can look unprofessional.
              </p>
              <p className="text-sm text-[#463a5d]">
                Instead, we highly recommend wrapping your email with a <strong>Display Name</strong>. This makes your brand name stand out in the inbox perfectly.
              </p>
              <div className="rounded-lg overflow-hidden border border-[#d3c5ff]/60 shadow-sm my-4">
                <img src="/compare.png" alt="Comparison between using a display name and not using one" className="w-full h-auto block" />
              </div>
              <p className="text-xs text-[#75777d] italic">
                <strong>Top:</strong> Format using <code>"Sendlib" &lt;samueltuoyo9082@gmail.com&gt;</code><br/>
                <strong>Bottom:</strong> Format using just <code>samueltuoyo9082@gmail.com</code>
              </p>
            </div>
          </li>
          <li><strong>to</strong> (string or array of strings): The recipient&apos;s email address (or array of addresses).</li>
          <li><strong>subject</strong> (string): The subject line of the email.</li>
          <li><strong>html</strong> (string): The HTML body content of the email.</li>
          <li><strong>text</strong> (string, optional): The plain text fallback body.</li>
          <li><strong>replyTo</strong> (string, optional): Setup a reply-to email address.</li>
          <li><strong>cc</strong> (string or array of strings, optional): carbon copy recipient(s).</li>
          <li><strong>bcc</strong> (string or array of strings, optional): blind carbon copy recipient(s).</li>
          <li>
            <strong>attachments</strong> (array of objects, optional): An array of attachments to include:
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><code>filename</code> (string, required): The name of the file (e.g. <code>invoice.pdf</code>).</li>
              <li><code>content</code> (string, required): The base64-encoded file content.</li>
              <li><code>type</code> (string, optional): The MIME content type (e.g. <code>application/pdf</code>).</li>
            </ul>
          </li>
        </ul>

        <div className="p-4 border border-outline-variant/60 bg-surface-container-low rounded-xl text-sm text-secondary mt-8">
          Need details on rate limits or request body size caps? Check out the <a href="/docs/limits" className="font-bold text-primary-sendlib hover:underline">Limits & Quotas</a> documentation page.
        </div>
      </div>

      <DocsPagination
        prev={{ title: "API Keys", href: "/docs/keys" }}
      />
    </div>
  );
}
