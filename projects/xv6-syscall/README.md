# xv6 system calls

Chapters: 4, 5, 6, 39

Add int ostep_info(int *out): copy caller PID to valid user memory, return 0; invalid destination returns -1.

**Invariant:** Never dereference unchecked user pointer; checked copyout.

## Milestones
1. Boot baseline
2. trace getpid
3. register syscall/stub/handler
4. copyout and test.

## Acceptance criteria
- Stack and heap destination
- invalid high VA
- usertests.

## Debugging
- Check local argaddr/copyout signatures
- compare syscall table/stub.

## Run
Copy supplied source to user/ of your own xv6 checkout, add $U/_ostepinfo_test to UPROGS, implement the documented API, build with make qemu, run ostepinfo_test and usertests. Use the upstream instructions and your recorded revision.

## Extension
Return structured process stats.
