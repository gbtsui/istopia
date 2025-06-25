"use server";

import {PieceMetaData, PublicUser} from "@/app/types";
import {prisma} from "@/app/api/data/db";
import Image from "next/image";
import Link from "next/link";

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
                    views: true
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
                    views: true
                }
            }
        )


    const pieces_metadata: Array<PieceMetaData> = pieces.map((data) => {
        return {...data, view_number: data.views.length, author_name: user.name as string}
    })

    console.log(pieces_metadata)
    return (
        <div
            className={"w-full p-3 bg-black rounded-2xl border-1 border-gray-800 flex-row flex flex-1/2 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-100  scrollbar-track-gray-700 transition-all"}>
            {pieces_metadata.map((metadata) => (
                <div key={metadata.id}
                     className={"w-1/2 m-2 p-2 rounded-xl h-48 flex-shrink-0 border-1 border-gray-800"}>
                    <Link href={`/u/${user.name}/${metadata.slug}`}>
                        <div className={"relative w-full p-1 rounded-xl h-2/3"}>
                            <Image
                                src={typeof metadata.cover_image_link === "string" ? metadata.cover_image_link : "https://qwdqjithytndumgsklyb.supabase.co/storage/v1/object/public/cover-image//default.png"}
                                alt={metadata.title} fill={true} objectFit={"cover"} className={"pointer-events-none"}/>
                        </div>
                        <div className={"text-lg"}>{metadata.title}</div>
                        <div className={"text-sm overflow-ellipsis"}>{metadata.summary ? metadata.summary : "this piece doesn't have a summary..."}</div>
                    </Link>
                </div>
            ))}
        </div>
    )
}