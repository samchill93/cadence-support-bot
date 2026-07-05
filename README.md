# Cadence — AI Support Assistant

A custom AI customer-support chatbot built on the Claude API, grounded in a product's own knowledge so it answers accurately instead of making things up. Built with React, a serverless backend, and a carefully engineered system prompt.

**Live demo → [cadence-support-bot.vercel.app](https://cadence-support-bot.vercel.app/)**

![Cadence support assistant](screenshot.png)

---

## What it does

Cadence is the support assistant for a fictional project-management SaaS. It demonstrates the three things that separate a production-grade support bot from a generic chatbot:

- **Grounded answers, no hallucination.** It answers only from the product's real knowledge — features, plans, and policies defined in its system prompt. Ask about something that doesn't exist and it says so, then points you to the closest real option, instead of inventing an answer.
- **Clean human handoff.** For anything account-specific (billing, refunds, a bug on your account) it recognizes its limits, explains it can't access accounts, and offers to connect you with a person. No customer gets stuck.
- **A real product experience.** Streaming-style typing, sample-question chips, mobile-friendly UI, and graceful error handling.

Try the sample-question chips on the live demo — especially the refund and "Gantt chart" questions — to see the grounding and handoff behavior in action.

---

## How it works

The React frontend never touches the API key. It sends the conversation to a serverless function (`/api/chat`), which holds the key server-side and calls the Claude API with a system prompt that defines the product knowledge and the bot's behavior (grounding rules, escalation, plain-text formatting). The full system prompt lives in [`api/chat.js`](api/chat.js).

```
React UI  ──►  /api/chat (serverless)  ──►  Claude API
                     │
             holds the API key + system prompt
```

---

## Built with

React · Vite · Vercel Serverless Functions · Anthropic Claude API · JavaScript

---

## Run it locally

```bash
git clone https://github.com/samchill93/cadence-support-bot.git
cd cadence-support-bot
npm install
npm install @anthropic-ai/sdk

# add your key
echo "ANTHROPIC_API_KEY=sk-ant-your-key" > .env

# run frontend + serverless function together
npm install -g vercel
vercel dev
```

Get an API key at [console.anthropic.com](https://console.anthropic.com). The `.env` file is git-ignored, so your key stays private.

---

## What I'd build next

- **RAG:** move the product knowledge into a vector store so answers are retrieved from real documents with source citations, instead of living in the system prompt.
- **Evals:** a scored test set to measure answer quality and catch regressions on every change.
- **Observability:** request-level tracing for tokens, cost, and latency.
