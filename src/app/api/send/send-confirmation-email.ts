"use server";
import {Resend} from "resend";
import {prisma} from "@/app/api/data/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendWelcomeEmail(email: string) {
    const result = await resend.emails.send({
        from: "do-not-reply.istopia@gbtsui.dev",
        to: email,
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

export async function SendConfirmationEmail(email: string) {
    const code = crypto.randomUUID().slice(0, 6)

    await prisma.unconfirmedUser.deleteMany({where: {email}})

    await prisma.unconfirmedUser.create({
        data: {
            email: email,
            confirmationCode: code,
        }
    })

    return await resend.emails.send({
        from: "do-not-reply.istopia@gbtsui.dev",
        to: email,
        subject: "istopia: verify email",
        html: "<h1>hi! pls verify your email</h1>" +
            "<p>to prevent spam and other unfun things, please enter this" +
            "one time code to finish your signup.</p>" +
            `<p>${code}</p>` +
            "<p>thanks for understanding!</p>"
    })
}