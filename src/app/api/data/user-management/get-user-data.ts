"use server";

import {prisma} from "@/app/api/data/db";
import {DatabaseUser} from "@/app/types";

export default async function GetUserData({name, id} : {name?: string, id?: string}): Promise<DatabaseUser | null> {
    return prisma.user.findFirst({
        where: {
            OR: [
                {name},
                {id}
            ]
        },
        include: {
            save_buckets: {include: {saved_pieces: true}},
            views: true
        }
    })
}