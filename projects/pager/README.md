# Page replacement simulator

Chapters: 18, 19, 20, 21, 22

CLI FIFO|LRU|OPT|CLOCK CAPACITY PAGE...; output misses. Empty initial frames. CLOCK installs bit 1, hit sets 1, hand advances after insertion/eviction; OPT tie lowest frame index.

**Invariant:** One frame per resident page; hit updates only relevant metadata; no eviction when space exists.

## Milestones
1. Implement FIFO
2. LRU refresh
3. OPT future scan
4. CLOCK and wraparound.

## Acceptance criteria
- Empty trace
- fitting/repeating traces
- FIFO vs LRU
- capacity one
- invalid capacity.

## Debugging
- FIFO hit does not refresh insertion
- clock clears bit rather than evicts
- OPT looks forward.

## Run
From repo root: `python3 projects/check.py pager`. Compile only: `python3 projects/check.py pager --smoke`. Test a separate edited source with `--source /path/to/solution.c`. The starter intentionally fails behavioral tests.

## Extension
Add dirty writeback cost and trace reporting.
