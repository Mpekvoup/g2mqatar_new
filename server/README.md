# Contact API

Production starts with `npm start`: the Node server serves `dist` and handles
`POST /api/contact` for both contact and investment forms. Railway's existing
`npm run start` command therefore starts the API too.

In the Railway service Variables, set:

```
TELEGRAM_BOT_TOKEN=<new token>
TELEGRAM_CHAT_ID=<destination chat ID>
```

These variables are server-only. Do not prefix them with `VITE_`, commit real
values, or add them to frontend code. Publish the updated source and redeploy
after setting the variables. The bot must have permission to send to the chat.

For local development (Node 22+), add the values to the ignored `.env.local`.
Run `npm run dev`. Vite handles `/api/contact` in the same process and reads
server-only variables from `.env.local`. `vite preview` also includes the API.
Railway variables are not automatically available locally. Restart Vite after
changing local credentials. `dev:api` remains available for standalone API work.

Run `npm run test:contact` for HTTP tests with a mocked Telegram transport.
Tests do not send any messages. Run `npm run build` before production startup.

Validation limits: name 120, contact 254, region 80, message 2500 characters;
request body 16 KiB. Telegram messages use plain text, without HTML parsing.
The API never returns Telegram message data or the bot token.

Rate limits are in memory: 10 attempts/minute per socket address and 100/minute
globally per process. Behind Railway's proxy, clients may share the same socket
address and limit. Forwarded IP headers are deliberately not trusted without a
verified proxy setup. For multiple replicas or higher traffic, use a shared
store and a verified proxy/client-IP policy. Limits reset on process restart.

Deployment checks: `/api/contact` GET should return JSON with HTTP 405, rather
than the SPA HTML. Then test both forms with an explicitly authorized enquiry
and verify receipt in the intended chat. Missing environment variables produce
503 on POST; upstream failures produce 502. No real enquiry was sent in tests.
