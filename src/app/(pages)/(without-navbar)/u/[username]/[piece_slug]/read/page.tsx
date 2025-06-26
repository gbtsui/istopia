"use server";

import FetchPieceData from "@/app/engine/fetcher";
import {PieceData} from "@/app/types";
import {EngineProvider} from "@/app/engine/engine-context";
import EngineComponent from "@/app/engine/engine-component";

export default async function ReadPage({params}: {params: Promise<{username: string, piece_slug: string}>}) {
    const {username, piece_slug} = await params

    const piece_data: PieceData | null = await FetchPieceData({username, slug: piece_slug});

    if (!piece_data || !piece_data.published) return <div>looks like this piece doesn't exist :(</div>//TODO: replace with actual 404

    return (
        <EngineProvider pages={piece_data.content.pages}>
            <EngineComponent piece_data={piece_data} />
        </EngineProvider>
    )
}