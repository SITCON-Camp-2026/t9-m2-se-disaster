import { useState } from "react";
import { EmptyState } from "../../components/EmptyState";
import messyReports from "../../fixtures/phase-0/messy-reports.json";
import { Phase0RawInfoPanel } from "../phase-0/Phase0RawInfoPanel";
import { Phase0Workbench } from "../phase-0/Phase0Workbench";
import type { Phase0MessyRecord } from "../phase-0/phase0-types";

type TabKey = "coordination" | "raw" | "workbench";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "coordination", label: "協調總覽" },
  { key: "raw", label: "原始資訊" },
  { key: "workbench", label: "整理工作台" },
];

const phase0Records = messyReports satisfies Phase0MessyRecord[];

type CoordinationSignal = {
  id: string;
  label: string;
  reason: string;
};

function findCoordinationSignals(record: Phase0MessyRecord) {
  const signals: CoordinationSignal[] = [];
  const rawText = record.rawText;

  if (
    rawText.includes("直接") ||
    rawText.includes("不要再派人") ||
    rawText.includes("不適合") ||
    rawText.includes("封閉")
  ) {
    signals.push({
      id: "action-risk",
      label: "行動風險",
      reason: "文字含有直接行動或停止派人的語氣，需要先確認原因與適用範圍。",
    });
  }

  if (
    rawText.includes("不知道") ||
    rawText.includes("不確定") ||
    rawText.includes("尚未") ||
    rawText.includes("疑似")
  ) {
    signals.push({
      id: "missing-context",
      label: "脈絡缺口",
      reason: "原文自己指出仍有不知道或尚未確認的資訊。",
    });
  }

  if (
    rawText.includes("另一位") ||
    rawText.includes("留言") ||
    rawText.includes("原本") ||
    rawText.includes("可能") ||
    rawText.includes("但")
  ) {
    signals.push({
      id: "conflict",
      label: "可能衝突",
      reason: "內容出現不同版本或轉折，不能只取其中一句當成現場狀態。",
    });
  }

  if (
    rawText.includes("家屬") ||
    rawText.includes("代") ||
    rawText.includes("轉述") ||
    rawText.includes("群組")
  ) {
    signals.push({
      id: "not-firsthand",
      label: "非當事人或轉述",
      reason: "操作者可能不是當事人，需確認同意、位置與現況。",
    });
  }

  if (
    rawText.includes("地址") ||
    rawText.includes("位置") ||
    rawText.includes("路口") ||
    rawText.includes("集合點")
  ) {
    signals.push({
      id: "location-sensitive",
      label: "地點敏感",
      reason: "地點資訊可能影響人員流向，但目前仍不能視為正式地址或派工位置。",
    });
  }

  return signals;
}

function uniqueSignalLabels(records: Phase0MessyRecord[]) {
  return Array.from(
    new Set(
      records.flatMap((record) =>
        findCoordinationSignals(record).map((signal) => signal.label),
      ),
    ),
  );
}

