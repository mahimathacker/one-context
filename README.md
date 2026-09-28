# OneContext

**OneContext is a developer demo showing how text, image, and audio can be processed
together in a single multimodal inference call using Together AI Serverless and
Inkling.**

Instead of building separate speech-to-text, vision, and reasoning pipelines,
OneContext sends all available context to one natively multimodal model and returns a
validated structured result.

![OneContext showing text, screenshot, audio, and a structured sample result](./public/onecontext-demo.png)

> **Demo status:** The repository contains the live Together and Inkling integration
> path. The public sample configuration uses deterministic demo data because live
> Together inference requires prepaid API credits. Demo mode does not perform AI
> inference.

## What this demonstrates

Product and issue feedback is the sample scenario. The developer lesson is the
architecture behind it.

### Traditional multimodal pipeline

```text
Audio ──→ Speech-to-text ──┐
                           │
Image ──→ Vision model ────┼──→ LLM ──→ Result
                           │
Text ──────────────────────┘
```

### OneContext

```text
Text ───┐
Image ──┼──→ Inkling via Together Serverless ──→ Structured result
Audio ──┘
```

**OneContext does not transcribe audio first and then pass a transcript to another
language model. Inkling receives the text, image, and audio together and reasons over
them within the same multimodal model and inference call.**

## How it works

```text
Browser
  -> Next.js interface
  -> POST /api/analyze
  -> server-side file validation and encoding
  -> Together Serverless / thinkingmachines/Inkling
  -> structured response
  -> Zod validation
  -> results interface
```

The Together API key is used only by the server route and is never exposed to the
browser. At least one input is required, and missing modalities are supported.

## Output contract

The route requests this structure from Inkling and validates it before returning it to
the interface:

```json
{
  "summary": "",
  "intent": "",
  "important_details": [],
  "visual_context": [],
  "audio_context": [],
  "suggested_action": ""
}
```

## Why Together Serverless

OneContext treats inference as an application capability rather than infrastructure the
developer needs to operate. Together Serverless hosts and serves the multimodal model,
while the application sends context only when inference is needed. This keeps the demo
focused on the application workflow instead of model deployment, GPU provisioning, or
inference serving.

## Run locally

Requirements:

- Node.js 20.9 or newer
- npm
- A Together Project API key and credits only when using live inference

Install and create the local environment file:

```bash
npm install
```

```powershell
Copy-Item .env.example .env.local
```

Start the application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Sample mode

Sample mode is the default configuration and requires no API key:

```env
ONECONTEXT_DEMO_MODE=true
```

It validates the submitted form and returns a fixed example labeled
`Sample response: no inference performed`. It does not inspect the uploaded content or
call Together.

### Live mode

```env
TOGETHER_API_KEY=your_project_api_key
ONECONTEXT_DEMO_MODE=false
```

Live mode requires a valid Together Project API key and sufficient prepaid credits. Do
not expose the key through a `NEXT_PUBLIC_` variable.

## Example input

- Text: `This account cannot access the storefront, although the supplied password appears correct.`
- Screenshot: a login page showing an account-locked error
- Voice note: a WAV recording explaining that the issue occurs in Chrome while another account works

Accepted inputs:

- Text up to 4,000 characters
- PNG, JPEG, or WebP image up to 5 MB
- WAV audio up to 10 MB

WAV support is intentional. The purpose is to demonstrate native multimodal reasoning in
one inference call, not audio transcoding.

## Limitations

- This is a technical demo, not a production issue-management product.
- It has no database, authentication, agents, RAG, queues, or persistent file storage.
- Sample mode returns fixed data and performs no AI inference.
- Live inference requires a valid Together Project API key and prepaid credits.
- Hosting platforms may impose request-size limits below the application limits.
- Model output can vary and should be reviewed before use.

## References

- [Together Inkling model](https://www.together.ai/models/inkling)
- [Together structured outputs](https://docs.together.ai/docs/inference/chat/structured-outputs)
- [Together vision input modes](https://docs.together.ai/docs/inference/vision/inputs)

Run project checks with:

```bash
npm run typecheck
npm run lint
npm run build
```
