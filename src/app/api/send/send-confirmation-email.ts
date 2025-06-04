"use server";
import {Resend} from "resend";
import {DatabaseUser} from "@/app/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function SendConfirmationEmail(data: DatabaseUser) {
    const result = await resend.emails.send({
        from: "do-not-reply.istopia@gbtsui.dev",
        to: data.email,
        subject: "welcome to istopia!",
        html: "<h1>welcome to istopia!</h1>" +
            "<p>i'm really glad that you decided to try out my app." +
            "i'm gabriel augustine, the creator of istopia. if you have any questions," +
            "email me at gabriel.tsui@protonmail.com ! " +
            "hoping that you'll enjoy it.</p>" +
            "<p>right now the site's an absolute mess. it's still in development!" +
            "features may not work right or exist at all. please be patient! i'm working to fix everything up :)</p>"
    })
    console.log(result)
    return result
}