"use server";

import {prisma} from "@/app/api/data/db";
import {PieceContent, PieceData} from "@/app/types";
import Parse from "@/app/engine/parser";
import {File2PieceContent, migratePieceContentV1_V2} from "@/app/api/data/pieces/piece-structure-migrator";

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
    const updated_content = migratePieceContentV1_V2(db_piece.content as unknown as File2PieceContent)
    const content: PieceContent = await Parse(updated_content)
    return {
        ...db_piece,
        view_number: db_piece.views.length,
        content: content,
    }
}