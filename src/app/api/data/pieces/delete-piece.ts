"use server";

import {Result} from "@/app/types";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {prisma} from "@/app/api/data/db";

export default async function DeletePiece(username: string, id: string): Promise<Result<boolean>> {
    const user = await GetUserSession();
    if (!user || user.name !== username) {
        return {success: false, error: "unauthorized"};
    }

    await prisma.piece.delete({
        where: {
            author: {name: username},
            id
        }
    });

    return {success: true, data: true}
}