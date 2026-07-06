import type { Report, Task } from "../contracts";

export function reportToTask(report: Report): Task | null {
  if (report.reportType !== "human_need") return null;
  if (report.verificationStatus !== "verified") return null;

  return {
    id: `task-${report.id}`,
    reportId: report.id,
    relatedSiteId: report.relatedSiteId,
    title: "待處理需求",
    description: report.rawText,
    needType: "other",
    status: "open",
    matchMode: "self_claim",
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    sourceType: report.sourceType,
    verificationStatus: report.verificationStatus,
  };
}
