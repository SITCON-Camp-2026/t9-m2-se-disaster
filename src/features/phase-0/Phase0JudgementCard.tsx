import { StatusBadge } from "../../components/StatusBadge";
import type { Phase0JudgementDraft, Phase0MessyRecord } from "./phase0-types";

const kindLabels: Record<Phase0JudgementDraft["possibleKind"], string> = {
  help_request_candidate: "求助候選",
  site_status_candidate: "地點狀態候選",
  task_candidate: "任務候選",
  assignment_candidate: "人員指派候選",
  announcement_candidate: "公告候選",
  unknown: "候選類型待判斷",
};

const confidenceLabels: Record<Phase0JudgementDraft["confidence"], string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const nextStepLabels: Record<
  Phase0JudgementDraft["suggestedNextStep"],
  string
> = {
  keep_raw: "先保留原始資訊",
  ask_for_more_info: "補問來源或現場資訊",
  send_to_human_review: "交給人工確認",
  create_candidate_report: "建立候選通報",
  create_site_update_suggestion: "建立地點更新建議",
  do_not_use_yet: "暫時不要使用",
};

const manpowerLabels: Record<
  NonNullable<Phase0JudgementDraft["manpowerNeed"]>,
  string
> = {
  unknown: "需求待判斷",
  mud_cleanup: "清泥人力候選",
  utility_repair: "水電候選",
  shovel_tool: "鏟子/工具候選",
  supply_support: "物資支援候選",
  furniture_moving: "搬運家具候選",
  medicine_check: "藥品確認候選",
  site_access: "集合/道路狀態候選",
  no_manpower_need: "暫無人力需求候選",
};

const locationLabels: Record<
  NonNullable<Phase0JudgementDraft["locationArea"]>,
  string
> = {
  unknown: "地點待判斷",
  guangfu_candidate: "光復候選",
  xipan_candidate: "溪畔候選",
  dajin_candidate: "大進候選",
  old_street_candidate: "老街候選",
  area_a_candidate: "A 區候選",
};

export function Phase0JudgementCard({
  judgement,
  record,
}: {
  judgement: Phase0JudgementDraft;
  record: Phase0MessyRecord;
}) {
  const hasEditableDraft =
    "humanCorrectionNote" in judgement || "humanReviewNote" in judgement;

  return (
    <article className="judgement-card">
      <div className="judgement-card__header">
        <div>
          <p className="eyebrow">
            {hasEditableDraft ? "草稿摘要" : "Starter 安全預設"}
          </p>
          <h3>{hasEditableDraft ? "目前整理草稿" : "尚未建立整理草稿"}</h3>
        </div>
        <StatusBadge status={record.verificationStatus} />
      </div>

      <p>
        {hasEditableDraft
          ? "這張卡整理目前畫面中的草稿，仍然不是已確認事實。請用它檢查哪些判斷有原文依據，哪些需要人工確認。"
          : "這張卡只保留保守的安全邊界，不是 agent 對這筆資料的整理答案。"}
      </p>

      <dl className="judgement-summary">
        <div>
          <dt>候選類型</dt>
          <dd>{kindLabels[judgement.possibleKind]}</dd>
        </div>
        <div>
          <dt>信心程度</dt>
          <dd>{confidenceLabels[judgement.confidence]}</dd>
        </div>
        <div>
          <dt>下一步</dt>
          <dd>{nextStepLabels[judgement.suggestedNextStep]}</dd>
        </div>
        <div>
          <dt>需求候選</dt>
          <dd>{manpowerLabels[judgement.manpowerNeed ?? "unknown"]}</dd>
        </div>
        <div>
          <dt>地點候選</dt>
          <dd>{locationLabels[judgement.locationArea ?? "unknown"]}</dd>
        </div>
      </dl>

      <p>
        能否直接行動：
        <strong>
          {judgement.unsafeToActDirectly ? "不可直接行動" : "仍需確認情境"}
        </strong>
      </p>

      <section>
        <h4>{hasEditableDraft ? "原文依據或草稿線索" : "目前只有安全預設"}</h4>
        <ul>
          {judgement.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4>目前卡住的地方</h4>
        <ul>
          {judgement.blockers.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {judgement.humanReviewNote ? (
        <section>
          <h4>需要人工確認</h4>
          <p>{judgement.humanReviewNote}</p>
        </section>
      ) : null}

      {judgement.humanCorrectionNote ? (
        <section>
          <h4>人類質疑或修正</h4>
          <p>{judgement.humanCorrectionNote}</p>
        </section>
      ) : null}
    </article>
  );
}
