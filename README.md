# @uninspired/plunk-client

A TypeScript client for the [Plunk HTTP API](https://docs.useplunk.com/api-reference/).

Automatically handles the conversion of response data to the correct format.

## Requirements

- A runtime that supports fetch, Buffer and async/await (Node.js >= 18, bun or deno, optionally the browser with a buffer polyfill)

## Installation

```bash
npm install @uninspired/plunk-client
```

## Usage

### Initializing the client

```ts
import { PlunkApiClient } from "@uninspired/plunk-client";

const PLUNK_BASE_URL = "https://api.useplunk.com"; // Can be changed for self-hosted Plunk
const PLUNK_API_KEY = "your-api-key"; // Use your API secret key here

const plunkApiClient = new PlunkApiClient(PLUNK_BASE_URL, PLUNK_API_KEY);
```

### Automations

#### Track an event

```ts
const res = await plunkApiClient.trackEvent({
  event: "[EVENT_ID]",
  email: "user@example.com",
  subscribed: true,
  data: {
    foo: "bar",
  },
});
```

### Transactional

#### Send an email

You can provide attachments to the email by providing an array of JavaScript `File` objects. They will automatically be converted to base64 with the necessary metadata.

```ts
const attachment = new File([], "test.txt");

const res = await plunkApiClient.sendEmail({
  to: "user@example.com",
  subject: "Hello",
  body: "Hello, this is a test email.",
  subscribed: true,
  name: "John Doe",
  from: "sender@example.com",
  reply: "reply@example.com",
  headers: {
    "X-Custom-Header": "Test",
  },
  attachments: [attachment],
});
```

### Campaigns

#### Create a campaign

```ts
const res = await plunkApiClient.createCampaign({
  subject: "Hello",
  body: "Hello, this is a test email.",
  recipients: ["user@example.com"],
  style: "PLUNK",
});
```

#### Send a campaign

```ts
const res = await plunkApiClient.sendCampaign("[CAMPAIGN_ID]", {
  live: true, // Should the campaign be sent to the recipients
  delay: 5, // in minutes
});
```

#### Update a campaign

```ts
const res = await plunkApiClient.updateCampaign("[CAMPAIGN_ID]", {
  subject: "Hello",
  body: "Hello, this is a test email.",
  recipients: ["user@example.com"],
  style: "PLUNK",
});
```

#### Delete a campaign

```ts
const res = await plunkApiClient.deleteCampaign("[CAMPAIGN_ID]");
```

### Contacts

#### Get a contact by ID

```ts
interface ContactData {
  foo: string;
}

const res = await plunkApiClient.getContactById<ContactData>("[CONTACT_ID]");
```

#### Get all contacts

```ts
interface ContactData {
  foo: string;
}

const res = await plunkApiClient.getAllContacts<ContactData>();
```

#### Get number of contacts

```ts
const res = await plunkApiClient.getNumberOfContacts();
```

#### Create a contact

```ts
interface ContactData {
  foo: string;
}

const res = await plunkApiClient.createContact<ContactData>({
  email: "user@example.com",
  subscribed: true,
  data: {
    foo: "bar",
  },
});
```

#### Subscribe a contact

```ts
// Subscribe contact by ID
const res = await plunkApiClient.subscribeContact({ id: "[CONTACT_ID]" });

// Subscribe contact by email
const res = await plunkApiClient.subscribeContact({
  email: "user@example.com",
});
```

#### Unsubscribe a contact

```ts
// Unsubscribe contact by ID
const res = await plunkApiClient.unsubscribeContact({ id: "[CONTACT_ID]" });

// Unsubscribe contact by email
const res = await plunkApiClient.unsubscribeContact({
  email: "user@example.com",
});
```

#### Update a contact

```ts
interface ContactData {
  foo: string;
}

const res = await plunkApiClient.updateContact<ContactData>({
  id: "[CONTACT_ID]",
  data: { foo: "bar" },
});
```

#### Delete a contact

```ts
const res = await plunkApiClient.deleteContact("[CONTACT_ID]");
```

## Features

### Providing types for the arbitrary "data" field

Any request or response that contains a "data" field can have its type enforced by providing a type argument to the respective method.

**Note:** The data is not validated, it is simply typed.

```ts
interface ContactData {
  foo: string;
  bar?: string;
}

const res = await plunkApiClient.getContactById<ContactData>("[CONTACT_ID]");

// res.data will be of type ContactData
```

This will throw a TypeScript error:

```ts
interface ContactData {
  foo: string;
}

const res = await plunkApiClient.trackEvent<ContactData>({
  event: "[EVENT_ID]",
  email: "user@example.com",
  data: {
    bar: "bar",
  },
});
```
