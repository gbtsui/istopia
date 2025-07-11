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
            where: { id: params.id },
            include: {views: true}
        });
    } else if ("slug" in params && "username" in params) {
        db_piece = await prisma.piece.findFirst({
            where: {
                slug: params.slug,
                author: {
                    name: params.username
                }
            },
            include: {
                views: true
            }
        });
    }


    if (!db_piece) {
        return null
    }
    const content: PieceContent = await Parse(db_piece.content)
    return {
        ...db_piece,
        view_number: db_piece.views.length,
        content: content,
    } as PieceData
}