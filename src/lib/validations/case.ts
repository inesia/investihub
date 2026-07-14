import { z } from "zod";

export const createCaseSchema = z.object({
  policyNumber: z
    .string()
    .min(3, "Policy number must be at least 3 characters")
    .max(50, "Policy number is too long"),
  insuredName: z
    .string()
    .min(2, "Insured name must be at least 2 characters")
    .max(100, "Insured name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  clientId: z.string().min(1, "Please select a client"),
  assigneeId: z.string().optional(),
  status: z.enum([
    "NEW",
    "ON_PROGRESS",
    "CLOSED",
  ]),
  city: z.string().min(1, "Please select a city/regency").optional(),
  scheduleInvestigator: z.string().optional(),
  documents: z.array(z.any()).optional(),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
