# Memory allocator

Chapters: 14, 17

Logical 128-byte arena, 8-byte aligned reservations, external metadata; stdin alloc N, free OFFSET, check. Print offset or -1 for alloc, ok/error for others.

**Invariant:** Sorted live/free intervals partition arena; first-fit; merge adjacent holes; exact-start free only.

## Milestones
1. Align size safely
2. split first fit
3. free/coalesce
4. invariant checker.

## Acceptance criteria
- Alignment/exhaustion
- double free
- reuse/coalesce
- invalid sizes.

## Debugging
- Draw half-open intervals
- check both neighbors
- avoid integer overflow.

## Run
From repo root: `python3 projects/check.py allocator`. Compile only: `python3 projects/check.py allocator --smoke`. Test a separate edited source with `--source /path/to/solution.c`. The starter intentionally fails behavioral tests.

## Extension
Move metadata inside an aligned arena.
