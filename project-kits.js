// Original project curriculum; indices 0–8 retain legacy order.
export const projectKits=[
  {
    "id": "utilities",
    "name": "Unix utilities",
    "chapters": [
      4,
      5,
      39
    ],
    "platform": "native",
    "goal": "Implement cat FILE..., grep PATTERN FILE (literal text matching), and rle FILE (binary count/value byte pairs, max count 255). No matches is success.",
    "invariant": "Preserve bytes and order; split runs at 255; close every file.",
    "milestones": [
      "Stream cat",
      "literal grep with getline",
      "binary RLE",
      "error paths."
    ],
    "checks": [
      "Empty and multiple files",
      "binary NUL",
      "missing file",
      "grep no match",
      "long RLE run."
    ],
    "debug": [
      "Use cmp rather than terminal display",
      "avoid strlen for binary",
      "check read/write errors."
    ],
    "extension": "Implement decoder and round-trip tests.",
    "files": [
      "starter.c"
    ]
  },
  {
    "id": "shell",
    "name": "Unix shell",
    "chapters": [
      5,
      6,
      39
    ],
    "platform": "native",
    "goal": "Batch shell reading stdin, whitespace tokens, one command per line; built-ins cd DIR and exit; one pipeline or one stdout redirect > FILE; operators separate tokens. No quotes/globbing or combined operators.",
    "invariant": "Reap children; close unused pipe ends; cd changes parent directory.",
    "milestones": [
      "Tokenize and execute",
      "wait/error handling",
      "cd/exit",
      "pipe and redirection."
    ],
    "checks": [
      "External commands",
      "failed exec recovery",
      "cd",
      "redirect",
      "repeated pipelines."
    ],
    "debug": [
      "Use stderr for errors",
      "_exit after failed exec",
      "close parent and child pipe ends before wait."
    ],
    "extension": "Add multi-stage pipelines and quoting.",
    "files": [
      "starter.c"
    ]
  },
  {
    "id": "allocator",
    "name": "Memory allocator",
    "chapters": [
      14,
      17
    ],
    "platform": "native",
    "goal": "Logical 128-byte arena, 8-byte aligned reservations, external metadata; stdin alloc N, free OFFSET, check. Print offset or -1 for alloc, ok/error for others.",
    "invariant": "Sorted live/free intervals partition arena; first-fit; merge adjacent holes; exact-start free only.",
    "milestones": [
      "Align size safely",
      "split first fit",
      "free/coalesce",
      "invariant checker."
    ],
    "checks": [
      "Alignment/exhaustion",
      "double free",
      "reuse/coalesce",
      "invalid sizes."
    ],
    "debug": [
      "Draw half-open intervals",
      "check both neighbors",
      "avoid integer overflow."
    ],
    "extension": "Move metadata inside an aligned arena.",
    "files": [
      "starter.c"
    ]
  },
  {
    "id": "hash",
    "name": "Concurrent hash table",
    "chapters": [
      27,
      28,
      29
    ],
    "platform": "native",
    "goal": "CLI THREADS ITERATIONS KEYS. Each worker increments i % KEYS for i=0..ITERATIONS-1. Four buckets with chaining and mutexes. Output ascending key count lines including zero counts.",
    "invariant": "Each increment contributes once; stable arguments; join before destruction.",
    "milestones": [
      "Sequential insert/find",
      "per-bucket lock",
      "worker creation/join",
      "cleanup and verification."
    ],
    "checks": [
      "Collision",
      "zero iterations",
      "uneven counts",
      "concurrent stress."
    ],
    "debug": [
      "Lock entire lookup/insert/update",
      "never share changing loop index as worker arg."
    ],
    "extension": "Compare coarse and per-bucket locking.",
    "files": [
      "starter.c"
    ]
  },
  {
    "id": "pool",
    "name": "Thread pool",
    "chapters": [
      27,
      30,
      31,
      32
    ],
    "platform": "native",
    "goal": "CLI WORKERS CAPACITY TASKS. Producer enqueues integers 1..TASKS then closes; workers drain and return private totals. Output COUNT SUM.",
    "invariant": "0 <= count <= capacity; closed and empty ends worker; every task exactly once.",
    "milestones": [
      "Ring buffer",
      "while predicates",
      "close and broadcast",
      "join and aggregate."
    ],
    "checks": [
      "Capacity one",
      "zero tasks",
      "wraparound",
      "workers > tasks",
      "stress."
    ],
    "debug": [
      "A wake is not a reservation",
      "join outside lock",
      "persistent closed predicate."
    ],
    "extension": "Multiple producers and owned payloads.",
    "files": [
      "starter.c"
    ]
  },
  {
    "id": "fsimage",
    "name": "File system image",
    "chapters": [
      39,
      40,
      42,
      43,
      44
    ],
    "platform": "native",
    "goal": "Regular-file image only. Eight inodes, 32 data blocks of 64 bytes, one block per file, names 1–15 ASCII alnum/underscore, values 0–63 bytes. Commands init IMAGE, put IMAGE NAME VALUE, get IMAGE NAME, rm IMAGE NAME, check IMAGE, put-crash IMAGE NAME VALUE before|after. get prints value + newline; check prints ok.",
    "invariant": "Unique names/blocks and bitmap agreement; explicit byte encoding; temp sibling + rename; simulated before retains old, after publishes new (not physical crash durability).",
    "milestones": [
      "Encode and validate bounded image",
      "allocate/update/remove",
      "check invariants",
      "simulate before/after publication."
    ],
    "checks": [
      "Reopen, replace, remove",
      "capacity and truncated image",
      "before/after crash states."
    ],
    "debug": [
      "Check bounds before indexing",
      "no raw devices",
      "do not overwrite image in-place."
    ],
    "extension": "Multi-block files and redo logging.",
    "files": [
      "starter.c"
    ]
  },
  {
    "id": "xv6-syscall",
    "name": "xv6 system calls",
    "chapters": [
      4,
      5,
      6,
      39
    ],
    "platform": "xv6",
    "goal": "Add int ostep_info(int *out): copy caller PID to valid user memory, return 0; invalid destination returns -1.",
    "invariant": "Never dereference unchecked user pointer; checked copyout.",
    "milestones": [
      "Boot baseline",
      "trace getpid",
      "register syscall/stub/handler",
      "copyout and test."
    ],
    "checks": [
      "Stack and heap destination",
      "invalid high VA",
      "usertests."
    ],
    "debug": [
      "Check local argaddr/copyout signatures",
      "compare syscall table/stub."
    ],
    "extension": "Return structured process stats.",
    "files": [
      "ostepinfo_test.c"
    ]
  },
  {
    "id": "xv6-scheduler",
    "name": "xv6 scheduling",
    "chapters": [
      7,
      8,
      9,
      10
    ],
    "platform": "xv6",
    "goal": "Add int ostep_ticks(void) returning caller cumulative dispatch count (not elapsed ticks), then implement a policy variant such as stride.",
    "invariant": "Preserve RUNNABLE/RUNNING and scheduler locking; initialize per-process counts.",
    "milestones": [
      "Baseline CPUS=1",
      "instrument dispatch and syscall",
      "compare CPU-bound and blocking workloads",
      "implement policy and measure."
    ],
    "checks": [
      "Positive/nondecreasing count",
      "child independent",
      "usertests on one CPU and SMP",
      "fairness and response evidence."
    ],
    "debug": [
      "Account before policy change",
      "do not hold multiple proc locks across swtch."
    ],
    "extension": "Add service-tick accounting and weighted workloads.",
    "files": [
      "ostepdispatch_test.c"
    ]
  },
  {
    "id": "xv6-vm",
    "name": "xv6 virtual memory",
    "chapters": [
      15,
      18,
      19,
      20,
      21,
      23
    ],
    "platform": "xv6",
    "goal": "Add int ostep_pte(uint64 va) returning only V/R/W/X/U bits for mapped user leaf, 0 otherwise; no PFN exposure.",
    "invariant": "Bounds-check MAXVA before walk; walk with alloc=0; never mutate mapping.",
    "milestones": [
      "Trace walk/mappages/freewalk",
      "register inspection syscall",
      "verify permissions",
      "run fork/exit and usertests."
    ],
    "checks": [
      "Text executable/user",
      "stack writable/user",
      "high VA returns 0",
      "no panic."
    ],
    "debug": [
      "Check leaf validity and user bit",
      "no allocation",
      "do not reveal physical addresses."
    ],
    "extension": "Separate branch: COW with refcounts and fault tests.",
    "files": [
      "osteppte_test.c"
    ]
  },
  {
    "id": "scheduler",
    "name": "CPU scheduler simulator",
    "chapters": [
      7,
      8,
      9
    ],
    "platform": "native",
    "goal": "CLI POLICY QUANTUM ARRIVAL:BURST...; FIFO/SJF/STCF/RR; output id completion response (ID starts 0). At tick, enqueue arrivals in ID order before expired RR task; smaller ID tie except queue order. One CPU, integer ticks, zero overhead.",
    "invariant": "No service before arrival; total service equals burst; first response = first dispatch − arrival.",
    "milestones": [
      "Parse workloads",
      "FIFO/SJF",
      "STCF/RR",
      "trace and compare metrics."
    ],
    "checks": [
      "Idle gaps",
      "ties",
      "preemption",
      "quantum boundary",
      "malformed input."
    ],
    "debug": [
      "Trace remaining times",
      "do not confuse response and turnaround",
      "idle does not consume service."
    ],
    "extension": "Implement MLFQ with boosts and allotments.",
    "files": [
      "starter.c"
    ]
  },
  {
    "id": "pager",
    "name": "Page replacement simulator",
    "chapters": [
      18,
      19,
      20,
      21,
      22
    ],
    "platform": "native",
    "goal": "CLI FIFO|LRU|OPT|CLOCK CAPACITY PAGE...; output misses. Empty initial frames. CLOCK installs bit 1, hit sets 1, hand advances after insertion/eviction; OPT tie lowest frame index.",
    "invariant": "One frame per resident page; hit updates only relevant metadata; no eviction when space exists.",
    "milestones": [
      "Implement FIFO",
      "LRU refresh",
      "OPT future scan",
      "CLOCK and wraparound."
    ],
    "checks": [
      "Empty trace",
      "fitting/repeating traces",
      "FIFO vs LRU",
      "capacity one",
      "invalid capacity."
    ],
    "debug": [
      "FIFO hit does not refresh insertion",
      "clock clears bit rather than evicts",
      "OPT looks forward."
    ],
    "extension": "Add dirty writeback cost and trace reporting.",
    "files": [
      "starter.c"
    ]
  },
  {
    "id": "rpc",
    "name": "Reliable loopback RPC",
    "chapters": [
      36,
      47,
      48,
      49
    ],
    "platform": "native",
    "goal": "UDP only 127.0.0.1. Server: server normal|drop-first; bind ephemeral port, print port and flush. Client: client PORT ID inc|set. ASCII request ID OP, reply ID VALUE. Timeout 200 ms, max 5 attempts, same ID. Counter initially 0; inc adds 1, set assigns 1. Cache last 128 distinct IDs/results, reject mismatched op on reuse. Drop first executed reply once.",
    "invariant": "Duplicate ID does not repeat effect; verify peer and reply ID; volatile cache not durable exactly-once.",
    "milestones": [
      "Bounded parsing and loopback bind",
      "client timeout/retry",
      "cache result",
      "deliberate lost reply test."
    ],
    "checks": [
      "Normal/duplicate/distinct IDs",
      "set",
      "drop-first",
      "bounded timeout."
    ],
    "debug": [
      "Keep request ID stable",
      "validate recvfrom peer",
      "bind only loopback."
    ],
    "extension": "Persist dedup state and effects together in toy log.",
    "files": [
      "starter.c"
    ]
  }
];
export const projectScaffolds={
  "utilities": {
    "units": [
      "39a",
      "39b"
    ],
    "trace": [
      "Input bytes A, NUL, B; fread returns 3 even though buffer capacity is 4096.",
      "Write exactly 3 bytes, not strlen(buffer). {The return value is the transferred length.}",
      "If fwrite returns fewer bytes, diagnose output failure rather than reporting success. {Accepted output differs from requested output.}"
    ],
    "bug": "A cat implementation prints chunks with printf(\"%s\", buf). A file contains A, NUL, B. Why does the output differ from the input, and how should the output operation change?",
    "hint": "Use the returned byte count from fread. A zero byte is ordinary binary data; a C string terminator is not an end-of-file marker."
  },
  "shell": {
    "units": [
      "5a",
      "5b",
      "39a"
    ],
    "trace": [
      "For echo hello | cat, create a pipe before either fork. {Both children need the inherited endpoints.}",
      "Writer dup2s the write end onto fd 1; reader dup2s read end onto fd 0; both close original ends. {The redirected descriptors retain references.}",
      "Parent closes both ends before waiting for children. {EOF requires all references to the write end to close.}"
    ],
    "bug": "The writer exits but cat never finishes. The parent is waiting and still has its original pipe descriptors open. Draw all write-end references and identify the missing operation.",
    "hint": "Close the parent's unused write end before waitpid; close unused inherited ends in each child too. An open writer descriptor prevents EOF even if no process writes."
  },
  "allocator": {
    "units": [
      "14a",
      "17a",
      "17b"
    ],
    "trace": [
      "Initial free [0,128). Request 9 rounds to 16. {8-byte alignment requires ceiling division.}",
      "Reserve [0,16), leave [16,128). {Split the first adequate free interval.}",
      "Free offset 0 and merge touching intervals back to [0,128). {Both ranges are free and physically adjacent.}"
    ],
    "bug": "Free spans [0,16), [16,32) and live [32,64). A free-list implementation leaves the first two spans separate. alloc 24 fails despite enough contiguous bytes. Which invariant was omitted?",
    "hint": "Coalesce adjacent free intervals at exact endpoints; do not merge across a live interval. Check adjacency on both sides of a newly freed span."
  },
  "hash": {
    "units": [
      "26b",
      "28a",
      "29b"
    ],
    "trace": [
      "Keys 1 and 5 hash to bucket 1 with four buckets. {key mod 4 selects bucket.}",
      "A locks bucket 1, traverses list and increments or inserts node. {The entire mutation is protected.}",
      "B waits on same lock; after A releases, B observes the updated list. {Serialization prevents duplicate insertion or lost update.}"
    ],
    "bug": "Two threads both find a missing key before taking the bucket lock, then each inserts it under the lock. The list now has duplicate keys. Identify the unprotected decision and change the lock scope.",
    "hint": "Lookup and insertion must be one protected logical operation. Rechecking under the lock works; locking insertion alone does not."
  },
  "pool": {
    "units": [
      "30a",
      "30b",
      "31b",
      "32b"
    ],
    "trace": [
      "Capacity one, count zero; consumer waits in a while loop. {No available item.}",
      "Producer inserts task 1 under lock, sets count=1, signals not_empty. {Predicate changed.}",
      "Consumer reacquires lock, checks count, removes 1, signals not_full. After close and empty it exits. {Close is a persistent predicate.}"
    ],
    "bug": "A worker uses if(count==0) pthread_cond_wait(...), then dequeues without testing again. Two workers wake for one task. Construct an execution in which the second dequeue is invalid.",
    "hint": "The first worker can consume the only item before the second reacquires the mutex. Use while with the closed/empty predicate."
  },
  "fsimage": {
    "units": [
      "40a",
      "40b",
      "42a",
      "42c"
    ],
    "trace": [
      "Image has name a -> inode 0 -> block 0 holding old; bit 0 allocated. {Reachability and allocation agree.}",
      "Construct a fully validated new image with new data and write a temporary sibling. {Original image is still untouched.}",
      "Simulated failure before rename leaves old; after rename leaves new. {Atomic publication assumption, not actual power-loss durability.}"
    ],
    "bug": "A crash trace leaves an inode pointing at block 4 but allocation bit 4 is zero. What could a later put do, and which check should reject the image?",
    "hint": "A free-marked referenced block may be reallocated. Validate both directions of the bitmap/reference invariant before any write."
  },
  "xv6-syscall": {
    "units": [
      "6a",
      "6b",
      "39a"
    ],
    "trace": [
      "User invokes ostep_info with an address of an int. {Stub transfers syscall number and arguments.}",
      "Handler obtains caller PID and destination VA; copyout validates and writes using the caller page table. {User address is not a trusted kernel pointer.}",
      "Return status through syscall result; user observes either PID or error. {Controlled return path.}"
    ],
    "bug": "The handler writes *(int*)user_va = pid directly. Why is this not equivalent to a checked copyout, and what should happen for an unmapped destination?",
    "hint": "Use the local revision's copyout contract and check its return; never dereference a raw user VA as a kernel pointer."
  },
  "xv6-scheduler": {
    "units": [
      "6b",
      "7b",
      "9a",
      "10b"
    ],
    "trace": [
      "A RUNNABLE process is selected; increment its dispatch count while protected. {Accounting belongs to selection, not every timer interrupt.}",
      "Set RUNNING and switch according to existing lock protocol. {Scheduler state invariant.}",
      "On later reschedule, increment again; a blocked or exited process is not eligible. {Dispatch count is not CPU service time.}"
    ],
    "bug": "A learner increments the counter on every timer interrupt, then interprets it as dispatch count. Construct a case where the timer interrupts but the same process resumes without a new dispatch.",
    "hint": "Separate timer notification, scheduling choice and actual context dispatch. Instrument the selected RUNNABLE-to-RUNNING transition defined by your revision."
  },
  "xv6-vm": {
    "units": [
      "18a",
      "20b",
      "21a"
    ],
    "trace": [
      "A stack VA is below MAXVA; walk without allocating. {Input is in supported range.}",
      "Inspect valid leaf and user-access bits; mask out PFN and all unrelated metadata. {Read-only inspection contract.}",
      "For a high invalid VA return 0 before walk. {Do not trigger a kernel panic from invalid input.}"
    ],
    "bug": "The syscall calls walk(pagetable, va, 1) for an unmapped address. Why can this inspection change memory state, even if no valid user page is returned?",
    "hint": "alloc=1 permits intermediate page-table allocation. Validate range first and use alloc=0 for observational queries."
  },
  "scheduler": {
    "units": [
      "7a",
      "7b",
      "7c",
      "8b"
    ],
    "trace": [
      "A arrives 0, burst 4; B arrives 2, burst 1; RR q=2. A runs 0–2. {A initially alone.}",
      "At t=2 enqueue B before requeue A; B runs 2–3 and finishes. {Declared boundary convention.}",
      "A runs 3–5 and finishes. Response A=0, B=0; completions 5 and 3. {Response subtracts arrival from first dispatch.}"
    ],
    "bug": "An RR simulator requeues A before admitting B at t=2 in the worked trace. What completion and response values differ under that alternative rule?",
    "hint": "Under that alternative convention A can run 2–4; B first runs at 4 and finishes 5. A finishes 4; B response 2. The program must follow the specified arrival-before-requeue rule."
  },
  "pager": {
    "units": [
      "22a",
      "22b",
      "22c"
    ],
    "trace": [
      "Capacity 2, trace 1,2,1,3. Both initial references miss and fill frames. {Empty cache.}",
      "Reference 1 hits: LRU marks 1 most recent; FIFO does not change insertion order. {Different policy metadata.}",
      "3 misses; LRU evicts 2; FIFO evicts 1. {Choose victim by specified policy.}"
    ],
    "bug": "A FIFO implementation updates its insertion timestamp on every hit. On 1,2,1,3,1 with capacity 2, why does the miss count disagree with FIFO?",
    "hint": "Refreshing insertion time on hit implements recency-like behavior. FIFO should evict page 1 on reference 3, so the last 1 misses."
  },
  "rpc": {
    "units": [
      "47b",
      "47c",
      "48b"
    ],
    "trace": [
      "Request ID 10 inc executes once; counter becomes 1; reply dropped. {Client has no completion evidence.}",
      "Retry same ID 10 inc after timeout; server finds cached result 1, replies without increment. {Duplicate detection.}",
      "ID 11 inc executes, counter 2. Retrying ID 10 still returns 1. {Result cache stores original result, not current value.}"
    ],
    "bug": "The client generates a fresh ID each time it times out. Server deduplication is enabled but the counter increases twice. Explain why the dedup cache did not help.",
    "hint": "A retry must preserve the logical request identity and arguments. A fresh ID represents a distinct request to the server."
  }
};
export const projectReady=(p,isMastered)=>p.chapters.every(isMastered);
export function projectComplete(p,s){return Boolean(s.evidence?.trim()&&p.milestones.every((_,i)=>s.milestones?.[i])&&p.checks.every((_,i)=>s.checks?.[i]));}
