# AI Chat

A Next.js App Router chat app with TypeScript, Tailwind CSS, and shadcn/ui. It sends conversation context to OpenAI through a server-side route. Chats stay in the current browser tab and reset on reload.

## Run locally

Use Node.js 20.9 or later. In the project root, create `.env.local` with your OpenAI API key.

```dotenv
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

`OPENAI_MODEL` is optional. Keep `.env.local` out of version control.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Press Enter to send a message or Shift+Enter for a new line. If you deploy the app for shared use, protect the chat API with authentication and rate limits before adding a billable API key.

## Verify

```bash
npm run lint
npm run build
```
