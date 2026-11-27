# Practical project track

These are original assignments inspired by the chapter mechanisms, not copies of official OSTEP solutions. Prerequisites are advisory, and projects are separate from required lesson mastery.

## Native macOS (or Linux)
Install Apple's command-line tools if needed with `xcode-select --install`. Use a local clone, Python 3, and a C compiler. For each project:
1. Read its README and predict a small trace based on the matching lesson.
2. Copy starter.c to your own solution.c (outside or inside that directory).
3. From the repository root, run `python3 projects/check.py utilities --source projects/utilities/solution.c` (replace project and path).
4. Use `--smoke` for compilation only; the provided stubs are intentionally incomplete and behavioral tests should fail until implemented.
5. Use `--sanitize` for address and undefined-behavior checks when your compiler supports them. These are not race detectors. Use a supported thread sanitizer separately if desired; never intentionally run unsafe code on real data.
6. Record test output, reasoning, known limitations and a commit/diff in the website. The checkbox is self-assessment, not a browser assertion of native test results.

Compile all starter programs: `python3 projects/check.py all --smoke`. A single native suite runs bounded child processes in temporary directories. It kills timed-out process groups; the RPC test binds only loopback per the assignment. Do not run untrusted student submissions: the harness is not a sandbox. Never point the toy filesystem at a block device or real data. Use a separate disposable copy. The simulated crash assignment demonstrates old/new publication, not hardware power-loss guarantees.

## xv6 on Apple Silicon
Use an ARM64 Linux VM with snapshots, an upstream RISC-V toolchain and QEMU capable of RISC-V system emulation. Follow the current [xv6 upstream README](https://github.com/mit-pdos/xv6-riscv/blob/riscv/README). Clone into a separate workspace, record `git rev-parse HEAD`, build and boot using `make qemu`, and run baseline `usertests` before modifying. Start each lab from a separate branch of the same tested baseline, not from a previously modified kernel. Use the local revision's syscall table, user headers, generated stubs and Makefile conventions. Add the supplied user test file to user/ and UPROGS and implement the indicated syscall. Run the user test and upstream usertests in the guest. For scheduler experiments begin with `make CPUS=1 qemu`; retest default SMP. Use QEMU exit sequence Ctrl-a x. The guest tests are smoke/contract tests, not comprehensive proof of correctness; policy benchmarks and kernel debugging require evidence. No kernel solution patch is provided.

Official supplementary resources: [OSTEP projects](https://github.com/remzi-arpacidusseau/ostep-projects), [OSTEP homework](https://github.com/remzi-arpacidusseau/ostep-homework), [MIT xv6](https://github.com/mit-pdos/xv6-riscv).
