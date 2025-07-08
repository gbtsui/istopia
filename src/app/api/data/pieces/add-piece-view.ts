"use server";

import {DatabaseUser, Result} from "@/app/types";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {prisma} from "@/app/api/data/db";

type AddPieceViewParams = {
    piece_id: string,
    username: string,
}

export default async function addPieceView(params: AddPieceViewParams): Promise<Result<null>> {
    const user = await GetUserSession()
    if (!user || user.name != params.username) {
        return {success: false, error: "Unauthorized"}
    }

    const db_user: DatabaseUser | null = await prisma.user.findUnique({where: {name: params.username}, include: {save_buckets: {include: {saved_pieces: true}}, views: true}});
    if (!db_user) {
        return {success: false, error: ("User not found in database :(")}
    }

    await prisma.view.create({
        data: {
            user_id: db_user.id,
            piece_id: params.piece_id
        }
    })

    return {success: true, data: null}
}