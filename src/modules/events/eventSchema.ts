import { z } from 'zod';

export const eventFormSchema = z.object({
  title: z.string().min(2, 'Title is required.'),
  date: z.string().min(1, 'Date is required.'),
  time: z.string().min(1, 'Time is required.'),
  category: z.enum(['memory', 'event', 'appointment']),
  location: z.string().min(2, 'Location is required.'),
  notes: z.string().min(5, 'Please add a few notes.'),
  mood: z.string().min(2, 'Mood is required.'),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
