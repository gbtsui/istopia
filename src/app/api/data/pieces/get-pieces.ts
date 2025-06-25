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
            views: true
        }
    })

    const resultAsPieceData: Array<PieceMetaData> = result.map((piece) => {
        return {
            ...piece,
            view_number: piece.views.length,
            author_name: piece.author.name,
        } satisfies PieceMetaData
    })

    return {success: true, data: resultAsPieceData}
}

