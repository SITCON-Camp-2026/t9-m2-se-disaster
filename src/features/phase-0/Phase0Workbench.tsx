import { useMemo, useState } from "react";
import { RecordCard } from "../../components/RecordCard";
import { StatusBadge } from "../../components/StatusBadge";
import { Phase0JudgementCard } from "./Phase0JudgementCard";
import { createPhase0Judgement } from "./phase0-heuristics";
import type {
  Phase0Confidence,
  Phase0JudgementDraft,
  Phase0LocationArea,
  Phase0ManpowerNeed,
  Phase0MessyRecord,
  Phase0PossibleKind,
  Phase0SuggestedNextStep,
} from "./phase0-types";

const kindOptions: Array<{ value: Phase0PossibleKind; label: string }> = [
  { value: "unknown", label: "候選類型待判斷" },
  { value: "help_request_candidate", label: "求助候選" },
  { value: "site_status_candidate", label: "地點狀態候選" },
  { value: "task_candidate", label: "任務候選" },
  { value: "assignment_candidate", label: "人員指派候選" },
  { value: "announcement_candidate", label: "公告候選" },
];

const confidenceOptions: Array<{ value: Phase0Confidence; label: string }> = [
  { value: "low", label: "低" },
  { value: "medium", label: "中" },
  { value: "high", label: "高" },
];

const nextStepOptions: Array<{
  value: Phase0SuggestedNextStep;
  label: string;
}> = [
  { value: "send_to_human_review", label: "交給人工確認" },
  { value: "ask_for_more_info", label: "補問來源或現場資訊" },
  { value: "do_not_use_yet", label: "暫時不要使用" },
  { value: "keep_raw", label: "先保留原始資訊" },
  { value: "create_candidate_report", label: "建立候選通報" },
  { value: "create_site_update_suggestion", label: "建立地點更新建議" },
];

const manpowerOptions: Array<{ value: Phase0ManpowerNeed; label: string }> = [
  { value: "unknown", label: "需求待判斷" },
  { value: "mud_cleanup", label: "清泥人力候選" },
  { value: "utility_repair", label: "水電候選" },
  { value: "shovel_tool", label: "鏟子/工具候選" },
  { value: "supply_support", label: "物資支援候選" },
  { value: "furniture_moving", label: "搬運家具候選" },
  { value: "medicine_check", label: "藥品確認候選" },
  { value: "site_access", label: "集合/道路狀態候選" },
  { value: "no_manpower_need", label: "暫無人力需求候選" },
];

const locationOptions: Array<{ value: Phase0LocationArea; label: string }> = [
  { value: "unknown", label: "地點待判斷" },
  { value: "guangfu_candidate", label: "光復候選" },
  { value: "xipan_candidate", label: "溪畔候選" },
  { value: "dajin_candidate", label: "大進候選" },
  { value: "old_street_candidate", label: "老街候選" },
  { value: "area_a_candidate", label: "A 區候選" },
];

const manpowerFilterOptions = [
  { value: "all", label: "全部需求" },
  ...manpowerOptions,
] satisfies Array<{ value: Phase0ManpowerNeed | "all"; label: string }>;

const locationFilterOptions = [
  { value: "all", label: "全部地點" },
  ...locationOptions,
] satisfies Array<{ value: Phase0LocationArea | "all"; label: string }>;

function inferManpowerNeed(rawText: string): Phase0ManpowerNeed {
  if (rawText.includes("水電")) {
    return "utility_repair";
  }

  if (rawText.includes("鏟子")) {
    return "shovel_tool";
  }

  if (rawText.includes("清泥") || rawText.includes("清淤")) {
    return "mud_cleanup";
  }

  if (
    rawText.includes("雨鞋") ||
    rawText.includes("飲用水") ||
    rawText.includes("物資")
  ) {
    return "supply_support";
  }

  if (rawText.includes("家具")) {
    return "furniture_moving";
  }

  if (rawText.includes("藥品")) {
    return "medicine_check";
  }

  if (
    rawText.includes("集合點") ||
    rawText.includes("道路") ||
    rawText.includes("不要再派人")
  ) {
    return "site_access";
  }

  if (rawText.includes("不缺")) {
    return "no_manpower_need";
  }

  return "unknown";
}

