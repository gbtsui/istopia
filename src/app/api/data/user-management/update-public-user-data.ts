"use server";

import {PublicUser} from "@/app/types";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {prisma} from "@/app/api/data/db";
import {revalidatePath} from "next/cache";

export default async function UpdatePublicUserData(data: PublicUser): Promise<PublicUser|Error> {
    const session_user = await GetUserSession();
    const {name, display_name, summary_text, about_me} = data;

    if (!session_user || !(session_user.name == name)) {
        return new Error("Unauthorized");
    }

    revalidatePath("/u/"+name);

    return await prisma.user.update({
        where: {name: name},
        data: {
            display_name,
            summary_text,
            about_me
        }
    }) as PublicUser;
}