import type { Report, SiteStatusReport } from "../contracts";

export function reportToSiteStatus(report: Report): SiteStatusReport | null {
  if (report.reportType !== "site_update") return null;
  if (!report.relatedSiteId) return null;

  return {
    id: `site-status-${report.id}`,
    siteId: report.relatedSiteId,
    suggestedStatus: "needs_review",
    message: report.rawText,
    reportedByRole: report.reporterRole,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    sourceType: report.sourceType,
    verificationStatus: "needs_review",
  };
}
