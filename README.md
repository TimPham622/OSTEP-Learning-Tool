# Personal OSTEP Tool

A personal, self-paced study tool for *Operating Systems: Three Easy Pieces* (uploaded v0.90 / 2014 edition). The design follows the density and typography of legacy Wikipedia Vector: no custom fonts, thin rules, persistent sidebar, a full-width document layout and an adjustable reference pane.

## Deploy on GitHub Pages

1. Open https://github.com/TimPham622/OSTEP-Learning-Tool/settings/pages .
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose **main** and **/(root)**, then **Save**.
4. Wait for GitHub's deployment to finish (check Actions or the Pages settings).
5. Open https://timpham622.github.io/OSTEP-Learning-Tool/ . The Pages URL is expected, not verified until deployment.
6. In the Textbook pane, select your local v0.90 OSTEP PDF. It is stored in IndexedDB, not uploaded. The reader uses the browser's built-in PDF viewer and verified physical PDF page ranges; if a browser ignores the page fragment, navigate manually.

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
- Review each mastered detailed unit (or compact chapter) independently after 1, 3, 7, 14, 30 and 60 days; failing retrieval resets that item's interval to one day.
- Export progress regularly in Preferences. Local storage can be cleared or evicted. The PDF and model weights are not included in exported progress.
- All 39 substantive chapters (2, 4–10, 13–23, 26–33, 36–44 and 47–49) now have 90 detailed, sequential learning units (16 introduction/CPU, 24 memory, 20 concurrency, 21 persistence, 9 distribution) with two annotated worked examples, two direct-transfer exercises, two variation exercises, one multipart synthesis, and five topic-specific quiz questions each. All substantive chapters now use the detailed renderer and topic-specific quizzes; a first structural and targeted pedagogical audit is documented in PEDAGOGY-AUDIT.md. Simulations are simplified models, not emulators. Practical exercises require external execution and self-reported evidence.

## Local AI (optional, free)

Your MacBook Pro M5 with 24 GB unified memory is a reasonable starting point for small quantized local models, but memory use and compatibility vary. First use the deterministic checks and rubrics. For browser inference use a recent WebGPU-compatible browser such as Chrome.

### Local AI setup

See [AI-TUTOR.md](AI-TUTOR.md) for the full Mac setup, model selection, privacy constraints and manual acceptance matrix. Preferences now offers Browser WebLLM, loopback Ollama and offline guidance, model discovery, inference and coaching-contract diagnostics, cancellation and browser model release. WebLLM remains pinned at 0.2.79; actual model availability is read from its loaded catalog. For Ollama, prefer the local clone and start the server with OLLAMA_HOST=127.0.0.1:11434, OLLAMA_NO_CLOUD=1 and the exact trusted local origin as described in the guide. No cloud or paid API fallback is configured.

The tutor receives only the selected unit context, task and learner attempt; no imported PDF or answer-key fields are passed. It checks structured reference IDs and rubric quotations, not semantic correctness. It never updates mastery or marks a learner's reasoning correct automatically. Failed AI responses use labeled deterministic study guidance. Actual GPU inference, browser rendering and model quality on the Mac are not yet verified.

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
- reading.js — physical PDF page ranges verified against the supplied PDF
- cpu-depth.js — expanded introduction and CPU virtualization content
- memory-depth.js — expanded memory virtualization content
- concurrency-depth.js — expanded concurrency content
- persistence-depth.js — expanded storage and persistence content
- distribution-depth.js — expanded distributed communication, NFS and AFS content
- depth.js — shared detailed-unit renderer and mastery rules
- tests/curriculum.test.js — automated regression checks

## Content attribution and scope

The original textbook is by Remzi H. and Andrea C. Arpaci-Dusseau, https://ostep.org/. The uploaded book and university Computer Systems materials are not included in this public repo. The site uses original educational prompts and explanations keyed to chapter ranges; use your locally imported PDF for assigned reading and actual excerpts. The learning workflow adapts the supplied pedagogy: opening problem, theory, explicit modelling, isomorphic transfer, structural variation, synthesis and hints. The university material was used only to select assumed prerequisites. Official homework and project repositories are linked, not copied.

## Known limitations / verification

