# Course Context

This repository is the starter project for the SITCON Camp 2026 software engineering workshop day.

## Course theme

**災害資訊積木：從混亂需求到可交接的前端元件**

Students build a front-end-only prototype that demonstrates how disaster information can move from messy, uncertain reports into structured, reviewable, handoff-friendly components.

The learning goal is not to ship a real disaster response system. The learning goal is to experience how software engineering practices make AI-assisted and team-based development more stable.

## Fixed decisions

Do not change these without asking the course designer.

- Stack: Vite + React + TypeScript + Node 24 + pnpm.
- Runtime: front-end only.
- No backend service.
- No database.
- No real LLM runtime API call.
- No API keys or secrets.
- No real personal data.
- No real disaster case data.
- No Tailwind / shadcn unless explicitly requested.
- No real map dependency as a core dependency unless explicitly requested.
- Code license: MIT.
- Curriculum and documents: CC BY-SA.
- Mock data: CC0.
- Repository and demo are expected to be public.

## GitHub organization and repositories

Organization:

```text
sitcon-camp-2026
```

Expected repositories:

```text
se-disaster-starter
se-disaster-team-01
se-disaster-team-02
se-disaster-team-03
se-disaster-team-04
se-disaster-team-05
se-disaster-team-06
se-disaster-team-07
se-disaster-team-08
se-disaster-team-09
se-disaster-staff
se-disaster-showcase
```

The team repositories are expected to be fork-based, preferably created through GitHub Classroom group assignment. This starter repository should not contain hidden team-specific data.

`se-disaster-staff` is private and is responsible for timed releases such as family briefs, event injection, hidden fixtures, and handoff challenges.

## Course flow

48 students are split into 9 teams. Teams 1, 5, and 9 have 6 students. The rest have 5 students.

Day schedule:

| Time        | Phase                 | Purpose                                                              |
| ----------- | --------------------- | -------------------------------------------------------------------- |
| 09:00-09:20 | Opening               | Context, constraints, safety boundary                                |
| 09:20-10:10 | Shared messy sprint   | All teams face the same messy data first                             |
| 10:10-10:30 | Debrief               | Students surface confusion about roles, states, source quality       |
| 10:30-10:50 | Case reveal           | Introduce real-world tradeoffs from disaster collaboration platforms |
| 10:50-11:10 | Split into task lines | Information intake / credibility / action                            |
| 11:10-12:00 | SDD-lite + schema     | Write spec, I/O contract, and data contract                          |
| 13:00-13:30 | Spec market           | Teams challenge each other's assumptions                             |
| 13:30-13:50 | Scope lock            | Lock main flow and data contract                                     |
| 13:50-15:20 | Build Sprint 1        | Build the main front-end flow                                        |
| 15:35-16:20 | Event injection       | Timed PR introduces dirty incoming data and schema mismatch          |
| 16:20-17:20 | Build Sprint 2        | Absorb change, add adapter/test/docs                                 |
| 18:20-18:40 | Handoff prep          | Prepare README/data contract/handoff notes                           |
| 18:40-19:25 | Handoff challenge     | Another team attempts to understand and modify the project           |
| 20:00-21:00 | Showcase              | Non-ranking engineering feedback                                     |

## Team assignment

| Team | Size | Line | Student-facing task              |
| ---- | ---: | ---- | -------------------------------- |
| 1    |    6 | A    | 找出重複、錯誤與需要確認的資訊   |
| 2    |    5 | A    | 讓求助資訊能被送出               |
| 3    |    5 | A    | 幫不方便操作的人代為整理需求     |
| 4    |    5 | B    | 幫志工判斷哪裡可能還可用         |
| 5    |    6 | B    | 讓不確定資訊不要被誤當成事實     |
| 6    |    5 | B    | 讓現場的人回報「實際狀況變了」   |
| 7    |    5 | C    | 讓志工安全地選擇能做的任務       |
| 8    |    5 | C    | 幫協調者把任務分給合適的人       |
| 9    |    6 | C    | 讓自由協作與統一調度不要互相打架 |

The starter repo should not reveal these team-specific briefs at the beginning. Those should come from the staff repo at the correct time.

## Task lines

### Line A: Information intake

How messy information enters the system.

Core model: `Report`.

Focus areas:

- Requests from affected people.
- Proxy input by field volunteers.
- Social post import.
- Duplicate, wrong, or uncertain reports.
- AI-assisted but human-decided review.

### Line B: Information credibility

How entered information is understood and trusted.

Core models: `Site`, `SiteStatusReport`.

Focus areas:

- Site list and status display.
- Suggested site update.
- Stale, conflicting, or uncertain information.
- A single report must not silently override official or verified state.

### Line C: Information to action

How trustworthy information becomes volunteer action.

Core models: `Task`, `Assignment`.

Focus areas:

- Self-claim.
- Coordinator assignment.
- Hybrid self-claim and assignment.
- Capacity, skill mismatch, locked/high-risk tasks.
- Action log and status machine.

## Data rules

Use these folder meanings consistently:

```text
src/fixtures/phase-0/
  Initial messy data used by all teams in the first sprint.

src/fixtures/shared/
  Normalized starter data. Must pass validation.

src/fixtures/released/
  Normalized data released during class by staff PRs.

src/fixtures/workspace/
  Team-produced normalized data. Should pass validation.

events/
  External dirty event input. Does not need to pass validation directly.
```

Teaching point:

- `events/**` is external dirty input.
- `src/fixtures/**` is internal normalized data.
- Do not make the core model chase every external format.
- Prefer adapter functions for dirty incoming data.
- Extend family schemas only when the internal domain semantics are truly missing.

## Event injection design

At 15:35, staff sends one PR to each team repository.

Each PR only adds:

```text
events/event-1535/
  README.md
  incoming-data.json
  task.md
  notes-for-review.md
```

Rules:

- The PR should not modify student code.
- Incoming data may be invalid or inconsistent.
- Teams must decide whether to write an adapter, extend a family schema, mark as `needs_review`, or reject the data.
- Teams must update `docs/decisions.md`.
- Teams should update `docs/data-contract.md` if they change schema or add adapters.
- Teams should add at least one test or validation.
- Teams must not silently display uncertain data as confirmed fact.

## Coding agent rules

Good uses of AI coding agents:

- Generate components from a spec.
- Write Zod validation.
- Write tests from acceptance criteria.
- Write adapters for event input.
- Check missing empty/error/uncertain states.
- Improve README and handoff notes.

Disallowed decisions for AI agents:

- Decide which disaster information is true.
- Decide rescue or volunteer priority.
- Automatically merge suspected duplicate cases.
- Override official or verified site state from one report.
- Publish announcements.
- Display uncertain information as confirmed fact.

Before asking a coding agent to implement a feature, provide:

1. Relevant `docs/spec.md` section.
2. Acceptance criteria.
3. Relevant schema.
4. Constraints.
5. Files that may be modified.

## Acceptance for starter repo

The starter repo is acceptable when:

- `pnpm install` succeeds.
- `pnpm run check` succeeds.
- It has schema contracts for common/report/site/task/assignment.
- It has fixture validation.
- It has phase-0 messy data.
- It has shared normalized data.
- It has at least one adapter example.
- It has minimal UI for records, source, status, and update time.
- It has docs templates.
- It has AGENTS, SAFETY, DATA_SOURCES, README, TEAM.
- It has GitHub Actions CI and Pages workflow.
- It contains no hidden event data.
- It contains no real personal data, secrets, or real LLM runtime calls.
