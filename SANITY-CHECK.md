# Final sanity check and verification

## Verified release

The curriculum and browser implementation at commit [47cbe1b](https://github.com/TimPham622/OSTEP-Learning-Tool/commit/47cbe1bfe26f91eaf32ef05652099f937a242bf6) passed the [verification workflow](https://github.com/TimPham622/OSTEP-Learning-Tool/actions/runs/45971152987) and [Pages deployment](https://github.com/TimPham622/OSTEP-Learning-Tool/actions/runs/45971152977).

| Check | Result |
| --- | --- |
| Node.js regression suite | 163 passed, zero failed |
| Native C starter compilation (Linux CI) | 9/9 passed |
| Chromium browser smoke tests | 8/8 passed |
| Independent calculations from selected existing examples/answers | 47/47 matched |
| Default configurations of interactive models | 33/33 produced results |
| Tutor task contexts | 737 generated contexts covered by regression suite |

The browser tests use a disposable profile, local HTTP server, synthetic one-page PDF and mock tutor transport. They exercise navigation, themes, progress gates, overrides, review, every detailed unit and figure, labs, PDF persistence, notes, projects, progress backup/restore, offline tutor, simulated Ollama, and a narrow viewport. They do not validate the original PDF's visual display on the learner's browser or actual model inference.

## Content coverage correction

The previous 39-chapter coverage statement referred only to numbered substantive chapters, not the complete supplied 675-page PDF. The final inspection identified six further substantive appendices. All 39 original chapter opening positions were checked against the PDF. Added the following units and six original SVG illustrations:

| Appendix | Physical PDF pages | New units |
| --- | --- | --- |
| B — Virtual Machine Monitors | 608–620 | 3 |
| D — Monitors (Deprecated) | 622–634 | 2 |
| F — Laboratory: Tutorial | 637–648 | 2 |
| G — Laboratory: Systems Projects | 649–652 | 1 |
| H — Laboratory: xv6 Projects | 653–655 | 1 |
| I — Flash-based SSDs | 656–675 | 4 |

The original numbered material is v0.90; the SSD appendix carries a v0.91 footer. Numbered chapters and substantive appendices now total 45 entries and 103 detailed units, with 206 worked examples, 412 required direct/variation exercises, 515 quiz questions, 103 synthesis prompts, 45 figures, 33 labs and 12 project kits. The 16 optional full-trace tasks remain separate. Dialogues (including A, C, E) are optional. The appended project chapters explain their source project suggestions, but not every suggested project has a complete starter kit.

## Corrections

- Aligned scheduler tie-breaking with the C project (lower job ID for equal SJF/STCF priority); defined SSTF equal-distance tie behavior.
- Fixed FIFO/LRU/OPT frame placement and deterministic OPT tie handling; rejected blank simulator input and false/blank-like quiz inputs.
- Recomputed mastery after restoring progress instead of trusting stale chapter flags. Added validation and preserved the raw saved JSON when restore fails.
- Clarified several worked-example references and terms, including use-after-free, priority, mutual exclusion, condition loops, UDP socket type, cold full-file reads and idempotence.
- Checked selected historical VAX, RAID and NFS/AFS descriptions against the supplied PDF. Independently recomputed 47 selected numerical results across scheduling, memory, storage and distributed cost examples.
- Added the actual Node and Chromium checks to GitHub Actions. An initial run failed at dependency installation because the Playwright pin was unavailable; corrected the pin and reran successfully.

## Remaining limits

This is a targeted technical and structural review, not a formal proof of every factual statement, worked example, distractor or pedagogical claim. Use the assigned textbook sections as the authoritative source, especially for historical mechanisms; the simulators are simplified teaching models. Real WebLLM/Ollama inference and coaching quality, local GPU memory, native macOS behavior, completed C solutions, and xv6 kernel/guest execution on the target machine remain unverified. The three xv6 tests require learner implementations. Written and project mastery remains self-assessed. GitHub reports successful Pages deployment, but direct external access to the public URL was unavailable from the development environment. The real browser test used the checked-out source, not the public deployment.

## Reproduce

```sh
npm test
python3 projects/check.py all --smoke
python3 -m pip install playwright==1.65.2
python3 -m playwright install chromium
python3 tests/browser_smoke.py
```

On Linux CI the workflow also installs Chromium system dependencies with `--with-deps`. The intentionally incomplete starters are expected to fail their behavioral tests until implemented. For local model acceptance use [AI-TUTOR.md](AI-TUTOR.md).
