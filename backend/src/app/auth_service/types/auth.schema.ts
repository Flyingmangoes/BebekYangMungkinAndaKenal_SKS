import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_.]+$/),
  fullname: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  password: z.string().min(8).max(72),                
  phoneNumber: z.string().trim().max(20).default(""),
  location: z.string().trim().max(100).default(""),
  country: z.string().trim().max(60).default(""),
  timezone: z.string().trim().max(10).default(""),
  consentSrc: z.string().max(50).default("web-register"),
  emailConsent: z.boolean(),
  phoneNumberConsent: z.boolean(),
});

export const loginSchema = z
  .object({
    username: z.string().trim().min(1).optional(),
    email: z.string().trim().min(1).optional(),
    password: z.string().min(1).max(72),
  })
  .refine((v) => v.username || v.email, { 
    message: "username or email is required", 
    path: ["username"],
  });

export const refreshSchema = z.object({ refreshToken: z.string().min(20).max(200) });

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RefreshInput = z.infer<typeof refreshSchema>
export interface PublicUserDTO {
  UserID: string;
  Username: string;
  Fullname: string;
  Role: "admin" | "employee" | "user" | "guest";
  Email: string;
  PhoneNumber: string;
  Location: string;
  Country: string;
  EmailConsent: boolean;
  PhoneNumberConsent: boolean;
  ConsentAt: string;
  CreatedAt: string;
  UpdatedAt: string;
}