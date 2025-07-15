"use server";

import {PieceMetaData, PublicUser} from "@/app/types";
import {prisma} from "@/app/api/data/db";
import PieceMetadataThumbnailThingy from "@/app/component/piece/piece-metadata-thumbnail-thingy";

type UserPiecesListProps = {
    user: PublicUser,
    is_user: boolean,
}

export default async function UserPiecesList(props: UserPiecesListProps) {
    const {user, is_user} = props;


    const pieces = is_user ?
        await prisma.piece.findMany(
            {
                where: {
                    author: {name: user.name},
                },
                select: {
                    id: true,
                    author_id: true,
                    title: true,
                    slug: true,
                    summary: true,
                    cover_image_link: true,
                    //views: true,
                    saves: true,
                }
            }
        )
        :
        await prisma.piece.findMany(
            {
                where: {
                    author: {name: user.name},
                    published: true,
                },
                select: {
                    id: true,
                    author_id: true,
                    title: true,
                    slug: true,
                    summary: true,
                    cover_image_link: true,
                    //views: true,
                    saves: true,
                }
            }
        )

    const ids = pieces.map(p => p.id); //i love semi-functional programming :D

    const counts = await prisma.view.groupBy({
        by: ["piece_id"],
        _count: {
            piece_id: true,
        },
        where: {
            piece_id: {
                in: ids
            }
        }
    })

    const viewCountMap = new Map<string, number>(
        counts.map((c) => [c.piece_id!, c._count.piece_id])
    )


    const pieces_metadata: Array<PieceMetaData> = pieces.map((data) => {
        return {...data, view_number: viewCountMap.get(data.id) || 0, save_number: data.saves.length, author_name: user.name as string}
    })

    console.log(pieces_metadata)
    return (
        <div
            className={"w-full p-3 bg-black rounded-2xl border-1 border-gray-800 flex-row flex flex-1/2 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-100  scrollbar-track-gray-700 transition-all"}>
            {pieces_metadata.map((metadata) => (
                <div key={metadata.id}><PieceMetadataThumbnailThingy metadata={metadata}/></div>
            ))}
        </div>
    )
}

//a man trapped in a web of fear has nowhere to run and nowhere to hide