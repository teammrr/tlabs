import { z } from "zod";
import en from "../content/en.json";

const categories = en.problem.category.options.map((o) => o.value) as [string, ...string[]];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => value || null);

export const problemSchema = z
  .object({
    problem: z.string().trim().min(1).max(2000),
    who: optionalText(200),
    today: optionalText(300),
    category: z.array(z.enum(categories)).max(categories.length).default([]),
    nickname: optionalText(80),
    email: optionalText(200).refine((v) => v === null || z.email().safeParse(v).success, "invalid_email"),
    lineId: optionalText(80),
    consent: z.boolean().default(false),
    language: z.enum(["en", "th"]),
    company_website: z.string().max(200).nullish(), // honeypot
  })
  .superRefine((data, ctx) => {
    if ((data.nickname || data.email || data.lineId) && !data.consent) {
      ctx.addIssue({ code: "custom", path: ["consent"], message: "consent_required" });
    }
  });

export type ProblemInput = z.infer<typeof problemSchema>;
