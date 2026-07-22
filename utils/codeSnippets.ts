export type CodeTab = "curl" | "js" | "python" | "go" | "rust" | "php" | "net" | "java";

export const getCodeSnippet = (tab: CodeTab, isExpanded: boolean, apiUrl: string): string => {
  switch (tab) {
    case "curl":
      return isExpanded
        ? `curl -X POST ${apiUrl}/api/send \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "sender@gmail.com",
    "to": "user@example.com",
    "subject": "Hello via Webhook!",
    "html": "<p>No SMTP needed.</p>",
    "replyTo": "support@yourdomain.com",
    "cc": "anotheruser@example.com",
    "bcc": ["audit@example.com"],
    "attachments": [
      { "filename": "invoice.pdf", "content": "base64..." }
    ]
  }'`
        : `curl -X POST ${apiUrl}/api/send \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "sender@gmail.com",
    "to": "user@example.com",
    "subject": "Hello via Webhook!",
    "html": "<p>No SMTP needed.</p>"
  }'`;

    case "js":
      return isExpanded
        ? `await fetch('${apiUrl}/api/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'sender@gmail.com',
    to: 'user@example.com',
    subject: 'Hello via Webhook!',
    html: '<p>No SMTP needed.</p>',
    replyTo: 'support@yourdomain.com',
    cc: 'anotheruser@example.com',
    bcc: ['audit@example.com'],
    attachments: [
      { filename: 'invoice.pdf', content: 'base64...' }
    ]
  })
});`
        : `await fetch('${apiUrl}/api/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'sender@gmail.com',
    to: 'user@example.com',
    subject: 'Hello via Webhook!',
    html: '<p>No SMTP needed.</p>'
  })
});`;

    case "python":
      return isExpanded
        ? `import requests

url = "${apiUrl}/api/send"
headers = {
  "Authorization": "Bearer YOUR_KEY",
  "Content-Type": "application/json"
}
payload = {
  "from": "sender@gmail.com",
  "to": "user@example.com",
  "subject": "Hello via Webhook!",
  "html": "<p>No SMTP needed.</p>",
  "replyTo": "support@yourdomain.com",
  "cc": "anotheruser@example.com",
  "bcc": ["audit@example.com"],
  "attachments": [
    { "filename": "invoice.pdf", "content": "base64..." }
  ]
}

res = requests.post(url, json=payload, headers=headers)`
        : `import requests

url = "${apiUrl}/api/send"
headers = {
  "Authorization": "Bearer YOUR_KEY",
  "Content-Type": "application/json"
}
payload = {
  "from": "sender@gmail.com",
  "to": "user@example.com",
  "subject": "Hello via Webhook!",
  "html": "<p>No SMTP needed.</p>"
}

res = requests.post(url, json=payload, headers=headers)`;

    case "go":
      return isExpanded
        ? `package main

import (
  "bytes"
  "encoding/json"
  "net/http"
)

func main() {
  payload, _ := json.Marshal(map[string]interface{}{
    "from":    "sender@gmail.com",
    "to":      "user@example.com",
    "subject": "Hello via Webhook!",
    "html":    "<p>No SMTP needed.</p>",
    "replyTo": "support@yourdomain.com",
    "cc":      "anotheruser@example.com",
    "bcc":     []string{"audit@example.com"},
    "attachments": []map[string]string{
      {"filename": "invoice.pdf", "content": "base64..."},
    },
  })
  req, _ := http.NewRequest("POST", "${apiUrl}/api/send", bytes.NewBuffer(payload))
  req.Header.Set("Authorization", "Bearer YOUR_KEY")
  req.Header.Set("Content-Type", "application/json")
  
  http.DefaultClient.Do(req)
}`
        : `package main

import (
  "bytes"
  "encoding/json"
  "net/http"
)

func main() {
  payload, _ := json.Marshal(map[string]interface{}{
    "from":    "sender@gmail.com",
    "to":      "user@example.com",
    "subject": "Hello via Webhook!",
    "html":    "<p>No SMTP needed.</p>",
  })
  req, _ := http.NewRequest("POST", "${apiUrl}/api/send", bytes.NewBuffer(payload))
  req.Header.Set("Authorization", "Bearer YOUR_KEY")
  req.Header.Set("Content-Type", "application/json")
  
  http.DefaultClient.Do(req)
}`;

    case "rust":
      return isExpanded
        ? `use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
  let client = reqwest::Client::new();
  let payload = json!({
    "from": "sender@gmail.com",
    "to": "user@example.com",
    "subject": "Hello via Webhook!",
    "html": "<p>No SMTP needed.</p>",
    "replyTo": "support@yourdomain.com",
    "cc": "anotheruser@example.com",
    "bcc": ["audit@example.com"],
    "attachments": [
      { "filename": "invoice.pdf", "content": "base64..." }
    ]
  });
  
  client.post("${apiUrl}/api/send")
    .header("Authorization", "Bearer YOUR_KEY")
    .json(&payload)
    .send()
    .await?;
    
  Ok(())
}`
        : `use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
  let client = reqwest::Client::new();
  let payload = json!({
    "from": "sender@gmail.com",
    "to": "user@example.com",
    "subject": "Hello via Webhook!",
    "html": "<p>No SMTP needed.</p>"
  });
  
  client.post("${apiUrl}/api/send")
    .header("Authorization", "Bearer YOUR_KEY")
    .json(&payload)
    .send()
    .await?;
    
  Ok(())
}`;

    case "php":
      return isExpanded
        ? `<?php
$ch = curl_init('${apiUrl}/api/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Authorization: Bearer YOUR_KEY',
  'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'from' => 'sender@gmail.com',
  'to' => 'user@example.com',
  'subject' => 'Hello via Webhook!',
  'html' => '<p>No SMTP needed.</p>',
  'replyTo' => 'support@yourdomain.com',
  'cc' => 'anotheruser@example.com',
  'bcc' => ['audit@example.com'],
  'attachments' => [
    ['filename' => 'invoice.pdf', 'content' => 'base64...']
  ]
]));

curl_exec($ch);`
        : `<?php
$ch = curl_init('${apiUrl}/api/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Authorization: Bearer YOUR_KEY',
  'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'from' => 'sender@gmail.com',
  'to' => 'user@example.com',
  'subject' => 'Hello via Webhook!',
  'html' => '<p>No SMTP needed.</p>'
]));

curl_exec($ch);`;

    case "net":
      return isExpanded
        ? `var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_KEY");

var payload = new {
  from = "sender@gmail.com",
  to = "user@example.com",
  subject = "Hello via Webhook!",
  html = "<p>No SMTP needed.</p>",
  replyTo = "support@yourdomain.com",
  cc = "anotheruser@example.com",
  bcc = new[] { "audit@example.com" },
  attachments = new[] { new { filename = "invoice.pdf", content = "base64..." } }
};`
        : `var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_KEY");

var payload = new {
  from = "sender@gmail.com",
  to = "user@example.com",
  subject = "Hello via Webhook!",
  html = "<p>No SMTP needed.</p>"
};`;

    case "java":
      return isExpanded
        ? `var client = HttpClient.newHttpClient();
var payload = """
    {
      "from": "sender@gmail.com",
      "to": "user@example.com",
      "subject": "Hello via Webhook!",
      "html": "<p>No SMTP needed.</p>",
      "replyTo": "support@yourdomain.com",
      "cc": "anotheruser@example.com",
      "bcc": ["audit@example.com"],
      "attachments": [
        { "filename": "invoice.pdf", "content": "base64..." }
      ]
    }
    """;

var req = HttpRequest.newBuilder()
  .uri(URI.create("${apiUrl}/api/send"))
  .header("Authorization", "Bearer YOUR_KEY")
  .header("Content-Type", "application/json")
  .POST(HttpRequest.BodyPublishers.ofString(payload))
  .build();`
        : `var client = HttpClient.newHttpClient();
var payload = """
    {
      "from": "sender@gmail.com",
      "to": "user@example.com",
      "subject": "Hello via Webhook!",
      "html": "<p>No SMTP needed.</p>"
    }
    """;

var req = HttpRequest.newBuilder()
  .uri(URI.create("${apiUrl}/api/send"))
  .header("Authorization", "Bearer YOUR_KEY")
  .header("Content-Type", "application/json")
  .POST(HttpRequest.BodyPublishers.ofString(payload))
  .build();`;

    default:
      return "";
  }
};
