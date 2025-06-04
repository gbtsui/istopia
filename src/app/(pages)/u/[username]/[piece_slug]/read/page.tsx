"use server";

import {useParams} from "next/navigation";
import FetchPieceData from "@/app/engine/fetcher";
import {PieceData} from "@/app/types";

export default async function ReadPage({params}: {params: Promise<{username: string, piece_slug: string}>}) {
    const {username, piece_slug} = await params

    //const piece_data: PieceData | null = await FetchPieceData({id: piece_id});


    return (
        <>
        so, this is awkward. <br/>
            i haven't actually implemented the system for reading pieces yet. this is very annoying.
            i'm sorry.
        </>
    )
}