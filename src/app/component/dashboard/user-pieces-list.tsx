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
        <div className={"w-full p-2 bg-black rounded-2xl border-1 border-gray-800"}>
            {pieces_metadata.map((metadata) => (
                <div key={metadata.id}>{metadata.title}</div>
            ))}
        </div>
    )
}