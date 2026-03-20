# SendLiberty TypeScript SDK

Official TypeScript/JavaScript SDK for SendLiberty - Email API with Gmail and Custom Domain support.

## Installation

```bash
npm install @sendliberty/sdk
# or
yarn add @sendliberty/sdk
# or
pnpm add @sendliberty/sdk
```

## Quick Start

```typescript
import SendLiberty from '@sendliberty/sdk';

const client = new SendLiberty({
  auth: {
    apiKey: 'your_api_key_here'
  }
});

await client.send({
  to: 'user@example.com',
  subject: 'Hello from SendLiberty',
  html: '<h1>Welcome!</h1>',
});
```

## Using Custom Domain (Like Resend)

### 1. Configure SMTP in Dashboard

Go to your SendLiberty dashboard and add your SMTP settings:
- Host: smtp.yourdomain.com
- Port: 587
- Username: your-smtp-username
- Password: your-smtp-password
- From Email: noreply@yourdomain.com

### 2. Send from Your Domain

```typescript
const client = new SendLiberty({
  auth: {
    apiKey: 'your_api_key_here'
  },
  service: 'smtp'
});

await client.send({
  from: 'noreply@yourdomain.com',
  to: 'customer@example.com',
  subject: 'Order Confirmation',
  html: '<p>Your order has been confirmed!</p>',
});
```

## Configuration Options

```typescript
const client = new SendLiberty({
  auth: {
    apiKey: 'your_api_key_here'
  },
  service: 'gmail' | 'smtp',
  baseUrl: 'https://api.sendliberty.com'
});
```

## Send Email

### Basic Email

```typescript
await client.send({
  to: 'user@example.com',
  subject: 'Hello',
  text: 'Plain text email',
  html: '<p>HTML email</p>',
});
```

### Multiple Recipients

```typescript
await client.send({
  to: ['user1@example.com', 'user2@example.com'],
  cc: 'manager@example.com',
  bcc: ['admin@example.com'],
  subject: 'Team Update',
  html: '<p>Important update</p>',
});
```

### With Attachments

```typescript
await client.send({
  to: 'user@example.com',
  subject: 'Invoice',
  html: '<p>Please find your invoice attached</p>',
  attachments: [
    {
      filename: 'invoice.pdf',
      content: Buffer.from('...'),
      contentType: 'application/pdf',
    }
  ],
});
```

### Custom Headers

```typescript
await client.send({
  to: 'user@example.com',
  subject: 'Newsletter',
  html: '<p>Monthly newsletter</p>',
  headers: {
    'X-Campaign-ID': 'newsletter-2024-01',
    'X-Priority': '1',
  },
});
```

## Scheduled Emails

```typescript
await client.send({
  to: 'user@example.com',
  subject: 'Reminder',
  html: '<p>This is your reminder</p>',
  scheduledAt: new Date('2024-12-31T10:00:00Z'),
});
```

## Batch Sending

```typescript
const recipients = [
  { to: 'user1@example.com', subject: 'Hello User 1', html: '<p>Hi User 1</p>' },
  { to: 'user2@example.com', subject: 'Hello User 2', html: '<p>Hi User 2</p>' },
];

await client.sendBatch({
  recipients,
  batchSize: 10,
  batchDelayMs: 1000,
});
```

## Error Handling

```typescript
import { SendLibertyError } from '@sendliberty/sdk';

try {
  await client.send({
    to: 'user@example.com',
    subject: 'Test',
    html: '<p>Test</p>',
  });
} catch (error) {
  if (error instanceof SendLibertyError) {
    console.error('SendLiberty Error:', error.message);
    console.error('Status Code:', error.statusCode);
  }
}
```

## Service Selection

### Gmail (Default)
Uses your connected Gmail account:

```typescript
const client = new SendLiberty({
  auth: { apiKey: 'your_api_key' },
  service: 'gmail'
});
```

### SMTP (Custom Domain)
Uses your configured SMTP server:

```typescript
const client = new SendLiberty({
  auth: { apiKey: 'your_api_key' },
  service: 'smtp'
});
```

### Auto-Select
If you don't specify a service, SendLiberty will:
1. Use Gmail if connected
2. Fall back to SMTP if configured
3. Return error if neither is available

## TypeScript Support

Full TypeScript support with type definitions included:

```typescript
import SendLiberty, { SendOptions, SendResult } from '@sendliberty/sdk';

const options: SendOptions = {
  to: 'user@example.com',
  subject: 'Test',
  html: '<p>Test</p>',
};

const result: SendResult = await client.send(options);
```

## API Reference

### `SendLiberty`

#### Constructor
```typescript
new SendLiberty(config: SendLibertyConfig)
```

#### Methods

##### `send(options: SendOptions): Promise<SendResult>`
Send a single email.

##### `sendBatch(options: BatchOptions): Promise<BatchResult>`
Send multiple emails in batches.

## Support

- Documentation: https://docs.sendliberty.com
- Email: support@sendliberty.com
- GitHub: https://github.com/sendliberty/sdk

## License

MIT
