"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon, Copy01Icon } from '@hugeicons/core-free-icons';
import { useState, useEffect } from "react";

type Language = "curl" | "js" | "python" | "go" | "rust" | "php" | "net" | "java";

export default function DocsIntroduction() {
  const [copied, setCopied] = useState(false);
  const [apiUrl, setApiUrl] = useState("https://sendlib.samueltuoyo.com");
  const [activeTab, setActiveTab] = useState<Language>("curl");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setApiUrl(window.location.origin);
    }
  }, []);

  const getCodeSnippet = (tab: Language) => {
    switch (tab) {
      case "curl":
        return `curl -X POST ${apiUrl}/api/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "sender@gmail.com",
    "to": "recipient@example.com",
    "subject": "Welcome aboard!",
    "html": "<p>Sent via SendLib REST API.</p>",
    "replyTo": "support@yourdomain.com",
    "cc": "anotheruser@example.com",
    "bcc": ["audit@example.com"],
    "attachments": [
      { "filename": "invoice.pdf", "content": "JVBERi0xLjQKJ..." }
    ]
  }'`;
      case "js":
        return `await fetch('${apiUrl}/api/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'sender@gmail.com',
    to: 'recipient@example.com',
    subject: 'Welcome aboard!',
    html: '<p>Sent via SendLib REST API.</p>',
    replyTo: 'support@yourdomain.com',
    cc: 'anotheruser@example.com',
    bcc: ['audit@example.com'],
    attachments: [
      { filename: 'invoice.pdf', content: 'JVBERi0xLjQKJ...' }
    ]
  })
});`;
      case "python":
        return `import requests

url = "${apiUrl}/api/send"
headers = {
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}
payload = {
  "from": "sender@gmail.com",
  "to": "recipient@example.com",
  "subject": "Welcome aboard!",
  "html": "<p>Sent via SendLib REST API.</p>",
  "replyTo": "support@yourdomain.com",
  "cc": "anotheruser@example.com",
  "bcc": ["audit@example.com"],
  "attachments": [
    { "filename": "invoice.pdf", "content": "JVBERi0xLjQKJ..." }
  ]
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;
      case "go":
        return `package main

import (
  "bytes"
  "encoding/json"
  "net/http"
)

func main() {
  payload, _ := json.Marshal(map[string]interface{}{
    "from":    "sender@gmail.com",
    "to":      "recipient@example.com",
    "subject": "Welcome aboard!",
    "html":    "<p>Sent via SendLib REST API.</p>",
    "replyTo": "support@yourdomain.com",
    "cc":      "anotheruser@example.com",
    "bcc":     []string{"audit@example.com"},
    "attachments": []map[string]string{
      {"filename": "invoice.pdf", "content": "JVBERi0xLjQKJ..."},
    },
  })
  req, _ := http.NewRequest("POST", "${apiUrl}/api/send", bytes.NewBuffer(payload))
  req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
  req.Header.Set("Content-Type", "application/json")
  
  http.DefaultClient.Do(req)
}`;
      case "rust":
        return `use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
  let client = reqwest::Client::new();
  let payload = json!({
    "from": "sender@gmail.com",
    "to": "recipient@example.com",
    "subject": "Welcome aboard!",
    "html": "<p>Sent via SendLib REST API.</p>",
    "replyTo": "support@yourdomain.com",
    "cc": "anotheruser@example.com",
    "bcc": ["audit@example.com"],
    "attachments": [
      { "filename": "invoice.pdf", "content": "JVBERi0xLjQKJ..." }
    ]
  });
  
  client.post("${apiUrl}/api/send")
    .header("Authorization", "Bearer YOUR_API_KEY")
    .json(&payload)
    .send()
    .await?;
    
  Ok(())
}`;
      case "php":
        return `<?php
$ch = curl_init('${apiUrl}/api/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Authorization: Bearer YOUR_API_KEY',
  'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'from' => 'sender@gmail.com',
  'to' => 'recipient@example.com',
  'subject' => 'Welcome aboard!',
  'html' => '<p>Sent via SendLib REST API.</p>',
  'replyTo' => 'support@yourdomain.com',
  'cc' => 'anotheruser@example.com',
  'bcc' => ['audit@example.com'],
  'attachments' => [
    ['filename' => 'invoice.pdf', 'content' => 'JVBERi0xLjQKJ...']
  ]
]));

