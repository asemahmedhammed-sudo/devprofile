import { z } from 'zod';

export const skillSchema = z.object({
  id:                z.string().optional(),
  name_en:           z.string().min(1, 'English name is required'),
  name_ar:           z.string().optional().default(''),
  category_en:       z.string().optional().default(''),
  category_ar:       z.string().optional().default(''),
  proficiency_level: z.enum(['expert', 'proficient', 'familiar']).default('proficient'),
});

export type SkillFormValues = z.infer<typeof skillSchema>;
