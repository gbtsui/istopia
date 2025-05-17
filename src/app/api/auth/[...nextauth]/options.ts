import CredentialsProvider from "next-auth/providers/credentials";
import {LoginIdentifierSchema, PasswordSchema} from "@/app/api/data/validation/validation-schemas";
import {prisma} from "@/app/api/data/db";
import bcrypt from "bcrypt";
import {AuthOptions, User} from "next-auth";

export const options: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                identifier: {label: "username/email", type: "text", placeholder: "username/email"},
                password: {label: "password", type: "password"}
            },
            async authorize(credentials: Record<"identifier" | "password", string> | undefined): Promise<User|null>{
                try {
                    if (!credentials) {return null;}
                    const identifier: string = await LoginIdentifierSchema.parseAsync(credentials.identifier)
                    const password: string = await PasswordSchema.parseAsync(credentials.password)

                    const db_user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { name: {equals: identifier, mode: "insensitive" }},
                                { email: {equals: identifier, mode: "insensitive"}}
                            ]
                        }
                    })
                    if (!db_user) {return null;}

                    const pw_match = await bcrypt.compare(password, db_user.password)
                    if (!pw_match) {return null;}

                    const {id, name, email} = db_user;
                    return {id, name, email};
                } catch (e) {
                    console.error(e)
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/signin"
    }
    //add callbacks later
}