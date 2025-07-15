"use server";

import { prisma } from "@/app/api/data/db";
import { PieceMetaData, Result } from "@/app/types";

export default async function GetPieces(params: {
    amount: number;
    sortBy: "random" | "views" | "rating" | "hot";
}): Promise<Result<Array<PieceMetaData>>> {
    const { amount, sortBy } = params;

    const result = await prisma.piece.findMany({
        where: {
            published: true,
        },
        select: {
            id: true,
            author: {
                select: {
                    id: true,
                    name: true,
                },
            },
            saves: true,
            title: true,
            slug: true,
            summary: true,
            cover_image_link: true,
        },
        take: amount,
    });

    const pieceIds = result.map((r) => r.id);

    if (pieceIds.length === 0) {
        return { success: true, data: [] };
    }

    const counts = await prisma.view.groupBy({
        by: ["piece_id"],
        _count: {
            piece_id: true,
        },
        where: {
            piece_id: {
                in: pieceIds,
            },
        },
    });

    const viewCountMap = new Map<string, number>(
        counts.map((c) => [c.piece_id!, c._count.piece_id])
    );

    const resultAsPieceData: Array<PieceMetaData> = result.map((piece) => ({
        ...piece,
        author_id: piece.author.id,
        author_name: piece.author.name,
        view_number: viewCountMap.get(piece.id) || 0,
        save_number: piece.saves.length,
        saves: piece.saves,
    }));

    return { success: true, data: resultAsPieceData };
}