// Phase 0 only. This is not the formal data contract.
export type Phase0PossibleKind =
  | "help_request_candidate"
  | "site_status_candidate"
  | "task_candidate"
  | "assignment_candidate"
  | "announcement_candidate"
  | "unknown";

export type Phase0Confidence = "low" | "medium" | "high";

export type Phase0SuggestedNextStep =
  | "keep_raw"
  | "ask_for_more_info"
  | "send_to_human_review"
  | "create_candidate_report"
  | "create_site_update_suggestion"
  | "do_not_use_yet";

export type Phase0ManpowerNeed =
  | "unknown"
  | "mud_cleanup"
  | "utility_repair"
  | "shovel_tool"
  | "supply_support"
  | "furniture_moving"
  | "medicine_check"
  | "site_access"
  | "no_manpower_need";

export type Phase0LocationArea =
  | "unknown"
  | "guangfu_candidate"
  | "xipan_candidate"
  | "dajin_candidate"
  | "old_street_candidate"
  | "area_a_candidate";

export type Phase0MessyRecord = {
  id: string;
  rawText: string;
  sourceType: string;
  verificationStatus: string;
  updatedAt: string;
};

export type Phase0JudgementDraft = {
  messyRecordId: string;
  possibleKind: Phase0PossibleKind;
  confidence: Phase0Confidence;
  evidence: string[];
  blockers: string[];
  suggestedNextStep: Phase0SuggestedNextStep;
  unsafeToActDirectly: boolean;
  manpowerNeed?: Phase0ManpowerNeed;
  locationArea?: Phase0LocationArea;
  humanReviewNote?: string;
  humanCorrectionNote?: string;
};
