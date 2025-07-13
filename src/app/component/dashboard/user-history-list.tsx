"use server";

import { prisma } from "@/app/api/data/db";
import { PieceMetaData, PublicUser } from "@/app/types";
import PieceMetadataThumbnailThingy from "@/app/component/piece/piece-metadata-thumbnail-thingy";

type UserHistoryListProps = {
    user: PublicUser;
    is_user: boolean;
};

export default async function UserHistoryList(props: UserHistoryListProps) {
    const { user, is_user } = props;

    // Don’t render if not the user
    if (!user || !is_user) {
        return null;
    }

    // Fetch views for the user
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

    // Get unique, non-null piece IDs
    const pieceIds = Array.from(
        new Set(
            views
                .map((v) => v.piece_id)
                .filter((id): id is string => id !== null)
        )
    );

    if (pieceIds.length === 0) {
        return null;
    }

    // Fetch piece details
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
            saves: true,
            // Note: views is commented out in your query — can’t use views.length below
        },
    });

    // Map to PieceMetaData array
    const pieces_metadata: PieceMetaData[] = pieces.map((piece) => ({
        ...piece,
        view_number: views.filter((v) => v.piece_id === piece.id).length,
        save_number: piece.saves.length,
        author_name: user.name as string,
    }));

    return (
        <div
            className={
                "w-full p-3 bg-black rounded-2xl border border-gray-800 flex-row flex overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-100 scrollbar-track-gray-700 transition-all"
            }
        >
            {pieces_metadata.map((metadata) => (
                <div key={metadata.id}>
                    <PieceMetadataThumbnailThingy metadata={metadata} />
                </div>
            ))}
        </div>
    );
}