The source has been committed, but a deployed browser session and local AI have not been end-to-end tested. The built-in PDF viewer may vary by browser. Exact text matching may reject equivalent terminology. Written and project assessments are not independently verified. All substantive chapters have received detailed expansions and a structural/targeted pedagogical audit; further editorial review and end-to-end verification remain. The expanded project track is described below. The automated tests validate data structure, gating, answer matching, scoring and representative simulator traces; they do not validate every pedagogical statement or a live browser session.

## Detailed learning units (current expansion)

| Chapter | Units |
| --- | --- |
| 2 | Virtual resources and system calls; concurrency, persistence and design goals |
| 4 | Process creation; state transitions and process lists |
| 5 | fork/wait; exec, file descriptors and shell composition |
| 6 | Restricted operations and traps; timer interrupts and context switching |
| 7 | FIFO/SJF; STCF; response, RR and I/O |
| 8 | Feedback priorities; starvation, boosts and gaming tolerance |
| 9 | Lottery and stride scheduling |
| 10 | Caches and affinity; single and multiple queues |

| 13 | Address spaces and isolation |
| 14 | Allocation/lifetime/ownership; memory errors and OS support |
| 15 | Base/bounds relocation; OS responsibilities and context switches |
| 16 | Segment selection; downward stacks, protection and fragmentation |
| 17 | Free lists; fit policies and fragmentation |
| 18 | Address decomposition; page tables and access cost |
| 19 | TLB locality; refill, ASIDs and replacement |
| 20 | Flat and hybrid tables; two-level walks; inverted/pageable tables |
| 21 | Present bits and faults; eviction and background reclaim |
| 22 | OPT/FIFO; random/LRU; clock and thrashing |
| 23 | VAX/VMS mapping; segmented FIFO; demand zeroing and copy-on-write |
| 26 | Thread state and sharing; lost updates and atomicity |
| 27 | Creation/join/lifetime; mutex and condition-variable APIs |
| 28 | Lock correctness and interrupt masking; atomic primitives; ticket and sleeping locks |
| 29 | Precise/approximate counters; lists, queues and hash tables |
| 30 | Predicate waits; bounded buffers; covering conditions |
| 31 | Permits and ordering; semaphore buffers; reader-writer locks and dining philosophers |
| 32 | Atomicity/order violations; deadlock prevention; avoidance/detection/recovery |
| 33 | Readiness and select/poll; asynchronous I/O and continuation state |
| 36 | Device interfaces, polling, interrupts, DMA; device drivers and IDE |
| 37 | HDD geometry and timing; disk scheduling |
| 38 | RAID striping/mirroring; parity and small writes |
| 39 | File descriptors and offsets; durability and directories; links and mounts |
| 40 | On-disk layout and inodes; access paths, allocation and caching |
| 41 | Cylinder groups and locality; large files and fragments |
| 42 | Interrupted updates and FSCK; journaling; alternative consistency designs |
| 43 | Sequential writes and buffer sizing; inode maps; cleaning and recovery |
| 44 | Failure modes and checksums; misdirection, lost writes and scrubbing |
| 47 | UDP and integrity; acknowledgments, retries and sequence counters; RPC |
| 48 | Stateless NFSv2 file handles; idempotent retry and stable writes; cache consistency |
| 49 | AFSv1/v2 and callbacks; session consistency and recovery; workload performance |

Each unit has independent mastery checks, written reasoning, practical evidence, and its own spaced repetition schedule. A chapter is mastered only when all its units are mastered. Overrides unlock without awarding mastery. Existing chapter-level attempts are retained; previously mastered expanded chapters require the new checks and retain their previous mastery history. Export a backup before substantial updates.

### Regression tests

With Node.js installed (no npm dependencies required), clone the repository and run:

```sh
npm test
```

The suite checks PDF range containment, unique unit identifiers, exercise and quiz structure, accepted answers, blank answer rejection, mastery thresholds, prerequisite unlocks, overrides and representative scheduling, page replacement, clock, free-list allocation, segmentation, two-level page-table traces, lock ownership, ticket ordering, semaphore permits, condition-variable wakeups, event-loop latency, disk timing, RAID mapping, inode allocation, crash recovery, log liveness and integrity checks. Browser rendering, IndexedDB import, deployment and local AI still require manual testing.

