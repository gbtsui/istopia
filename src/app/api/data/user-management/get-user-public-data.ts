"use server";

import {DatabaseUser, PublicUser} from "@/app/types";
import GetUserData from "@/app/api/data/user-management/get-user-data";

export default async function GetUserPublicData({name, id} : {name?: string, id?: string}): Promise<null|PublicUser> {
    const db_user: DatabaseUser | null = await GetUserData({name, id});
    if (!db_user) return null;

    return {
        ...db_user,
    } as PublicUser;
}