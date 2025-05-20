"use server";

import {prisma} from "@/app/api/data/db";
import {PieceContent, PieceData} from "@/app/types";
import Parse from "@/app/engine/parser";

type FetchBySlugParams = {
    username: string;
    slug: string;
}

type FetchByIdParams = {
    id: string;
}

export default async function FetchPieceData(params: FetchByIdParams | FetchBySlugParams): Promise<null | PieceData> {
    let db_piece = null;

    if ("id" in params) {
        db_piece = await prisma.piece.findUnique({
            where: { id: params.id }
        });
    } else if ("slug" in params && "username" in params) {
        db_piece = await prisma.piece.findFirst({
            where: {
                slug: params.slug,
                author: {
                    name: params.username
                }
            }
        });
    }


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