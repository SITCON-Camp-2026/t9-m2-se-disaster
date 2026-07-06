# Decisions

## DEC-001：

### Context

Starter repository commands and CI should use one package manager so students and agents do not split workflows.

### Options considered

- Keep the previous package-manager workflow.
- Use pnpm as the only documented and CI package manager.

### Decision

Use Node 24 and pnpm for install, scripts, lockfile, CI, and course documentation.

### Consequences

Contributors should use Node 24, then run `pnpm install` and `pnpm run check`. No alternate package manager is supported.
