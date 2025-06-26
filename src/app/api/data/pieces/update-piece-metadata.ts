"use server";

import {DatabaseUser, PieceMetaData, Result} from "@/app/types";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {prisma} from "@/app/api/data/db";
import GetUserData from "@/app/api/data/user-management/get-user-data";

type UpdatePieceMetaDataParams = {
    username: string,
    piece_id: string,
    metadata: Partial<PieceMetaData>,
}

export default async function UpdatePieceMetaData({username, piece_id, metadata}: UpdatePieceMetaDataParams): Promise<Result<null>> {
    try {
        const user = await GetUserSession()
        if (!user || user.name !== username) {
            throw new Error("unauthorized")
        }

        const db_user: DatabaseUser | null = await GetUserData({name: user.name})
        if (!db_user) {
            throw new Error("it appears that this user doesnt exist. you shouldn't have been able to get this far.")
        }

        await prisma.piece.update({
            where: {id: piece_id, author_id: db_user.id},
            data: {
                title: metadata.title,
                slug: metadata.slug,
                summary: metadata.summary
            }
        })
        return {success: true, data: null}
    } catch (error) {
        if (error instanceof Error) return {success: false, error: error.message};
        return {success: false, error: "unknown error"};
    }
}