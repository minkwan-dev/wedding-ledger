import { z } from "zod";

export const SIDES = ["groom", "bride"] as const;
export const RELATIONS = [
  "family",
  "parents",
  "work",
  "friend",
  "school",
  "community",
  "other",
] as const;

export type Side = (typeof SIDES)[number];
export type Relation = (typeof RELATIONS)[number];

export const createEntrySchema = z.object({
  guest_name: z.string().trim().min(1, "성함을 입력해 주세요.").max(50),
  amount: z.number().int().positive("금액은 1원 이상이어야 합니다."),
  memo: z.string().trim().max(200).nullable().optional(),
  side: z.enum(SIDES, { message: "신랑측·신부측을 선택해 주세요." }),
  relation: z.enum(RELATIONS).nullable().optional(),
});

export const updateEntrySchema = createEntrySchema;

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;

export type Entry = {
  id: string;
  guest_name: string;
  amount: number;
  memo: string | null;
  side: Side | null;
  relation: Relation | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
