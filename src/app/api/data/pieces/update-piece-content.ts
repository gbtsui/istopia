"use server";

import {DatabaseUser, PieceContent, PieceData} from "@/app/types";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {prisma} from "@/app/api/data/db";
import { InputJsonValue } from "@prisma/client/runtime/library";

type UpdatePieceContentParams = {
    username: string,
    piece_id: string,
    piece_content: PieceContent
}

export default async function UpdatePieceContent({username, piece_id, piece_content}: UpdatePieceContentParams) {
    const user = await GetUserSession()
    if (!user || user.name != username) {
        return new Error("Unauthorized")
    }

    const db_user: DatabaseUser | null = await prisma.user.findUnique({where: {name: username}});
    if (!db_user) {
        return new Error("it appears that this user doesnt exist. you shouldn't have been able to get this far. how???")
    }

    const result = await prisma.piece.update({
        where: {id: piece_id, author_id: db_user.id}, //redundancy :3
        data: {content: piece_content as unknown as InputJsonValue}
    })

    return {
        ...result,
        content: result.content as unknown as PieceContent
    }
}