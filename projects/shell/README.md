# Unix shell

Chapters: 5, 6, 39

Batch shell reading stdin, whitespace tokens, one command per line; built-ins cd DIR and exit; one pipeline or one stdout redirect > FILE; operators separate tokens. No quotes/globbing or combined operators.

**Invariant:** Reap children; close unused pipe ends; cd changes parent directory.

## Milestones
1. Tokenize and execute
2. wait/error handling
3. cd/exit
4. pipe and redirection.

## Acceptance criteria
- External commands
- failed exec recovery
- cd
- redirect
- repeated pipelines.

## Debugging
- Use stderr for errors
- _exit after failed exec
- close parent and child pipe ends before wait.

## Run
From repo root: `python3 projects/check.py shell`. Compile only: `python3 projects/check.py shell --smoke`. Test a separate edited source with `--source /path/to/solution.c`. The starter intentionally fails behavioral tests.

## Extension
Add multi-stage pipelines and quoting.
