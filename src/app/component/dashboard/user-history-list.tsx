"use server";

import { prisma } from "@/app/api/data/db";
import {PieceMetaData, PublicUser} from "@/app/types";
import PieceMetadataThumbnailThingy from "@/app/component/piece/piece-metadata-thumbnail-thingy";

type UserHistoryListProps = {
    user: PublicUser;
    is_user: boolean;
};

export default async function UserHistoryList(props: UserHistoryListProps) {
    const { user, is_user } = props;

    if (!user || !is_user) {
        return null;
    }

    const views = await prisma.view.findMany({
        where: {
            user: {
                name: user.name,
            },
        },
        orderBy: {
            timestamp: "asc",
        },
        take: 10,
        select: {
            piece_id: true,
            timestamp: true,
        },
    });

    const pieceIds = views.map((v) => v.piece_id);

    if (pieceIds.length === 0) {
        return [];
    }

    const pieces = await prisma.piece.findMany({
        where: {
            id: { in: pieceIds },
        },
        select: {
            id: true,
            author_id: true,
            title: true,
            slug: true,
            summary: true,
            cover_image_link: true,
            views: true,
            saves: true,
        },
    });

    const pieces_metadata: Array<PieceMetaData> = pieces.map((data) => {
        return {...data, view_number: data.views.length, save_number: data.saves.length, author_name: user.name as string}
    })

    return (
        <div
            className={"w-full p-3 bg-black rounded-2xl border-1 border-gray-800 flex-row flex flex-1/2 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-100  scrollbar-track-gray-700 transition-all"}>
            {pieces_metadata.map((metadata) => (
                <div key={metadata.id}><PieceMetadataThumbnailThingy metadata={metadata}/></div>
            ))}
        </div>
    )
}