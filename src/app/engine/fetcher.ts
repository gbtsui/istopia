"use server";

import {prisma} from "@/app/api/data/db";
import {PieceContent, PieceData} from "@/app/types";
import Parse from "@/app/engine/parser";

export default async function FetchPieceData(username: string, slug: string): Promise<null | PieceData> {
    const db_piece = await prisma.piece.findFirst({
        where: {
            slug: slug,
            author: {
                name: username
            }
        }
    })
    if (!db_piece) {
        return null
    }
    const content: PieceContent = await Parse(db_piece.content)
    return {
        id: db_piece.id,
        author_id: db_piece.author_id,
        title: db_piece.title,
        slug: db_piece.slug,
        summary: db_piece.slug,
        published: db_piece.published,
        rating: db_piece.rating,
        views: db_piece.views,
        created_at: db_piece.created_at,
        last_updated: db_piece.last_updated,
        content: content,
    } as PieceData
}