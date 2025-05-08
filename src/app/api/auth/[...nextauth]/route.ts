import NextAuth from 'next-auth';
import {CredentialsProvider} from 'next-auth/providers';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                identifier: {label: "username/email", type: "text", placeholder: "username/email"},
                password: {label: "password", type: "password"}
            },
            //async authorize(credentials, req){
                //add authorize data
            //}
        })
    ]
})

export {handler as GET, handler as POST}