# Reliable loopback RPC

Chapters: 36, 47, 48, 49

UDP only 127.0.0.1. Server: server normal|drop-first; bind ephemeral port, print port and flush. Client: client PORT ID inc|set. ASCII request ID OP, reply ID VALUE. Timeout 200 ms, max 5 attempts, same ID. Counter initially 0; inc adds 1, set assigns 1. Cache last 128 distinct IDs/results, reject mismatched op on reuse. Drop first executed reply once.

**Invariant:** Duplicate ID does not repeat effect; verify peer and reply ID; volatile cache not durable exactly-once.

## Milestones
1. Bounded parsing and loopback bind
2. client timeout/retry
3. cache result
4. deliberate lost reply test.

## Acceptance criteria
- Normal/duplicate/distinct IDs
- set
- drop-first
- bounded timeout.

## Debugging
- Keep request ID stable
- validate recvfrom peer
- bind only loopback.

## Run
From repo root: `python3 projects/check.py rpc`. Compile only: `python3 projects/check.py rpc --smoke`. Test a separate edited source with `--source /path/to/solution.c`. The starter intentionally fails behavioral tests.

## Extension
Persist dedup state and effects together in toy log.
