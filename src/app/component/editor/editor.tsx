"use client";

import {PieceData} from "@/app/types";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import {useEffect, useState} from "react";

type EditorProps = {
    initialPieceData: PieceData;
}

export default function Editor(props: EditorProps) {
    const {initialPieceData} = props;
    const [currentPage, setCurrentPage] = useState(0);
    const editor_store = useEditorStore()
    useEffect(() => {
        editor_store.setContent(initialPieceData.content)
        setCurrentPage(0)
    }, [])

    return (
        <div>
            {editor_store.content.pages[currentPage].blocks.map((block) => {
                return <div>{block.block_id}</div>
            })}
        </div>
    )
}