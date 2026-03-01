import { z } from "zod";

export const CreateIncidentSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  category: z.string().min(3),
  description: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export type CreateIncidentInput = z.infer<typeof CreateIncidentSchema>;
