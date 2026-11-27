# Personal OSTEP Tool

A personal, self-paced study tool for *Operating Systems: Three Easy Pieces* (uploaded v0.90 / 2014 edition). The design follows the density and typography of legacy Wikipedia Vector: no custom fonts, thin rules, persistent sidebar, a full-width document layout and an adjustable reference pane.

## Deploy on GitHub Pages

1. Open https://github.com/TimPham622/OSTEP-Learning-Tool/settings/pages .
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose **main** and **/(root)**, then **Save**.
4. Wait for GitHub's deployment to finish (check Actions or the Pages settings).
5. Open https://timpham622.github.io/OSTEP-Learning-Tool/ . The Pages URL is expected, not verified until deployment.
6. In the Textbook pane, select your local v0.90 OSTEP PDF. It is stored in IndexedDB, not uploaded. The reader uses the browser's built-in PDF viewer and printed-page offset; if a browser ignores the page fragment, navigate manually.

No build step, API key, account or server is required for the core site. For local testing:
```sh
git clone https://github.com/TimPham622/OSTEP-Learning-Tool.git
cd OSTEP-Learning-Tool
python3 -m http.server 8000
```
Visit http://localhost:8000. Localhost and the deployed site have separate browser storage.

## Study workflow

- Start at chapter 2. All 39 substantive chapters of the supplied edition are indexed, with 11 dialogues optional. Chapter 47–49 cover distribution. The later editions of OSTEP contain other chapters not in this PDF.
- Read the assigned chapter and attempt its opening problem. Use the theory summary, worked reasoning and investigation. The example is available in the right pane.
- Attempt direct transfer, structural variation and synthesis. Check answers only after attempting; hints refer to the worked example.
- Pass the direct and variation items, quiz (80%), written and synthesis rubrics and practical evidence. Free-form gates are self-assessed; AI feedback is advisory, not a grading authority.
- The next chapter unlocks. Manual unlock is available without awarding mastery. Due reviews do not block progression.
- Review after 1, 3, 7, 14, 30 and 60 days; failing retrieval resets to one day.
- Export progress regularly in Preferences. Local storage can be cleared or evicted. The PDF and model weights are not included in exported progress.
- The current content is a first-pass chapter-level course, with a single worked example and one exercise per tier per chapter. It does not yet constitute the requested detailed subsection curriculum or multiple examples and multiple exercises per tier; the data file is deliberately editable to expand it. Quiz distractors are generated from other chapters and need editorial improvement. Simulations are simplified models, not emulators. Practical exercises require external execution and self-reported evidence.

## Local AI (optional, free)

Your MacBook Pro M5 with 24 GB unified memory is a reasonable starting point for small quantized local models, but memory use and compatibility vary. First use the deterministic checks and rubrics. For browser inference use a recent WebGPU-compatible browser such as Chrome.

### Browser WebLLM

1. Open Preferences, select Browser WebLLM.
2. Default model: Qwen2.5-3B-Instruct-q4f16_1-MLC. If the pinned WebLLM release cannot load this model, check the supported model identifiers in https://github.com/mlc-ai/web-llm and enter a compatible one.
3. Save, open a lesson, select Tutor, and submit an attempt.
4. Initial loading downloads model weights from external hosts; several GB of free storage may be needed. Inference is local. This integration has not been tested on your Mac; use the fallback if unavailable.

### Ollama

Download from https://ollama.com/download/mac and install. Start with:
```sh
ollama pull qwen2.5:7b
```
For a browser origin to access the local API, quit any already-running Ollama instance, then start the server with only the intended origin allowed:
```sh
OLLAMA_ORIGINS="https://timpham622.github.io,http://localhost:8000" ollama serve
```
Leave that terminal running. Keep Ollama bound to loopback; do not expose port 11434 publicly. In Preferences choose Ollama and enter qwen2.5:7b. If the browser blocks the deployed HTTPS site's local connection, run the study tool at localhost as described above. Browser permissions and CORS behavior vary. You can verify Ollama locally with:
```sh
curl http://127.0.0.1:11434/api/tags
```
The tutor sends only the selected chapter theory, worked example, rubric and your question to the local model; it does not send the PDF. No API keys should be placed in this public repository. The browser downloads WebLLM code from an external CDN; review that dependency before entering sensitive information.

## Practical environment: macOS and Linux

For portable POSIX exercises, use macOS Terminal:
```sh
xcode-select --install
clang --version
clang -Wall -Wextra -g example.c -o example
./example
clang -Wall -Wextra -g -pthread threads.c -o threads
```
Use `man 2 fork`, `man 2 open`, `ps`, and Activity Monitor. For allocation debugging, build disposable test programs with `clang -fsanitize=address -g example.c -o example`. Never deliberately exhaust host resources or modify the real filesystem for crash tests.

For Linux-specific exercises, use an ARM64 Ubuntu or Debian VM via UTM (https://mac.getutm.app/), not an x86-only virtual machine. In the VM:
```sh
sudo apt update
sudo apt install build-essential git python3 gdb qemu-system-misc gcc-riscv64-linux-gnu binutils-riscv64-linux-gnu
git clone https://github.com/remzi-arpacidusseau/ostep-homework.git
git clone https://github.com/remzi-arpacidusseau/ostep-projects.git
git clone https://github.com/mit-pdos/xv6-riscv.git
cd xv6-riscv
make qemu
```
Package availability and the required compiler vary by distro and xv6 revision; consult the upstream xv6 README if the toolchain is not found. Use a VM snapshot and disposable directories for experiments. For macOS-specific differences, consult man pages; Linux unnamed POSIX semaphores, /proc and some tracing tools are not portable.

## Source files

- index.html — site entry point
- style.css — legacy Vector-inspired styling
- curriculum.js — chapter content, page ranges, project descriptions
- app.js — navigation, mastery state, PDF import, quizzes and reviews
- labs.js — deterministic interactive models
- tutor.js — optional WebLLM / Ollama adapter

## Content attribution and scope

The original textbook is by Remzi H. and Andrea C. Arpaci-Dusseau, https://ostep.org/. The uploaded book and university Computer Systems materials are not included in this public repo. The site uses original educational prompts and explanations keyed to chapter ranges; use your locally imported PDF for assigned reading and actual excerpts. The learning workflow adapts the supplied pedagogy: opening problem, theory, explicit modelling, isomorphic transfer, structural variation, synthesis and hints. The university material was used only to select assumed prerequisites. Official homework and project repositories are linked, not copied.

## Known limitations / verification

The source has been committed, but a deployed browser session and local AI have not been end-to-end tested. The built-in PDF viewer may vary by browser. Exact text matching may reject equivalent terminology. Written and project assessments are not independently verified. The current course is an initial coverage pass, not a completed textbook-grade learning experience. Expand chapter content and test before relying on mastery as evidence of competence.
