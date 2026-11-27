# Local AI tutor: setup, privacy and verification

The tool has three modes: browser WebLLM (preferred), local Ollama, and deterministic offline study guidance. None needs a paid API. The assistant is advisory and does not change mastery, quiz scores or project evidence. The model sees the selected unit's theory, structural anatomy, numbered worked examples, the specific task, the attempt you enter, and the applicable rubric. It does not receive the imported PDF, entire progress record, private study notes or exercise answer-key fields. The model can still infer an answer or produce incorrect feedback; the prompt discourages solution disclosure, but this is not a guarantee.

## 1. Browser WebLLM

Open Preferences and choose Browser WebLLM. Start with Qwen2.5-3B-Instruct-q4f16_1-MLC. Select Discover models to read the catalog from the pinned WebLLM 0.2.79 library. The model IDs available in that version may differ from the current online catalog. Use a recent Chrome browser with hardware acceleration and WebGPU support. Test inference explicitly; first use can download several GB, depending on model. The test sends a nonpersonal sentinel prompt and checks the exact returned token. Test coaching contract then requests structured coaching on a fixed lost-update example and displays the result; inspect its correctness and whether it leaks the answer.

A dedicated worker isolates inference from the page. Cancel terminates the worker; Release browser model also terminates it. Model artifacts can remain cached by the browser; releasing the worker does not delete downloaded weights or guarantee immediate reclamation of every GPU allocation. To switch to a larger browser model (e.g. Qwen2.5-7B-Instruct-q4f16_1-MLC), first confirm its availability in the pinned catalog. Model support, shader features, browser storage quotas and actual memory pressure must be checked on the Mac. The library and weights are fetched from external hosts; the intended inference is local, but the browser executes third-party JavaScript. Review those dependencies before sending sensitive information. Offline mode loads neither library nor weights.

