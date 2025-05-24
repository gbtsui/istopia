"use server"

//ok so basically we need a signup flow which is like
//idk
//email
//username
//display name (optional)
//password
//then it sends an email with a code to the email to confirm the account
//and then *only then* does it actually make the user

import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {redirect} from "next/navigation";

export default async function SignUpPage() {
    const user = await GetUserSession();
    if (user) {
        redirect("/dashboard")
    }

    return (
        <div>
            sign up!!!!
        </div>
    )
}