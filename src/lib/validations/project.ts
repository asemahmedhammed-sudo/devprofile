import { z } from 'zod';

export const projectSchema = z.object({
  id:             z.string().optional(),
  title_en:       z.string().min(3, 'English title must be at least 3 characters'),
  title_ar:       z.string().min(3, 'العنوان العربي يجب أن يكون 3 أحرف على الأقل'),
  description_en: z.string().min(10, 'English description must be at least 10 characters'),
  description_ar: z.string().min(10, 'الوصف العربي يجب أن يكون 10 أحرف على الأقل'),
  tech_stack:     z.string().min(1, 'Add at least one technology'),
  category:       z.string().optional().default(''),
  live_link:      z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github_link:    z.string().url('Must be a valid URL').optional().or(z.literal('')),
  image_url:      z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