Official references:
- [WebLLM built-in catalog](https://webllm.mlc.ai/models/)
- [WebLLM API](https://webllm.mlc.ai/docs/user/api_reference.html)
- [Worker usage](https://webllm.mlc.ai/docs/user/advanced_usage.html)

## 2. Ollama on your M5 MacBook Pro (24 GB)

Install Ollama from https://ollama.com/download/mac. Prefer the locally hosted clone when using Ollama: this avoids granting a public Pages origin access to your local server and is less susceptible to cross-origin restrictions.

After closing the Ollama menu-bar app and any existing server, start a local-only server in a terminal:

```sh
OLLAMA_HOST=127.0.0.1:11434 OLLAMA_NO_CLOUD=1 OLLAMA_ORIGINS=http://127.0.0.1:8000 ollama serve
```

In a second terminal:

```sh
ollama pull qwen2.5:7b
curl http://127.0.0.1:11434/api/tags
cd /path/to/OSTEP-Learning-Tool
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/#settings, choose Ollama, click Discover models, enter qwen2.5:7b, save and run both tests. Confirm the server logs show that cloud features are disabled. Do not expose port 11434 to other devices, use a tunnel, set an all-origins wildcard, or enter secrets. Use the exact origin shown in the browser address bar. The website rejects cloud-named models and models that expose remote metadata, but a client cannot guarantee that an arbitrarily configured server never forwards data; the server-side local-only setting matters.

If you specifically want the GitHub Pages origin to call Ollama, restart Ollama with OLLAMA_ORIGINS="https://timpham622.github.io,http://127.0.0.1:8000" and the same loopback and no-cloud variables. Origin permission is origin-wide, not path-specific; only allow an origin you trust. Your browser may require local-network permission or still block the request. If so use localhost, rather than disabling browser security. Progress/PDF caches differ across origins: export from the old site, import on the new site, re-import the PDF if needed.

The Ollama adapter uses /api/tags to require the selected model to be installed and /api/chat with streaming off, thinking off, 8192-token requested context, at most 650 output tokens, 5-minute keep-alive and request timeout. These are requested settings, not measured resource limits. Cancel aborts the client HTTP request; server cleanup may be asynchronous. To unload use `ollama stop MODEL`; `ollama ps` shows loaded models. The app does not download Ollama weights automatically.

### Model choices for the 24 GB machine

| Model | Published model size | Purpose |
|---|---:|---|
| qwen2.5:7b | 4.7 GB | Baseline, supported existing setup |
| qwen3.5:4b | 3.4 GB | Lower-memory alternative |
| qwen3.5:9b | 6.6 GB | First quality upgrade to try |
| qwen3:14b | 9.3 GB | Optional larger experiment if memory pressure permits |

Sizes refer to published downloads, not peak unified-memory use; context/KV cache, runtime, browser, OS and VM memory add overhead. These are suggestions, not measured quality/speed results on the M5. Close the Linux VM and other memory-heavy applications when testing larger models. Start with one loaded model and keep the context bounded. Compare the same exercises before picking a model; a bigger model may still fail the coaching contract.

Official references: [Ollama FAQ](https://docs.ollama.com/faq), [chat API](https://docs.ollama.com/api/chat), [model list API](https://docs.ollama.com/api/tags), [Qwen2.5](https://ollama.com/library/qwen2.5), [Qwen3.5](https://ollama.com/library/qwen3.5), [Qwen3](https://ollama.com/library/qwen3).

## 3. Coaching modes

- From a Tier 1/2 exercise, Ask tutor opens a prefilled task. It carries the mapped example and step range, or the explicit theory/prerequisite mapping. The model is instructed to identify one unsupported transition, cite a real step and ask a targeted question, without a solution.
- Full-trace coaching uses the selected task and its first listed example mapping. For a task referencing several examples, this first mapping is the enforced anchor, not an assertion that only that example matters.
- Opening and synthesis review returns per-criterion supported/missing/uncertain guidance. Supported claims must include a verbatim learner quote. The validator checks evidence presence and criterion IDs, not the semantic truth of the claim. It cannot grade a proof or identify every answer leak.
- New concept question clears the selected task and lets you ask about the active unit. The tutor is not a general web chatbot.
- Offline hint uses actual mapping metadata and a deterministic question/checklist; it cannot judge semantic correctness. Failed generation, malformed JSON, fabricated references or quotations, missing rubric entries and transport errors use this fallback. The UI labels its source; no fallback calls a remote inference service.
- Drafts and feedback are held in tab memory, not persisted to GitHub or the exported progress. Changing the lesson/pane cancels current work. Your existing written answers/progress are still locally stored by the lesson itself.

## 4. Manual acceptance matrix

For each model record the model ID, browser version, whether Test inference passes, whether Test coaching contract passes structural checks, and qualitative notes. Try these examples:

| Test | Expected behavior |
|---|---|
| Chapter 26b direct exercise, wrong lost-update reasoning | Correct mapped step, asks about load/store or shared state, no final answer |
| Chapter 18a direct exercise, justified partial trace | Identifies a supported transition and asks about next translation step |
| Chapter 30b synthesis with only count invariant mentioned | Addresses all supplied rubric criteria, quotes actual learner text for supported ones, missing/uncertain otherwise |
| Chapter 48c explanation | Distinguishes server state from cached attributes, without inventing current NFS guarantees |
| Missing model, stopped server, unavailable WebGPU, or invalid JSON | Labeled deterministic fallback; no mastery change |
| Cancel during generation or first model load | Stale output does not appear; next request can be attempted |
| Offline mode with network disabled after page loaded | Numbered hint or rubric self-check without model calls |

Do not equate the sentinel or structural contract test with learning quality. Review the exact answer key separately only after attempting.

## 5. Automated tests and remaining limitations

Run `npm test` in the local repository. The tutor regression suite exercises validation, prompt scope, offline behavior, simulated Ollama responses, a simulated WebLLM worker, cancellation, model discovery and 646 contexts generated from all 90 detailed learning units. These are transport/logic tests, not actual GPU inference or proof of correctness of model feedback. No actual model weights were downloaded or run during this development phase. The pinned CDN package and browser-worker compatibility still require live verification; if the model catalog cannot load, use the Ollama or offline backend, and record the error for the browser-testing phase. No performance claims are based on benchmarks of your machine.
