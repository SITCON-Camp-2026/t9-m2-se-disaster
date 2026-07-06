import { describe, expect, it } from "vitest";
import { z } from "zod";
import reports from "../src/fixtures/shared/reports.json";
import { reportsSchema } from "../src/contracts";
import { safeParseFixture } from "../src/lib/load-fixture";

describe("data contract", () => {
  it("validates shared reports", () => {
    expect(() => reportsSchema.parse(reports)).not.toThrow();
  });

  it("reports fixture labels when validation fails", () => {
    const result = safeParseFixture(
      z.object({ id: z.string() }),
      {},
      "demo.json",
    );
    expect(result.success).toBe(false);
    if (!result.success) expect(result.message).toContain("demo.json");
  });
});
