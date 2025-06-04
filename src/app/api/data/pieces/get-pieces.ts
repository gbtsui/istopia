"use server"

import {prisma} from "@/app/api/data/db";
import {PieceContent, PieceData, Result} from "@/app/types";

export default async function GetPieces(params: {amount: number, sortBy: "random" | "views" | "rating" | "hot"}): Promise<Result<Array<PieceData>>> {
    const {amount, sortBy} = params;

    const result = await prisma.piece.findMany({

    })

    const resultAsPieceData: Array<PieceData> = result.map((piece) => {
        return {
            ...piece,
            content: piece.content as unknown as PieceContent,
        }
    })

    return {success: true, data: resultAsPieceData}
}