## Implementation Plan: 001-initial-build

Feature spec: /home/mosab/projects/ibnalarab/specs/001-initial-build/spec.md

Phases:

- Phase 0 — Research (created)
- Phase 1 — Design (created)
- Phase 2 — Tasks (not-started)

Generated artifacts:

- /home/mosab/projects/ibnalarab/specs/001-initial-build/research.md
- /home/mosab/projects/ibnalarab/specs/001-initial-build/data-model.md
- /home/mosab/projects/ibnalarab/specs/001-initial-build/quickstart.md
- /home/mosab/projects/ibnalarab/specs/001-initial-build/contracts/openapi.yaml
- /home/mosab/projects/ibnalarab/specs/001-initial-build/contracts/contract-tests.md

Progress:

- Phase 0: completed
- Phase 1: completed
- Phase 2: not-started

Post-Design Constitution Check: completed

Summary of scan (automated grep):

- Status: PASS for source files. The repository contains no committed SQL seeds (`INSERT INTO public.plans VALUES(...)`) or numeric price literals in code files. No occurrences of `FIXME_PRICE` or `HARDCODED_VAT` were found in code directories.
- Findings: The following intentional markers and references were found in docs/spec files and local references (these are expected and must be resolved or left intentionally with `PRODUCT_SIGNOFF_REQUIRED` before merge to protected branches):
	- `.specify/memory/constitution.md` — contains rules and forbidden-pattern list (expected)
	- `specs/*` files — many specs contain `PRODUCT_SIGNOFF_REQUIRED` markers and enforcement notes (expected until PO signoff)
	- `local files/Existing DB tables.txt` — schema contains price column definitions (reference only)

Action items:

- Keep `PRODUCT_SIGNOFF_REQUIRED` markers in `specs/` and `docs/` until PO clears them. CI will fail merges that leave this token in code/config files.
- Create CI job (added) to reject PRs that add forbidden markers into code — see `.github/workflows/forbidden-patterns.yml`.

If you want a detailed per-file listing of matches, run: `grep -RIn -E "FIXME_PRICE|HARDCODED_VAT|PRICE_HARDCODED|INSERT\s+INTO\s+public\.plans|PRODUCT_SIGNOFF_REQUIRED" --exclude-dir=.git --exclude-dir=specs --exclude-dir=docs --exclude-dir=memory --exclude-dir="local files" --exclude=*.md .`

Next steps:

1. Run Post-Design Constitution Check and remediate any violations.
2. Generate `tasks.md` (Phase 2).
3. Add CI/PR template enforcement for constitution rules.
