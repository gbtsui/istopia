"use server";

import {DatabaseUser, PublicUser} from "@/app/types";
import GetUserData from "@/app/api/data/user-management/get-user-data";

export default async function GetUserPublicData({name, id} : {name?: string, id?: string}): Promise<null|PublicUser> {
    const db_user: DatabaseUser | null = await GetUserData({name, id});
    if (!db_user) return null;
    return {
        name: db_user.name,
        display_name: db_user.display_name,
        summary_text: db_user.summary_text,
        created_at: db_user.created_at,
        about_me: db_user.about_me
    }
}