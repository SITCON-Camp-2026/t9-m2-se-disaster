import { describe, expect, it } from "vitest";
import { legacyTaskImport } from "../src/adapters/legacy-task-import";

it("normalizes legacy task shape", () => {
  const task = legacyTaskImport({
    task_id: "T-999",
    need_people: "10人",
    joined: "8",
    state: "尚未媒合",
  });
  expect(task.peopleNeeded).toBe(10);
  expect(task.peopleClaimed).toBe(8);
  expect(task.status).toBe("open");
});

describe("adapter teaching point", () => {
  it("keeps imported data in needs_review", () => {
    const task = legacyTaskImport({ task_id: "T-998" });
    expect(task.verificationStatus).toBe("needs_review");
  });
});
