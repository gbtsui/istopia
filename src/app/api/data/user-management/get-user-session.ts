"use server";

import {options} from "@/app/api/auth/[...nextauth]/options";
import {getServerSession} from "next-auth";

export default async function GetUserSession() {
    const session = await getServerSession(options);
    return session?.user ?? null;
}