curl_exec($ch);`;
      case "net":
        return `using System.Net.Http;
using System.Text;
using System.Text.Json;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");

var payload = new {
  from = "sender@gmail.com",
  to = "recipient@example.com",
  subject = "Welcome aboard!",
  html = "<p>Sent via SendLib REST API.</p>",
  replyTo = "support@yourdomain.com",
  cc = "anotheruser@example.com",
  bcc = new[] { "audit@example.com" },
  attachments = new[] { new { filename = "invoice.pdf", content = "JVBERi0xLjQKJ..." } }
};

var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
var response = await client.PostAsync("${apiUrl}/api/send", content);
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);`;
      case "java":
        return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

var client = HttpClient.newHttpClient();
var payload = """
    {
      "from": "sender@gmail.com",
      "to": "recipient@example.com",
      "subject": "Welcome aboard!",
      "html": "<p>Sent via SendLib REST API.</p>",
      "replyTo": "support@yourdomain.com",
      "cc": "anotheruser@example.com",
      "bcc": ["audit@example.com"],
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
System.out.println(response.body());`;
      default:
        return "";
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet(activeTab));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary-sendlib">
          Introduction
        </h1>
        <p className="text-xl text-secondary leading-relaxed">
          Welcome to the SendLib documentation. Learn how to connect your Gmail via OAuth and send transactional emails using our REST API.
        </p>
      </div>

      {/* Section 1 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary-sendlib border-b border-outline-variant pb-2">
          What is SendLib?
        </h2>
        <p className="text-secondary leading-relaxed">
          SendLib removes the friction of configuring ancient SMTP ports, storing risky App Passwords, and managing strict firewall rules. By using secure Google Workspace OAuth2 flows, you grant SendLib temporary, revokable access to relay messages securely through your own connected Gmail accounts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
           <div className="p-5 rounded-xl border border-outline-variant/60 bg-white">
              <h3 className="font-bold text-primary-sendlib mb-2">Secure by Default</h3>
              <p className="text-sm text-secondary">We never see your Google password. You use a standard Bearer API key to authorize request calls.</p>
           </div>
           <div className="p-5 rounded-xl border border-outline-variant/60 bg-white">
              <h3 className="font-bold text-primary-sendlib mb-2">API-First Design</h3>
              <p className="text-sm text-secondary">Send transactional emails instantly from any cloud platform (Railway, Render) with a single HTTP POST request.</p>
           </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary-sendlib border-b border-outline-variant pb-2">
          Basic Usage
        </h2>
        <p className="text-secondary leading-relaxed">
          To send an email, make a secure HTTP <code>POST</code> request containing your API Key in the headers and the email details in the JSON body. You can authenticate using the standard <code>Authorization: Bearer YOUR_API_KEY</code> header, or the custom <code>x-api-key: YOUR_API_KEY</code> header.
        </p>
        
        <div className="relative group rounded-lg overflow-hidden border border-outline-variant bg-[#1d2b3e]">
           <div className="flex h-10 items-center justify-between px-4 border-b border-[#2d3b4e] bg-[#16202e] overflow-x-auto max-w-full gap-1 custom-scrollbar">
             <div className="flex gap-2">
               {(["curl", "js", "python", "go", "rust", "php", "net", "java"] as const).map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-3 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                     activeTab === tab ? "bg-[#c8dbf0]/20 text-white font-bold" : "text-white/40 hover:text-white/80"
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
               onClick={copyCode}
               className="p-1 hover:bg-[#2d3b4e] rounded-md transition-colors cursor-pointer text-white/40 hover:text-white shrink-0 ml-4"
             >
                {copied ? (
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <HugeiconsIcon icon={Copy01Icon} className="w-3.5 h-3.5" />
                )}
             </button>
           </div>
           <div className="p-5 overflow-x-auto">
<pre className="text-sm font-mono leading-relaxed text-white/90 whitespace-pre p-4 rounded block overflow-x-auto w-full custom-scrollbar max-h-[380px]">
{getCodeSnippet(activeTab)}
</pre>
           </div>
        </div>
      </div>

    </div>
  );
}
