"use server";

import {prisma} from "@/app/api/data/db";
import {User} from "@/generated/prisma"

export default async function GetUserData(name: string): Promise<User | null> {
    return prisma.user.findFirst({
        where: {name}
    })
}