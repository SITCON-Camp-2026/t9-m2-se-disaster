import { labelForStatus } from "./status-labels";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`status-badge status-${status}`}>
      {labelForStatus(status)}
    </span>
  );
}
