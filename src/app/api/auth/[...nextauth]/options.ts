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

                    const {id, name, email, profile_picture_link} = db_user;
                    return {id, name, email, image: profile_picture_link};
                } catch (e) {
                    console.error(e)
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/signin"
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.name = user.name ?? "";
                token.email = user.email ?? "";
                token.picture = user.image ?? "";

                token.id = user.id;
            }

            const db_user = await prisma.user.findUnique({
                where: {id: token.id as string},
                select: {profile_picture_link: true}
            })

            if (db_user) {
                token.picture = db_user.profile_picture_link
            }
            console.log(token)
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.picture as string;

            }
            console.log(token)
            console.log(session)
            return session;
        },
    }
}