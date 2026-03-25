This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Push Notification Setup

This app supports Web Push on a phone that opens the deployed Vercel URL.

### Required env vars for Vercel

Set these on the `frontend` project:

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:you@example.com
PUSH_ADMIN_SECRET=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

`KV_REST_API_URL` and `KV_REST_API_TOKEN` are for Vercel KV. Without them, subscriptions fall back to in-memory storage and will not persist across serverless restarts.

### Generate VAPID keys

From `frontend/`:

```bash
npx web-push generate-vapid-keys
```

### Phone-side flow

1. Open the deployed URL on the phone.
2. Go to the settings tab.
3. Tap `このスマホで通知を受け取る`.
4. Tap `テスト通知` to verify delivery.

On iPhone, Web Push requires Safari and adding the site to the Home Screen before enabling notifications.

### Send a real notification

The payload is title-only.

```bash
curl -X POST https://YOUR_DOMAIN/api/push/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PUSH_ADMIN_SECRET" \
  -d '{"title":"ニュースタイトル本文だけをここに入れる","url":"/"}'
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
