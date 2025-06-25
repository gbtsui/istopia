"use server";

import {PieceMetaData, PublicUser} from "@/app/types";
import {prisma} from "@/app/api/data/db";

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
                }
            }
        )


    const pieces_metadata: Array<PieceMetaData> = pieces.map((data) => {return {...data, author_name: user.name as string}})

    return (
        <div className={"w-full p-3 bg-black rounded-2xl border-1 border-gray-800 flex-row flex flex-1/2 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-100  scrollbar-track-gray-700 transition-all"}>
            {pieces_metadata.map((metadata) => (
                <div key={metadata.id} className={"w-1/2 m-2 p-1 rounded-xl h-full flex-shrink-0"}>
                    <h1>{metadata.title}</h1>
                </div>
            ))}
            <div key={"test morbil"} className={"w-1/2 m-2 p-1 rounded-xl h-full flex-shrink-0"}>
                <h1>test morbil</h1>
            </div>
        </div>
    )
}