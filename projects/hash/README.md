# Concurrent hash table

Chapters: 27, 28, 29

CLI THREADS ITERATIONS KEYS. Each worker increments i % KEYS for i=0..ITERATIONS-1. Four buckets with chaining and mutexes. Output ascending key count lines including zero counts.

**Invariant:** Each increment contributes once; stable arguments; join before destruction.

## Milestones
1. Sequential insert/find
2. per-bucket lock
3. worker creation/join
4. cleanup and verification.

## Acceptance criteria
- Collision
- zero iterations
- uneven counts
- concurrent stress.

## Debugging
- Lock entire lookup/insert/update
- never share changing loop index as worker arg.

## Run
From repo root: `python3 projects/check.py hash`. Compile only: `python3 projects/check.py hash --smoke`. Test a separate edited source with `--source /path/to/solution.c`. The starter intentionally fails behavioral tests.

## Extension
Compare coarse and per-bucket locking.
