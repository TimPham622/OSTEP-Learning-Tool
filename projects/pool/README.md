# Thread pool

Chapters: 27, 30, 31, 32

CLI WORKERS CAPACITY TASKS. Producer enqueues integers 1..TASKS then closes; workers drain and return private totals. Output COUNT SUM.

**Invariant:** 0 <= count <= capacity; closed and empty ends worker; every task exactly once.

## Milestones
1. Ring buffer
2. while predicates
3. close and broadcast
4. join and aggregate.

## Acceptance criteria
- Capacity one
- zero tasks
- wraparound
- workers > tasks
- stress.

## Debugging
- A wake is not a reservation
- join outside lock
- persistent closed predicate.

## Run
From repo root: `python3 projects/check.py pool`. Compile only: `python3 projects/check.py pool --smoke`. Test a separate edited source with `--source /path/to/solution.c`. The starter intentionally fails behavioral tests.

## Extension
Multiple producers and owned payloads.
