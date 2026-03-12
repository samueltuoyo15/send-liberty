# `@send-liberty/sdk`

Official TypeScript SDK for the **SendLiberty** Gmail OAuth Email Relay API.

## Install

```bash
npm install @send-liberty/sdk
# or
pnpm add @send-liberty/sdk
```

## Quick Start

```ts
import SendLiberty from "@send-liberty/sdk";

const mailer = new SendLiberty({
  auth: { apiKey: "sl_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
  service: "gmail",
});

await mailer.send({
  to: "user@gmail.com",
  subject: "Welcome!",
  text: "Hello from SendLiberty",
  html: "<p>Hello from <b>SendLiberty</b></p>",
});
```

## Constructor

```ts
new SendLiberty(config: SendLibertyConfig)
```

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `auth.apiKey` | `string` | ✅ | Your API key — get it from the dashboard |
| `service` | `"gmail" \| "smtp"` | — | Default: `"gmail"`. Override per-send by passing `service` in `send()` |
| `baseUrl` | `string` | — | Override API base URL. Default: `https://api.sendliberty.com` |

## `mailer.send(options)`

```ts
await mailer.send({
  to: "user@example.com",             // string | string[]
  subject: "Subject here",
  text: "Plain text version",          // optional if html provided
  html: "<p>HTML version</p>",         // optional if text provided
  replyTo: "support@app.com",          // optional
  cc: ["admin@app.com"],               // optional — string | string[]
  bcc: ["log@app.com"],                // optional — string | string[]
  from: "Support <support@app.com>",   // optional — defaults to your Gmail address
  attachments: [                        // optional — max 10
    {
      filename: "invoice.pdf",
      content: pdfBuffer,               // Buffer or base64 string
      contentType: "application/pdf",
    },
  ],
  headers: {                            // optional — custom email headers
    "X-Priority": "1",
  },
});
```

### Returns

```ts
{
  success: boolean;
  messageId: string | null;
}
```

## Error Handling

```ts
import { SendLibertyError } from "@send-liberty/sdk";

try {
  await mailer.send({ ... });
} catch (err) {
  if (err instanceof SendLibertyError) {
    console.error(err.message);   // human-readable message
    console.error(err.status);    // HTTP status code (401, 429, 500 etc.)
  }
}
```

## Common Errors

| Status | Meaning |
|--------|---------|
| `401` | Invalid or revoked API key |
| `400` | Gmail not connected or SMTP not configured |
| `429` | Rate limit or monthly quota exceeded |
| `500` | Send failed (check email logs in dashboard) |

## Environment Notes

The SDK uses the native `fetch` API — available in Node.js 18+, Bun, Deno, and all modern browsers.
For Node.js < 18 add `node-fetch` and pass it as a polyfill.
