# xv6 scheduling

Chapters: 7, 8, 9, 10

Add int ostep_ticks(void) returning caller cumulative dispatch count (not elapsed ticks), then implement a policy variant such as stride.

**Invariant:** Preserve RUNNABLE/RUNNING and scheduler locking; initialize per-process counts.

## Milestones
1. Baseline CPUS=1
2. instrument dispatch and syscall
3. compare CPU-bound and blocking workloads
4. implement policy and measure.

## Acceptance criteria
- Positive/nondecreasing count
- child independent
- usertests on one CPU and SMP
- fairness and response evidence.

## Debugging
- Account before policy change
- do not hold multiple proc locks across swtch.

## Run
Copy supplied source to user/ of your own xv6 checkout, add $U/_ostepdispatch_test to UPROGS, implement the documented API, build with make qemu, run ostepdispatch_test and usertests. Use the upstream instructions and your recorded revision.

## Extension
Add service-tick accounting and weighted workloads.