function inferLocationArea(rawText: string): Phase0LocationArea {
  if (rawText.includes("光復")) {
    return "guangfu_candidate";
  }

  if (rawText.includes("溪畔")) {
    return "xipan_candidate";
  }

  if (rawText.includes("大進")) {
    return "dajin_candidate";
  }

  if (rawText.includes("老街")) {
    return "old_street_candidate";
  }

  if (rawText.includes("A 區")) {
    return "area_a_candidate";
  }

  return "unknown";
}

function createEditableDraft(record: Phase0MessyRecord): Phase0JudgementDraft {
  const baseDraft = createPhase0Judgement(record);

  return {
    ...baseDraft,
    manpowerNeed: inferManpowerNeed(record.rawText),
    locationArea: inferLocationArea(record.rawText),
    evidence: [
      `原文只顯示：${record.rawText}`,
      "尚未由人類標出可直接採用的依據。",
    ],
    blockers: [
      "查核狀態不是已確認，不能直接當成事實。",
      "還需要補齊時間、位置、當事人同意或現場狀況。",
      "不能直接變成志工任務，需先由人工確認下一步。",
    ],
    humanReviewNote: "請小組確認：哪些內容是原文有寫，哪些只是推測。",
    humanCorrectionNote: "",
  };
}

function linesToList(value: string): string[] {
  return value.split("\n").filter((item) => item.trim().length > 0);
}

function listToLines(items: string[]): string {
  return items.join("\n");
}

