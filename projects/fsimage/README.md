# File system image

Chapters: 39, 40, 42, 43, 44

Regular-file image only. Eight inodes, 32 data blocks of 64 bytes, one block per file, names 1–15 ASCII alnum/underscore, values 0–63 bytes. Commands init IMAGE, put IMAGE NAME VALUE, get IMAGE NAME, rm IMAGE NAME, check IMAGE, put-crash IMAGE NAME VALUE before|after. get prints value + newline; check prints ok.

**Invariant:** Unique names/blocks and bitmap agreement; explicit byte encoding; temp sibling + rename; simulated before retains old, after publishes new (not physical crash durability).

## Milestones
1. Encode and validate bounded image
2. allocate/update/remove
3. check invariants
4. simulate before/after publication.

## Acceptance criteria
- Reopen, replace, remove
- capacity and truncated image
- before/after crash states.

## Debugging
- Check bounds before indexing
- no raw devices
- do not overwrite image in-place.

## Run
From repo root: `python3 projects/check.py fsimage`. Compile only: `python3 projects/check.py fsimage --smoke`. Test a separate edited source with `--source /path/to/solution.c`. The starter intentionally fails behavioral tests.

## Extension
Multi-block files and redo logging.
