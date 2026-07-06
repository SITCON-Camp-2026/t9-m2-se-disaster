import { z } from "zod";

type FixtureParseResult<T> =
  { success: true; data: T } | { success: false; message: string };

function formatFixtureError(label: string, error: z.ZodError): string {
  const issues = error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
    return `${path}: ${issue.message}`;
  });
  return [`Invalid fixture: ${label}`, ...issues].join("\n");
}

export function safeParseFixture<T>(
  schema: z.ZodType<T>,
  data: unknown,
  label: string,
): FixtureParseResult<T> {
  const result = schema.safeParse(data);
  if (result.success) return result;
  return { success: false, message: formatFixtureError(label, result.error) };
}

export function parseFixture<T>(
  schema: z.ZodType<T>,
  data: unknown,
  label: string,
): T {
  const result = safeParseFixture(schema, data, label);
  if (result.success) return result.data;
  throw new Error(result.message);
}
