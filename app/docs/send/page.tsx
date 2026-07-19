"use client";

import { useState, useEffect } from "react";

type Language = "curl" | "js" | "python" | "go" | "rust" | "php" | "net" | "java";

export default function BasicSendPage() {
  const [lang, setLang] = useState<Language>("curl");
  const [apiUrl, setApiUrl] = useState("https://api.sendlib.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setApiUrl(window.location.origin);
    }
  }, []);

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-primary-sendlib mb-4">Basic Send</h1>
        <p className="text-secondary text-lg leading-relaxed">
          Send a single transactional email instantly using the SendLib REST API.
        </p>
      </div>

      <div className="space-y-6 text-secondary leading-relaxed">
        <p>
          To send an email, make a secure HTTP <code>POST</code> request to the <code>/api/send</code> endpoint. If you have connected multiple Gmail accounts, you can specify which one to use by passing the <code>from</code> field in your request body. If omitted, SendLib automatically defaults to your first connected Gmail account.
        </p>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-primary-sendlib">Example Request</h3>
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
          </div>

          <pre className="p-4 bg-[#1d2b3e] border border-outline-variant/50 rounded-lg text-sm font-mono text-white/95 overflow-x-auto whitespace-pre leading-relaxed">
            {lang === "curl" && (
              `curl -X POST ${apiUrl}/api/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "mysecondgmail@gmail.com",
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
    from: 'mysecondgmail@gmail.com',
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
  "from": "mysecondgmail@gmail.com",
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
    "from":    "mysecondgmail@gmail.com",
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
    "from": "mysecondgmail@gmail.com",
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
  'from' => 'mysecondgmail@gmail.com',
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
  from = "mysecondgmail@gmail.com",
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
      "from": "mysecondgmail@gmail.com",
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
            You can authenticate your requests with SendLib in two ways:
          </p>
          <ul className="list-disc pl-5 text-sm text-[#75777d] space-y-2">
            <li><strong>Authorization Header:</strong> Send your API key as a Bearer token: <code>Authorization: Bearer YOUR_API_KEY</code></li>
            <li><strong>Custom x-api-key Header:</strong> If your HTTP client or environment makes Bearer auth difficult, pass it directly: <code>x-api-key: YOUR_API_KEY</code></li>
          </ul>
        </div>

        <h3 className="text-xl font-bold text-primary-sendlib mt-8 mb-4">Request Body Parameters</h3>
        <ul className="list-disc pl-5 space-y-4 text-[#75777d]">
          <li><strong>from</strong> (string, optional): The connected Gmail email address you want to send this email from (e.g. <code>mysecondgmail@gmail.com</code>). If not supplied, it defaults to your first connected Gmail account.</li>
          <li><strong>to</strong> (string or array of strings): The recipient's email address (or array of addresses).</li>
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
      </div>
    </div>
  );
}
