"use server"

import {prisma} from "@/app/api/data/db";
import {PieceMetaData, Result} from "@/app/types";

export default async function GetPieces(params: {amount: number, sortBy: "random" | "views" | "rating" | "hot"}): Promise<Result<Array<PieceMetaData>>> {
    const {amount, sortBy} = params;

    const result = await prisma.piece.findMany({
        where: {
            published: true
        },
        include: {
            author: true,
        }
    })

    const resultAsPieceData: Array<PieceMetaData> = result.map((piece) => {
        return {
            id: piece.id,
            author_id: piece.author_id,
            author_name: piece.author.name,
            title: piece.title,
            slug: piece.slug,
            summary: piece.summary,
            rating: piece.rating,
        }
    })

    return {success: true, data: resultAsPieceData}
}

