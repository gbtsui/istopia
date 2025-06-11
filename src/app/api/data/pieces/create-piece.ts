"use server";

import {DatabaseUser, PieceContent, PieceData} from "@/app/types";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {prisma} from "@/app/api/data/db";
import Slugify from "@/app/api/data/pieces/slugify";

const default_piece_content = {pages: {}}

function CheckDataFullness(data: Partial<PieceData>) {
    return (typeof data.title === "string") && (data.title.trim().length > 0);
} //make sure it has complete data fullness later!!!

export default async function CreatePiece(username: string, data: Partial<PieceData>): Promise<Error | PieceData> {
    const user = await GetUserSession()
    if (!user || user.name != username) {
        return new Error("Unauthorized")
    }

    const db_user: DatabaseUser | null = await prisma.user.findUnique({where: {name: username}});
    if (!db_user) {
        return new Error("it appears that this user doesnt exist. you shouldn't have been able to get this far. how???")
    }

    if (!CheckDataFullness(data)) return new Error("Title is necessary!")

    const title_slug = await Slugify(data.title as string)

    const existing_slug: PieceData | null = await prisma.piece.findFirst({
        where: {
            slug: title_slug,
            author: {name: username}
        }
    }) as unknown as PieceData
    if (existing_slug) return new Error("slug already exists! retitle your piece.")

    const untyped_result = await prisma.piece.create({
        data: {
            author_id: db_user.id,
            title: data.title as string,
            slug: title_slug,
            summary: data.summary as string,
            published: false,
            views: 0,
            content: default_piece_content //as InputJsonObject
        }
    })

    return {
        ...untyped_result,
        content: default_piece_content as PieceContent,
    }
}