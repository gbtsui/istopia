"use server";

import GetPieces from "@/app/api/data/pieces/get-pieces";
import {PieceMetaData} from "@/app/types";
import Link from "next/link";

export default async function BrowsePage() {
    const result = await GetPieces({amount: 100, sortBy: "random"});
    let pieces: PieceMetaData[] = []
    if (result.success) {
        pieces = result.data
    }

    return (
        <div>
            <div className={"text-2xl text-center"}>browse</div>
            <div className={"flex flex-wrap"}>
                {pieces ? pieces.map((piece: PieceMetaData) => {
                    return <div key={piece.id} className={"p-3 w-1/3"}>
                        <div>
                            <Link href={`/u/${piece.author_name}/${piece.id}`}
                                  className={"text-xl"}>{piece.title}</Link>
                        </div>
                        <p>by {piece.author_name}</p>
                    </div>
                }) : <div>loading...</div>}
            </div>
        </div>
    )
}