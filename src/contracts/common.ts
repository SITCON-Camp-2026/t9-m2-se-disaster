import { z } from "zod";

export const verificationStatusSchema = z.enum([
  "unverified",
  "needs_review",
  "verified",
  "rejected",
]);
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;

export const sourceTypeSchema = z.enum([
  "field_report",
  "phone_call",
  "social_post",
  "official_notice",
  "volunteer_update",
  "mock",
]);
export type SourceType = z.infer<typeof sourceTypeSchema>;

export const commonRecordSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  sourceType: sourceTypeSchema,
  verificationStatus: verificationStatusSchema,
});
export type CommonRecord = z.infer<typeof commonRecordSchema>;
