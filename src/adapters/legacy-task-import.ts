import type { Task } from "../contracts";

type LegacyTask = {
  task_id: string;
  need_people?: string | number;
  joined?: string | number;
  state?: string;
  title?: string;
  description?: string;
};

function toNumber(value: string | number | undefined): number | undefined {
  if (typeof value === "number") return value;
  if (!value) return undefined;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

export function legacyTaskImport(input: LegacyTask): Task {
  const now = new Date().toISOString();
  return {
    id: input.task_id,
    title: input.title ?? "外部匯入任務",
    description: input.description ?? "外部資料格式已轉換，仍需人工確認。",
    needType: "other",
    peopleNeeded: toNumber(input.need_people),
    peopleClaimed: toNumber(input.joined),
    status: input.state === "尚未媒合" ? "open" : "needs_review",
    matchMode: "self_claim",
    createdAt: now,
    updatedAt: now,
    sourceType: "mock",
    verificationStatus: "needs_review",
  };
}
