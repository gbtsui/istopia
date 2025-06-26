"use client";

import {PieceData} from "@/app/types";
import {useEngineContext} from "@/app/engine/engine-context";
import {useEffect, useState} from "react";
import {RenderPage} from "@/app/engine/render-page";

type EngineComponentProps = {
    piece_data: PieceData
}

export default function EngineComponent(props: EngineComponentProps) {
    const piece_data = props.piece_data;
    const engine = useEngineContext()
    const [loading, setLoading] = useState(true)

    const first_page = Object.values(piece_data.content.pages).find(page => page.is_first)
    if (!first_page) {
        console.error("No first page defined. Piece seems to be corrupt.")
        return
    }

    useEffect(() => {
        engine.setCurrentPage(first_page.id);
        setLoading(false)
    }, [first_page])

    if (loading) return <div>loading piece...</div> //TODO: make a better looking loading screen smh ts pmo

    return (
        <RenderPage data={piece_data.content.pages[engine.currentPage.current]}/>
    )
}