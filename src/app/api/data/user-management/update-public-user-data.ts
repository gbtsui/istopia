"use server";

import {PublicUser} from "@/app/types";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {prisma} from "@/app/api/data/db";

export default async function UpdatePublicUserData(data: PublicUser): Promise<boolean|Error> {
    const session_user = await GetUserSession();
    const {name, display_name, summary_text, about_me} = data;

    if (!session_user || !(session_user.name == name)) {
        return new Error("Unauthorized");
    }

    return prisma.user.update({
        where: {name: name},
        data: {
            display_name,
            summary_text,
            about_me
        }
    }) as unknown as boolean
}