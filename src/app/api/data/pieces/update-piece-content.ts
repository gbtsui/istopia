"use server";

import {DatabaseUser, PieceContent, Result} from "@/app/types";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {prisma} from "@/app/api/data/db";
import { InputJsonValue } from "@prisma/client/runtime/library";
import GetUserData from "@/app/api/data/user-management/get-user-data";

type UpdatePieceContentParams = {
    username: string,
    piece_id: string,
    piece_content: PieceContent,
    published?: boolean,
}

export default async function UpdatePieceContent({username, piece_id, piece_content, published}: UpdatePieceContentParams): Promise<Result<Date>> {
    try {
        const user = await GetUserSession()
        if (!user || user.name !== username) {
            throw new Error("unauthorized")
        }

        const db_user: DatabaseUser | null = await GetUserData({name: user.name})
        if (!db_user) {
            throw new Error("it appears that this user doesnt exist. you shouldn't have been able to get this far. how???")
        }

        await prisma.piece.update({
            where: {id: piece_id, author_id: db_user.id}, //redundancy :3
            data: {content: piece_content as unknown as InputJsonValue, last_updated: new Date(), published}
        })

        return {success: true, data: new Date()}
    } catch (error) {
        if (error instanceof Error) return {success: false, error: error.message}
        return {success: false, error: "unknown error"}
    }
}