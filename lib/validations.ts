import { z } from "zod";

// ─── Auth Schemas ──────────────────────────────────────────────

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// ─── Event Schemas ─────────────────────────────────────────────

export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be under 120 characters"),
  description: z.string().max(5000).optional(),
  location: z.string().max(200).optional(),
  venue: z.string().max(200).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  eventDate: z.string().optional(),
  endDate: z.string().optional(),
  capacity: z.coerce.number().int().positive().optional(),
  price: z.coerce.number().min(0).default(0),
  isFree: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  categoryId: z.string().optional(),
});

export const updateEventSchema = createEventSchema.partial();

// ─── RSVP Schema ───────────────────────────────────────────────

export const rsvpSchema = z.object({
  status: z.enum(["GOING", "MAYBE", "NOT_GOING"]),
  note: z.string().max(500).optional(),
});

// ─── Profile Schema ────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  image: z.string().url().optional().or(z.literal("")),
});

// ─── Category Schema ───────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#6366f1"),
});

// ─── Query Params ──────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(["newest", "oldest", "popular", "price-low", "price-high"]).default("newest"),
});

// ─── Type exports ──────────────────────────────────────────────

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