function CoordinationOverview({
  records,
  onSelectRecord,
}: {
  records: Phase0MessyRecord[];
  onSelectRecord: (recordId: string) => void;
}) {
  const recordsWithSignals = records
    .map((record) => ({
      record,
      signals: findCoordinationSignals(record),
    }))
    .filter(({ signals }) => signals.length > 0);
  const needsReviewCount = records.filter(
    (record) => record.verificationStatus === "needs_review",
  ).length;
  const unverifiedCount = records.filter(
    (record) => record.verificationStatus === "unverified",
  ).length;
  const signalLabels = uniqueSignalLabels(records);
  const topCoordinationItems = recordsWithSignals.slice(0, 5);

  return (
    <div className="v1-coordination">
      <section className="v1-alert" aria-label="現場協調者安全邊界">
        <div>
          <p className="eyebrow">v1 現場協調者視角</p>
          <h2>先找出不能直接安排人力的資訊。</h2>
          <p>
            這個頁面仍只使用 Phase 0 原始資訊。所有提醒都是協調前檢查線索，
            不是已確認現場狀態，也不是派工建議。
          </p>
        </div>
        <dl className="v1-metrics" aria-label="協調總覽數字">
          <div>
            <dt>需要人工確認</dt>
            <dd>{needsReviewCount} 筆</dd>
          </div>
          <div>
            <dt>尚未確認</dt>
            <dd>{unverifiedCount} 筆</dd>
          </div>
          <div>
            <dt>協調風險線索</dt>
            <dd>{recordsWithSignals.length} 筆</dd>
          </div>
        </dl>
      </section>

      <section className="v1-signal-band" aria-label="協調者優先看見的訊號">
        <div>
          <p className="eyebrow">優先掃描</p>
          <h3>這些訊號只代表需要人工追問</h3>
        </div>
        <ul>
          {signalLabels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </section>

      <section className="v1-coordination-grid" aria-label="協調前檢查清單">
        <div className="v1-check-panel">
          <p className="eyebrow">交辦前檢查</p>
          <h3>不能直接變成志工任務的原因</h3>
          <ul>
            <li>查核狀態不是已確認，不能當成現場事實。</li>
            <li>資訊取得方式只說明資料怎麼進來，不代表可信度。</li>
            <li>地點、時間、數量、同意或現場狀況若不完整，應先追問。</li>
            <li>看起來急迫的文字也可能是轉述、過期或互相衝突。</li>
          </ul>
        </div>

        <div className="v1-check-panel">
          <p className="eyebrow">協調者下一步</p>
          <h3>只做資訊整理，不做真實決策</h3>
          <ul>
            <li>把需要追問的欄位交給人類確認。</li>
            <li>保留原文，不把候選判斷改寫成正式任務。</li>
            <li>若資訊會影響人員移動，先標示為不能直接派工。</li>
            <li>回到整理工作台時，仍以低信心與人工確認作為預設。</li>
          </ul>
        </div>
      </section>

      <section
        className="v1-priority-list"
        aria-label="需要協調者優先檢查的原始資訊"
      >
        <div className="panel__header">
          <div>
            <p className="eyebrow">優先檢查</p>
            <h3>可能影響現場安排，但還不能直接使用</h3>
          </div>
          <span>{topCoordinationItems.length} 筆線索</span>
        </div>

        <div className="v1-priority-cards">
          {topCoordinationItems.map(({ record, signals }) => (
            <article className="v1-priority-card" key={record.id}>
              <div className="v1-priority-card__header">
                <h4>{record.id}</h4>
                <span>{record.verificationStatus}</span>
              </div>
              <p>{record.rawText}</p>
              <div className="v1-signal-tags">
                {signals.map((signal) => (
                  <span key={signal.id}>{signal.label}</span>
                ))}
              </div>
              <ul>
                {signals.slice(0, 2).map((signal) => (
                  <li key={signal.id}>{signal.reason}</li>
                ))}
              </ul>
              <button type="button" onClick={() => onSelectRecord(record.id)}>
                到整理工作台檢查
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function V1Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("coordination");
  const [selectedRecordId, setSelectedRecordId] = useState(
    phase0Records[0]?.id ?? "",
  );

  function selectForWorkbench(recordId: string) {
    setSelectedRecordId(recordId);
    setActiveTab("workbench");
  }

  function inspectInWorkbench(recordId: string) {
    setSelectedRecordId(recordId);
    setActiveTab("workbench");
  }

  return (
    <main className="layout">
      <header className="hero">
        <p className="eyebrow">SITCON Camp 2026 / v1</p>
        <h1>現場協調者資訊整理工作台</h1>
        <p>
          v1 著重協調者在交辦前需要看見的風險：哪些資訊還需要人工確認、
          哪些來源不能代表可信度、哪些內容不能直接變成志工任務。
        </p>
      </header>

      <nav className="tabs" aria-label="v1 現場協調者工作區">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "active" : ""}
            type="button"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="panel">
        {phase0Records.length === 0 ? (
          <EmptyState message="目前沒有資料" />
        ) : activeTab === "coordination" ? (
          <CoordinationOverview
            records={phase0Records}
            onSelectRecord={inspectInWorkbench}
          />
        ) : activeTab === "raw" ? (
          <Phase0RawInfoPanel
            records={phase0Records}
            selectedRecordId={selectedRecordId}
            onSelect={selectForWorkbench}
          />
        ) : (
          <Phase0Workbench
            records={phase0Records}
            selectedRecordId={selectedRecordId}
            onSelect={setSelectedRecordId}
          />
        )}
      </section>
    </main>
  );
}
