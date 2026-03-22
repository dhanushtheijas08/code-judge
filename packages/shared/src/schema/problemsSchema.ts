import { z } from "zod";

export const id = z.uuid();
export const slugSchema = z.object({
  slug: z.string().min(1, { message: "Slug must be >= 1" }),
});
export const supportedLanguageSchema = z.enum(["js", "c", "cpp", "py", "java"]);
export const supportedLanguageQuerySchema = z.object({
  lang: supportedLanguageSchema.default("c"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1, { message: "Page must be >= 1" }).default(1),

  limit: z.coerce
    .number()
    .refine((val) => [10, 20, 30].includes(val), {
      message: "Limit must be one of 10, 20, 30",
    })
    .default(10),

  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  search: z.string().optional(),
  sort: z
    .enum([
      "createdAt",
      "acceptance-asc",
      "acceptance-desc",
      "difficulty",
      "title-asc",
    ])
    .optional(),
});

export type PaginationSchema = z.infer<typeof paginationSchema>;
export type IdType = z.infer<typeof id>;
export type SupportedLanguageSchema = z.infer<typeof supportedLanguageSchema>;
