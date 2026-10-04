import { z } from "zod";

export const createEntrySchema = z.object({
  guest_name: z.string().trim().min(1, "이름을 입력해 주세요.").max(50),
  amount: z.number().int().positive("금액은 1원 이상이어야 합니다."),
  memo: z.string().trim().max(200).nullable().optional(),
});

export const updateEntrySchema = createEntrySchema;

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;

export type Entry = {
  id: string;
  guest_name: string;
  amount: number;
  memo: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
