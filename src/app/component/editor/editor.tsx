"use client";

import {PieceData} from "@/app/types";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import {useEffect, useState} from "react";
import PageContents from "@/app/component/editor/editor-components/page-contents";

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
            {
                editor_store.content.pages.length == 0 ?
                <div className={"text-center justify-center m-4 text-xl"}>
                    looks like you don't have any pages so far... let's change that!<br/>
                    <button onClick={() => editor_store.addPage({blocks: [], page_number:0})}>add a blank page</button>
                </div>
                :
                    <PageContents page_number={currentPage}/>
            }
            {/**/}
        </div>
    )
}