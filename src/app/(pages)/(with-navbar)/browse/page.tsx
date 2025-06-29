"use server";

import GetPieces from "@/app/api/data/pieces/get-pieces";
import {PieceMetaData} from "@/app/types";
import PieceMetadataThumbnailThingy from "@/app/component/piece/piece-metadata-thumbnail-thingy";

export default async function BrowsePage() {
    const result = await GetPieces({amount: 100, sortBy: "random"});
    let pieces: PieceMetaData[] = []
    if (result.success) {
        pieces = result.data
    }

    return (
        <div className={"bg-black w-full"}>
            <div className={"text-2xl text-center"}>browse</div>
            <div className={"w-full flex"}>
                <div
                    className={"w-full p-3 m-3 bg-black rounded-2xl border-1 border-gray-800 flex-row flex flex-wrap flex-1/2 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-100  scrollbar-track-gray-700 transition-all"}>
                    {pieces ?
                        pieces.map((piece: PieceMetaData) => <div key={piece.id}><PieceMetadataThumbnailThingy
                            metadata={piece}/></div>)
                        : <div>looks like there's nothing that matches your criteria!</div>}
                </div>
            </div>
        </div>
    )
}