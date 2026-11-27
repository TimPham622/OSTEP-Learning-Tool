# Pedagogical audit and visual learning aids

Historical scope: the 39 numbered substantive chapters and 90 detailed units in Personal OSTEP Tool. The subsequent [final sanity check](SANITY-CHECK.md) added six substantive appendices (13 units) and verified the expanded release with Node.js and Chromium. Basis: the supplied OSTEP PDF (675 physical pages), its table of contents, and the user's mathematical pedagogy Markdown. Dialogues and front matter are outside the detailed assessment path.

## Findings and changes

| Area | Finding | Implemented change |
|---|---|---|
| Coverage | All 299 numbered section headings in the substantive chapters occur in the lesson section ranges. One physical page, 378, was outside those ranges; it is a bibliography page, not omitted theory. | Extended unit 31c's reading range; added explanations in eight underdeveloped units after comparing source sections: signals, the no-oracle limitation, ticket mechanisms, historical Linux schedulers, segmentation granularity, futex wait/wake, RAID performance, and latent sector errors during rebuild. |
| Opening and theory | All units have a motivating problem and 2–3 guiding questions, but theory was frequently compact and structural decomposition was not explicit. | Added an anatomy explanation and two targeted metacognitive strategy notes to each of the 90 units. |
| Worked examples | Existing steps sometimes omitted inline reasons (31 lines, many of them initial conditions); some direct questions lacked an adequate matching example. | Added reasons and supplemental steps; separated explanations visually from operations. The 180 examples now contain 772 numbered annotated steps. |
| First-order practice | Automatic alternating example labels did not reliably match the question. Several exercises primarily tested recall rather than full reasoning. | All 180 required direct exercises have explicit example/step references; 16 selected units have optional full-trace transfer tasks, answers and bridge hints. Learners can save transfer reasoning and request tutor feedback. |
| Structural variation | Some questions adapt an example; others deliberately rely on theory or a prerequisite. | Explicit reference metadata for all 180 variation exercises: 155 use worked examples; 25 use theory/prerequisites. |
| Synthesis and self-check | Existing multi-part prompts and rubrics were retained; answers were scattered next to exercises. | Consolidated answer key with exact direct/variation answers, further hints, optional trace solutions and synthesis criteria. |
| Coaching | Hints could reveal the result immediately or direct the learner to an arbitrary example. | Structural hint first, stronger hint separately, focused reference pane, tutor prompt with selected exercise and attempted reasoning. Local model feedback remains advisory. |
| Quiz quality | Repeated choice rotation made positions predictable; missed items were weakly diagnosed. | Deterministic per-attempt permutation and targeted missed-item review; existing 80% gate retained. |
| Learning visuals | Text-only worked examples increased the effort needed to track states. | 39 original SVG figures, one per substantive chapter, tied to a unit and example. Eight have dedicated graphical encodings (process states, fork tree, Gantt bars, address translation, clock cycle, wait-for graph, parity stripe and message sequence). All include captions and accessible labels. |

## Verification and limits

The audit checks structural conformance across all 90 units, not every factual claim or every possible exercise answer. Numbered section/page range coverage is not the same as complete explanation of every concept in a section. Targeted content review was carried out on the eight units above; additional detailed editorial comparison of each section, distractor quality, proof completeness and native exercises remains advisable. The diagrams are explanatory schematic models, not hardware specifications.

All graphics are original, generated from local SVG markup in figures.js. No third-party images or Wikipedia assets were copied, so there are no external image dependencies or attribution requirements. For future Wikimedia Commons additions, record the exact file URL, author, license/version and any modifications before reuse.

Existing unit IDs, answer keys and required mastery gates remain stable. The optional trace tasks are not additional gates. Written reasoning and synthesis still rely on learner rubric assessment and optional AI feedback. The tests inspect rendering strings and source logic, not real browser layout, assistive-technology output, model inference or actual C execution.

Regression definitions: tests/curriculum.test.js. Run npm test in a local clone. The fetched source was tested in a JavaScript harness: 119 cases and 4,241 assertions passed before the final targeted content supplements; the final test rerun is recorded in the README.