### Memory laboratory additions

- **Segmentation:** select a segment using high address bits, compute upward/downward displacements, check exclusive bounds.
- **Free-list allocation:** trace allocation/free commands with first, best and worst fit, split and coalesce holes, observe fragmented failures. Excludes alignment and header overhead unless worked separately.
- **Two-level page-table walk:** enter physical directory/table bases and PFN mappings; inspect directory/leaf indices, PTE addresses, final physical address and invalid mappings. A simplified two-level table, without TLB or permission modelling.
- **Clock replacement:** trace frame contents, reference bits, hand movement, cleared bits and victims. New pages set their reference bit and advance the hand in this model.

Use assigned sections in your imported PDF for the source theory; the worked workloads are original examples. Native memory experiments should use bounded allocations; do not force host swapping. Earlier compact mastery and answers are retained in local history, but expanded chapters must satisfy the new unit gates. Export a backup before updating if you have progress you wish to retain.

### Concurrency laboratory additions

- **Check/set versus atomic exchange:** select individual thread operations and observe the flag, owners and mutual-exclusion violations. Illustrative instruction-level model, not a definition of C data-race behaviour.
- **Ticket lock:** trace arrivals, tickets, current turn, ownership and FIFO admission. Assumes no wraparound or abandoned tickets.
- **Semaphore wait/post:** trace stored permits, blocked threads and direct handoffs. FIFO handoff is a teaching convention, not a portable POSIX guarantee.
- **Condition wait and stolen wakeup:** trace count, sleeping consumers and woken consumers, who explicitly retry under a mutex. Producer blocking is excluded from this model.
- **Event loop:** compare blocking versus asynchronous disk work and unrelated socket response delay; assumes zero handler overhead and nonblocking async submission.

The concurrency lessons include original counterexamples and C investigations. Use portable pthread APIs on macOS; use the Linux VM for unnamed POSIX semaphores and Linux-specific experiments. Keep intentionally deadlocking traces on paper or in the browser model rather than hanging native programs. Written arguments and practical evidence are self-assessed; automated checks validate model behaviour and data structure, not every teaching claim or browser flow.

### Persistence laboratory additions

- **HDD timing:** computes mean rotational delay, transfer time, total modeled access time and effective bandwidth. Uses decimal MB/s and uniform rotational position; not an SSD latency model.
- **RAID mapping and parity:** one-block chunks, paired mirroring, dedicated/rotating parity and byte XOR. RAID 5 uses a declared right-to-left parity rotation with ascending data member order; actual layouts can differ.
- **Inodes and bitmaps:** flat namespace, direct data blocks, create/append/unlink, first available allocation and reclamation. No open references or hard links; native link exercises remain separate.
- **Interrupted append:** enumerate durable inode pointer, allocation bit and data writes. Distinguish referenced-free blocks, leaks and reachable stale data.
- **Journal recovery:** data journaling, ordered metadata journaling and an intentionally unsafe ordering; compare recovered state at each durability stage. Models full-block redo, atomic block writes and durable commit, not actual storage.
- **Log liveness:** append new values and identify current versus obsolete versions by stable logical identity.
- **Integrity:** compare additive and CRC32 checksums, independently expected identity and version. Illustrates collisions, misdirection and stale writes without touching real storage devices.

Native exercises use disposable directories and bounded files only. Never simulate crashes by interrupting real filesystem writes. Durability guarantees depend on platform and device semantics; the historical HDD and FFS models should not be assumed to describe APFS. The regression suite currently covers 115 test cases, including 90 detailed units. Run npm test locally; live browser, local model inference and native C exercises still require end-to-end verification.

### Distributed systems laboratories

- **Message and RPC retry:** one outstanding request ID, lost requests/replies, server downtime and restart, duplicate suppression, set versus increment. Volatile duplicate state disappears on restart; modeled effects persist. This does not imply real exactly-once execution.
- **NFS file handles:** one file, two-byte reads, client-local offsets, server restart and inode generation reuse.
- **NFS stable WRITE:** compare durable acknowledgment with the intentionally unsafe volatile acknowledgment that loses the middle block after a crash.
- **NFS cache:** one file, explicit open/read/write/close, simulated attribute TTL and version validation. Whole-value updates stand in for block updates; no refresh during an open session.
- **AFS callbacks:** one file and independent client sessions, close publishes a dirty copy, invalidation and last-closer-wins, detected server restart makes callbacks suspect. Existing open sessions are not forcibly refreshed.
- **NFS/AFS costs:** historical per-block model from chapter 49; vary cache fit, workload and network/disk/memory cost. Not a benchmark of current protocol versions.

