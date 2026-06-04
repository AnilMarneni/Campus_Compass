import { z } from 'zod';

export const CollegesQuerySchema = z.object({
  search: z.string().optional().default(''),
  location: z.string().optional().default(''),
  minFees: z.coerce.number().optional().default(0),
  maxFees: z.coerce.number().optional().default(10000000),
  minRating: z.coerce.number().optional().default(0),
  courseType: z.string().optional().default(''),
  institutionType: z.string().optional().default(''),
  nirfCategory: z.string().optional().default(''),
  sortBy: z.enum(['rating', 'fees', 'name', 'nirfRank', 'nirfScore']).optional().default('rating'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(9),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const SavedActionSchema = z.object({
  collegeId: z.string().min(1, "College ID is required"),
});

export const CompareQuerySchema = z.object({
  ids: z.string().min(1, "At least one College ID is required").refine(
    (val) => {
      const parts = val.split(',').filter(Boolean);
      return parts.length >= 1 && parts.length <= 3;
    },
    { message: "You can compare between 1 and 3 colleges" }
  ),
});

export const PredictorQuerySchema = z.object({
  exam: z.string().min(1, "Exam is required"),
  stream: z.string().min(1, "Stream preference is required"),
  category: z.string().min(1, "Category is required"),
  rank: z.coerce.number().min(1, "Rank must be at least 1"),
});

export const SaveComparisonSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  collegeIds: z.array(z.string()).min(1, "At least one College ID is required").max(3, "You can compare up to 3 colleges"),
});

export type CollegesQueryInput = z.infer<typeof CollegesQuerySchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type SavedActionInput = z.infer<typeof SavedActionSchema>;
export type CompareQueryInput = z.infer<typeof CompareQuerySchema>;
export type PredictorQueryInput = z.infer<typeof PredictorQuerySchema>;
export type SaveComparisonInput = z.infer<typeof SaveComparisonSchema>;

