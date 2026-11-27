# CPU scheduler simulator

Chapters: 7, 8, 9

CLI POLICY QUANTUM ARRIVAL:BURST...; FIFO/SJF/STCF/RR; output id completion response (ID starts 0). At tick, enqueue arrivals in ID order before expired RR task; smaller ID tie except queue order. One CPU, integer ticks, zero overhead.

**Invariant:** No service before arrival; total service equals burst; first response = first dispatch − arrival.

## Milestones
1. Parse workloads
2. FIFO/SJF
3. STCF/RR
4. trace and compare metrics.

## Acceptance criteria
- Idle gaps
- ties
- preemption
- quantum boundary
- malformed input.

## Debugging
- Trace remaining times
- do not confuse response and turnaround
- idle does not consume service.

## Run
From repo root: `python3 projects/check.py scheduler`. Compile only: `python3 projects/check.py scheduler --smoke`. Test a separate edited source with `--source /path/to/solution.c`. The starter intentionally fails behavioral tests.

## Extension
Implement MLFQ with boosts and allotments.
