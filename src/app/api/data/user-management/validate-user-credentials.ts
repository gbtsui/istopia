"use server";

import {object, string, ZodError} from "zod";

const UserSchema = object({
    name: string({required_error: "username is required"})
        .max(255, "username must be less than 255 characters"),
    display_name: string()
        .max(255, "display name must be less than 255 characters"),
    email: string({required_error: "email is required"})
        .max(255, "email must be less than 255 characters")
        .email("email must be in a valid format"),
    password: string({required_error: "password is required"})
        .min(8, "password must be at least 8 characters")
        .max(255, "password must be less than 255 characters"),
    code: string({required_error: "code is required"})
        .length(6, "code is 6 characters")
})

type UserCredentials = {
    name: string,
    display_name: string | undefined,
    email: string,
    password: string,
    code: string,
}

export default async function ValidateUserCredentials(credentials: {name: string, display_name: string | undefined, email: string, password: string, code: string}): Promise<UserCredentials | ZodError> {
    return UserSchema.parseAsync(credentials)
}