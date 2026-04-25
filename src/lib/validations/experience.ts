import { z } from 'zod';

export const experienceSchema = z.object({
  id:              z.string().optional(),
  company_en:      z.string().min(1, 'Company name (EN) is required'),
  company_ar:      z.string().optional().default(''),
  position_en:     z.string().min(1, 'Position (EN) is required'),
  position_ar:     z.string().optional().default(''),
  description_en:  z.string().optional().default(''),
  description_ar:  z.string().optional().default(''),
  employment_type: z.string().optional().default('Full-time'),
  start_date:      z.string().min(1, 'Start date is required'),
  // null string means "Present / current role"
  end_date:        z.string().optional().default(''),
  is_current:      z.boolean().default(false),
  company_url:     z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