export function Phase0Workbench({
  records,
  selectedRecordId,
  onSelect,
}: {
  records: Phase0MessyRecord[];
  selectedRecordId: string;
  onSelect: (recordId: string) => void;
}) {
  const initialDrafts = useMemo(
    () =>
      Object.fromEntries(
        records
          .slice(0, 6)
          .map((record) => [record.id, createEditableDraft(record)]),
      ),
    [records],
  );
  const [drafts, setDrafts] =
    useState<Record<string, Phase0JudgementDraft>>(initialDrafts);
  const [manpowerFilter, setManpowerFilter] = useState<
    Phase0ManpowerNeed | "all"
  >("all");
  const [locationFilter, setLocationFilter] = useState<
    Phase0LocationArea | "all"
  >("all");
  const filteredRecords = records.filter((record) => {
    const draft = drafts[record.id];
    const recordManpowerNeed = draft?.manpowerNeed ?? "unknown";
    const recordLocationArea = draft?.locationArea ?? "unknown";
    const matchesManpower =
      manpowerFilter === "all" || recordManpowerNeed === manpowerFilter;
    const matchesLocation =
      locationFilter === "all" || recordLocationArea === locationFilter;

    return matchesManpower && matchesLocation;
  });
  const selectedRecord =
    filteredRecords.find((record) => record.id === selectedRecordId) ??
    filteredRecords[0] ??
    records.find((record) => record.id === selectedRecordId) ??
    records[0];
  const selectedDraft = drafts[selectedRecord.id];
  const safetyBoundary = selectedDraft ?? createPhase0Judgement(selectedRecord);
  const draftCount = Object.keys(drafts).length;
  const unsafeDraftCount = Object.values(drafts).filter(
    (draft) => draft.unsafeToActDirectly,
  ).length;
  const correctionCount = Object.values(drafts).filter((draft) =>
    draft.humanCorrectionNote?.trim(),
  ).length;

  function upsertDraft(nextDraft: Phase0JudgementDraft) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [nextDraft.messyRecordId]: nextDraft,
    }));
  }

  function createDraftForSelectedRecord() {
    upsertDraft(createEditableDraft(selectedRecord));
  }

  function deleteSelectedDraft() {
    setDrafts((currentDrafts) => {
      const nextDrafts = { ...currentDrafts };
      delete nextDrafts[selectedRecord.id];
      return nextDrafts;
    });
  }

  function resetSelectedDraft() {
    upsertDraft(createEditableDraft(selectedRecord));
  }

  function resetSixSafetyDrafts() {
    setDrafts(initialDrafts);
  }

  return (
    <div className="workbench">
      <div className="workbench__intro">
        <p className="eyebrow">整理工作台</p>
        <h2>第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。</h2>
        <p>
          這裡的草稿只存在畫面狀態中，方便練習整理原始資訊。它不是 runtime LLM
          分析，也不是正式整理後資料。
        </p>
      </div>

      <section className="workbench-filters" aria-label="草稿篩選">
        <div>
          <p className="eyebrow">候選篩選</p>
          <h3>依需求與地點快速縮小清單</h3>
          <p>這些是草稿標籤，不代表已確認需求或正式鄉鎮資料。</p>
        </div>

        <label>
          人力或物資需求
          <select
            value={manpowerFilter}
            onChange={(event) =>
              setManpowerFilter(
                event.target.value as Phase0ManpowerNeed | "all",
              )
            }
          >
            {manpowerFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          鄉鎮/地點候選
          <select
            value={locationFilter}
            onChange={(event) =>
              setLocationFilter(
                event.target.value as Phase0LocationArea | "all",
              )
            }
          >
            {locationFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className="workbench__layout">
        <aside className="workbench__queue" aria-label="選擇原始資訊">
          <p className="queue-count">
            顯示 {filteredRecords.length} / {records.length} 筆
          </p>
          {filteredRecords.length === 0 ? (
            <p className="queue-empty">沒有符合目前篩選的草稿。</p>
          ) : null}
          {filteredRecords.map((record) => (
            <button
              className={record.id === selectedRecord.id ? "active" : ""}
              key={record.id}
              type="button"
              onClick={() => onSelect(record.id)}
            >
              <span>{record.id}</span>
              <StatusBadge status={record.verificationStatus} />
              {drafts[record.id] ? (
                <span className="draft-marker">已有草稿</span>
              ) : null}
              {drafts[record.id]?.manpowerNeed ? (
                <span className="draft-tag">
                  {
                    manpowerOptions.find(
                      (option) =>
                        option.value ===
                        (drafts[record.id]?.manpowerNeed ?? "unknown"),
                    )?.label
                  }
                </span>
              ) : null}
              {drafts[record.id]?.locationArea ? (
                <span className="draft-tag">
                  {
                    locationOptions.find(
                      (option) =>
                        option.value ===
                        (drafts[record.id]?.locationArea ?? "unknown"),
                    )?.label
                  }
                </span>
              ) : null}
            </button>
          ))}
        </aside>

        <div className="workbench__main">
          <RecordCard record={selectedRecord} />

          {selectedDraft ? (
            <form
              className="draft-editor"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="draft-editor__header">
                <div>
                  <p className="eyebrow">可編輯整理草稿</p>
                  <h3>{selectedRecord.id} 的候選判斷</h3>
                </div>
                <div className="draft-editor__actions">
                  <button type="button" onClick={resetSelectedDraft}>
                    重設這筆
                  </button>
                  <button type="button" onClick={deleteSelectedDraft}>
                    刪除草稿
                  </button>
                </div>
              </div>

              <div className="draft-editor__fields">
                <label>
                  候選類型
                  <select
                    value={selectedDraft.possibleKind}
                    onChange={(event) =>
                      upsertDraft({
                        ...selectedDraft,
                        possibleKind: event.target.value as Phase0PossibleKind,
                      })
                    }
                  >
                    {kindOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  信心程度
                  <select
                    value={selectedDraft.confidence}
                    onChange={(event) =>
                      upsertDraft({
                        ...selectedDraft,
                        confidence: event.target.value as Phase0Confidence,
                      })
                    }
                  >
                    {confidenceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  下一步
                  <select
                    value={selectedDraft.suggestedNextStep}
                    onChange={(event) =>
                      upsertDraft({
                        ...selectedDraft,
                        suggestedNextStep: event.target
                          .value as Phase0SuggestedNextStep,
                      })
                    }
                  >
                    {nextStepOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="draft-editor__fields">
                <label>
                  草稿人力或物資需求候選
                  <select
                    value={selectedDraft.manpowerNeed ?? "unknown"}
                    onChange={(event) =>
                      upsertDraft({
                        ...selectedDraft,
                        manpowerNeed: event.target.value as Phase0ManpowerNeed,
                      })
                    }
                  >
                    {manpowerOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  草稿鄉鎮/地點候選
                  <select
                    value={selectedDraft.locationArea ?? "unknown"}
                    onChange={(event) =>
                      upsertDraft({
                        ...selectedDraft,
                        locationArea: event.target.value as Phase0LocationArea,
                      })
                    }
                  >
                    {locationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="draft-editor__check">
                <input
                  checked={selectedDraft.unsafeToActDirectly}
                  type="checkbox"
                  onChange={(event) =>
                    upsertDraft({
                      ...selectedDraft,
                      unsafeToActDirectly: event.target.checked,
                    })
                  }
                />
                不能直接變成志工任務
              </label>

              <label>
                原文依據，一行一點
                <textarea
                  rows={4}
                  value={listToLines(selectedDraft.evidence)}
                  onChange={(event) =>
                    upsertDraft({
                      ...selectedDraft,
                      evidence: linesToList(event.target.value),
                    })
                  }
                />
              </label>

              <label>
                不能直接相信或不能直接變任務的原因
                <textarea
                  rows={4}
                  value={listToLines(selectedDraft.blockers)}
                  onChange={(event) =>
                    upsertDraft({
                      ...selectedDraft,
                      blockers: linesToList(event.target.value),
                    })
                  }
                />
              </label>

              <label>
                需要人工確認
                <textarea
                  rows={3}
                  value={selectedDraft.humanReviewNote ?? ""}
                  onChange={(event) =>
                    upsertDraft({
                      ...selectedDraft,
                      humanReviewNote: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                人類質疑或修正 agent 判斷
                <textarea
                  rows={3}
                  placeholder="例如：agent 不能把社群貼文推成已確認任務。"
                  value={selectedDraft.humanCorrectionNote ?? ""}
                  onChange={(event) =>
                    upsertDraft({
                      ...selectedDraft,
                      humanCorrectionNote: event.target.value,
                    })
                  }
                />
              </label>
            </form>
          ) : (
            <section className="draft-empty">
              <p className="eyebrow">尚未建立整理草稿</p>
              <h3>{selectedRecord.id} 目前只有原始資訊</h3>
              <p>
                建立草稿後，請只填原文能支持的判斷，並保留需要人工確認的地方。
              </p>
              <button type="button" onClick={createDraftForSelectedRecord}>
                建立安全邊界草稿
              </button>
            </section>
          )}

          <Phase0JudgementCard
            judgement={safetyBoundary}
            record={selectedRecord}
          />
        </div>

        <aside className="workbench__checklist">
          <h3>第一階段完成檢查</h3>
          <dl className="checklist-metrics">
            <div>
              <dt>原始資訊</dt>
              <dd>{records.length} 筆</dd>
            </div>
            <div>
              <dt>可編輯草稿</dt>
              <dd>{draftCount} 筆</dd>
            </div>
            <div>
              <dt>不能直接變任務</dt>
              <dd>{unsafeDraftCount} 筆</dd>
            </div>
            <div>
              <dt>人類修正紀錄</dt>
              <dd>{correctionCount} 筆</dd>
            </div>
          </dl>
          <ul>
            <li>至少 6 筆原始資訊已被嘗試整理成可編輯草稿</li>
            <li>M-011、M-012 這類非當事人轉述仍需人工確認</li>
            <li>候選判斷只能當草稿，不能當已確認事實</li>
            <li>請把至少 2 個人類質疑寫進草稿或 observations</li>
          </ul>
          <button type="button" onClick={resetSixSafetyDrafts}>
            重設 6 筆安全草稿
          </button>
        </aside>
      </div>
    </div>
  );
}
