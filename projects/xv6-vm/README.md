# xv6 virtual memory

Chapters: 15, 18, 19, 20, 21, 23

Add int ostep_pte(uint64 va) returning only V/R/W/X/U bits for mapped user leaf, 0 otherwise; no PFN exposure.

**Invariant:** Bounds-check MAXVA before walk; walk with alloc=0; never mutate mapping.

## Milestones
1. Trace walk/mappages/freewalk
2. register inspection syscall
3. verify permissions
4. run fork/exit and usertests.

## Acceptance criteria
- Text executable/user
- stack writable/user
- high VA returns 0
- no panic.

## Debugging
- Check leaf validity and user bit
- no allocation
- do not reveal physical addresses.

## Run
Copy supplied source to user/ of your own xv6 checkout, add $U/_osteppte_test to UPROGS, implement the documented API, build with make qemu, run osteppte_test and usertests. Use the upstream instructions and your recorded revision.

## Extension
Separate branch: COW with refcounts and fault tests.
