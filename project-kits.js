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
export const projectReady=(p,isMastered)=>p.chapters.every(isMastered);
export function projectComplete(p,s){return Boolean(s.evidence?.trim()&&p.milestones.every((_,i)=>s.milestones?.[i])&&p.checks.every((_,i)=>s.checks?.[i]));}