The detailed curriculum now spans all 39 substantive chapters: 90 units, 180 worked examples, 180 direct-transfer exercises, 180 variation exercises, 90 multipart synthesis prompts and 450 quiz questions. The Laboratory contains 33 teaching models. The regression test definitions were executed against the fetched source in a JavaScript test harness (115 cases, 1,533 assertions); actual Node npm test and live browser flows have not been independently executed here. Subsequent phases added a structural pedagogical audit and expanded practical project kits; browser and local AI verification remain.

### Pedagogical audit and visual learning aids

See [PEDAGOGY-AUDIT.md](PEDAGOGY-AUDIT.md). All 90 units now include topic-specific structural anatomy, two coach notes, corrected exercise references, progressive hints, a consolidated answer key and 39 original SVG figures across all chapters. Sixteen optional full-trace exercises deepen direct transfer without changing required mastery gates. All 299 numbered section headings are included in the assigned reading ranges; eight underdeveloped units received targeted source-based additions. This does not prove exhaustive conceptual coverage. Latest JavaScript harness rerun: 119 cases and 4,241 assertions, 14 source files syntax-checked. Actual Node runner, browser, native assignments and model inference remain unverified.

## Expanded practical project track

The Projects page now contains 12 staged C and xv6 assignments, with separate specifications, nine compilable but intentionally unfinished native starters and three xv6 guest contract tests. The original nine project indices are preserved; new projects are CPU scheduling, page replacement and reliable loopback RPC. The browser stores local notes, milestone/test checklists and evidence; completion is self-assessed, not automatic execution. Legacy completion is preserved until edited. See [project guide](projects/README.md) and [test runner](projects/check.py). Run `python3 projects/check.py all --smoke` to compile starters, or copy a starter to solution.c and run the named suite with `--source`. Native behavioral tests are expected to fail on the supplied stubs. xv6 tests need your own modified checkout. Do not use real devices or untrusted source; the test runner is not a sandbox.

### Project scaffolding and verification

Each of the 12 projects includes a worked design trace linked to specific learning-unit IDs, a seeded debugging question with a collapsible structural hint, implementation milestones, and a saved evidence checklist. The native test runner defines 45 behavioral cases across nine suites, plus one compilation check per suite. All nine committed native C starters and the Python runner were reconstructed in a local Linux environment and matched against the exact Git blob hashes, then executed: `all --smoke` passed 9/9; the full starter run completed with 13/54 checks passing and nonzero exit, as expected for intentionally incomplete code (41 failures). Completed solutions have not been tested. The 119 existing curriculum regression cases and 14 project cases passed in a JavaScript source harness; 24 additional scaffold assertions passed separately. A direct clone was blocked by DNS/network access. Actual macOS execution, xv6 guest runs, browser UI, and local AI inference are still unverified. For xv6, the three supplied tests exercise syscall copyout, dispatch accounting and read-only PTE inspection; they require the learner's implementation and are not kernel patches.

### Local tutor regression coverage

The new tutor tests cover scoped prompts, allowed model identifiers, exact worked-example references, rubric evidence, deterministic fallback, mocked Ollama and worker transport, cancellation and all 646 task contexts generated from the 90 learning units. See the [AI tutor verification guide](AI-TUTOR.md). The regression tests are not live inference benchmarks.

Phase 9 verification: 12 tutor regression cases and 1,344 assertions passed in a JavaScript source harness against the committed modules, including all 646 curriculum task contexts. The harness used simulated transports and an AbortController substitute, not an actual browser or Node.js test runner. The 11 inspected JavaScript files passed syntax checks; a final app-only input-length guard also passed syntax checking. Actual WebLLM initialization, Ollama generation, GPU memory use, local-network permissions and browser UX remain to be tested on the target machine.
