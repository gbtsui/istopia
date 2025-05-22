import {z} from "zod";

export const UserNameSchema = z.string()
    .min(1, "username is required")
    .max(255, "username must be under 255 characters long")
    .regex(/^[a-zA-Z0-9._-]+$/, "username can only contain letters, numbers, hyphens, underscores, or periods");

export const UserDisplayNameSchema = z.string()
    .max(255, "display name must be less than 255 characters long")

export const EmailSchema = z.string()
    .min(1, "email is required")
    .max(255, "email must be less than 255 characters long")
    .email("email address must be in a valid format")

export const PasswordSchema = z.string()
    .min(1, "password is required")
    .max(255, "password must be less than 255 characters long")

export const LoginIdentifierSchema = z.string()
    .min(1, "username or email is required")
    .max(255, "input must be under 255 characters")
    .refine(
        val => /^[a-zA-Z0-9._-]+$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        {
            message: "input must be a valid username or email",
        }
    );

export const TitleSchema = z.string()
    .min(1, "title is required")
    .max(255, "title must be less than 255 characters long")

export const SummarySchema = z.string()
    .max(2000, "summary must be less than 2000 characters long")
    .optional()