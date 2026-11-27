# Unix utilities

Chapters: 4, 5, 39

Implement cat FILE..., grep PATTERN FILE (literal text matching), and rle FILE (binary count/value byte pairs, max count 255). No matches is success.

**Invariant:** Preserve bytes and order; split runs at 255; close every file.

## Milestones
1. Stream cat
2. literal grep with getline
3. binary RLE
4. error paths.

## Acceptance criteria
- Empty and multiple files
- binary NUL
- missing file
- grep no match
- long RLE run.

## Debugging
- Use cmp rather than terminal display
- avoid strlen for binary
- check read/write errors.

## Run
From repo root: `python3 projects/check.py utilities`. Compile only: `python3 projects/check.py utilities --smoke`. Test a separate edited source with `--source /path/to/solution.c`. The starter intentionally fails behavioral tests.

## Extension
Implement decoder and round-trip tests.
