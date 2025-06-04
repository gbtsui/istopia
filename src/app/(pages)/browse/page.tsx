"use server";

import GetPieces from "@/app/api/data/pieces/get-pieces";
import {PieceData} from "@/app/types";
import Link from "next/link";

export default async function BrowsePage() {
    const result = await GetPieces({amount: 100, sortBy: "random"});
    let pieces: PieceData[] = []
    if (result.success) {
        pieces = result.data
    }

    return (
        <div>
            {pieces ? pieces.map((piece: PieceData) => {
                return <div>
                    <div>
                    <Link href={`/p/${piece.id}`}>{piece.title}</Link>
                    </div>
                    <p></p>
                </div>
            }) : <div>loading...</div>}
        </div>
    )
}