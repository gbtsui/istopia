"use server";

import {prisma} from "@/app/api/data/db";
import {User} from "@/generated/prisma";
import bcrypt from "bcrypt"
import ValidateUserCredentials from "@/app/api/data/user-management/validate-user-credentials";
import {PublicUser, Result} from "@/app/types";
import {SendWelcomeEmail} from "@/app/api/send/send-confirmation-email";


export default async function CreateUser(credentials: {name: string, display_name: string, email: string, password: string}): Promise<Result<PublicUser>>{
    let result: Result<PublicUser>;
    try {
        const validation_result = await ValidateUserCredentials(credentials);
        if (validation_result instanceof Error) {
            throw validation_result;
        }
        const {name, display_name, email, password} = validation_result;

        const hashed_password = await bcrypt.hash(password, 12);

        const user_with_existing_credentials: User | null = await prisma.user.findFirst({
            where: {
                OR: [
                    { name: {equals: name, mode: "insensitive" }},
                    { email: {equals: email, mode: "insensitive"}}
                ]
            }
        })

        if (user_with_existing_credentials != null){
            if (user_with_existing_credentials.email == email) {
                throw new Error("EMAIL_IN_USE")
            } else if (user_with_existing_credentials.name == name) {
                throw new Error("USERNAME_IN_USE")
            }
        }

        //if (!display_name) { display_name = name }

        const user: User = await prisma.user.create({
            data: {
                name,
                display_name: display_name ?? name,
                email,
                password: hashed_password
            }
        });

        console.log("created user" + user.name)

        result = {success: true, data: user as PublicUser}

        await SendWelcomeEmail(user.email)
    } catch (err) {
        if (err instanceof Error) {
            result = {success: false, error: err.message}
        } else {
            result = {success: false, error: "UNKNOWN_ERROR"}
        }
    }

    return result
}

