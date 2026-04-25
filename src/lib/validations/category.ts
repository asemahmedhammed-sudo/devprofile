import { z } from 'zod';

export const SECTIONS = ['skill', 'project', 'experience'] as const;
export type Section = (typeof SECTIONS)[number];

export const categorySchema = z.object({
  id:      z.string().optional(),
  name_en: z.string().min(1, 'English name is required'),
  name_ar: z.string().min(1, 'الاسم بالعربية مطلوب'),
  section: z.enum(SECTIONS, { required_error: 'Section is required' }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
