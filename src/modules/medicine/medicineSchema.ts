import { z } from 'zod';

export const medicineFormSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  dosage: z.string().min(2, 'Dosage is required.'),
  frequency: z.string().min(2, 'Frequency is required.'),
  reminderTime: z.string().min(1, 'Reminder time is required.'),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().min(1, 'End date is required.'),
  notes: z.string().min(5, 'Please describe the medicine.'),
  category: z.enum(['prescription', 'supplement', 'vitamin']),
});

export type MedicineFormValues = z.infer<typeof medicineFormSchema>;
