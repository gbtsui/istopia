"use client";

import {PieceData} from "@/app/types";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import {useEffect, useState} from "react";
import PageContents from "@/app/component/editor/editor-components/page-contents";
import EditorTopBar from "@/app/component/editor/editor-components/editor-topbar";

type EditorProps = {
    initialPieceData: PieceData;
    username: string;
}

export default function Editor(props: EditorProps) {
    const {initialPieceData, username} = props;
    const [currentPage, setCurrentPage] = useState(0);
    const [lastSaved, setLastSaved] = useState(initialPieceData.last_updated);

    const editor_store = useEditorStore()
    useEffect(() => {
        editor_store.setContent(initialPieceData.content)
        setCurrentPage(0)
    }, [])

    return (
        <div>
            <div className={"flex"}>
            <EditorTopBar currentPage={currentPage} setCurrentPage={setCurrentPage} lastSaved={lastSaved} setLastSaved={setLastSaved}/>
            </div>
            {<div>
                <button onClick={() => {editor_store.saveContent(username, initialPieceData.id); setLastSaved(new Date())}} className={"p-2 bg-gray-800 rounded-xl m-2"}>Save</button>
                <p>last saved: {lastSaved.toString()} </p>{/*TODO: please fix this up to sync properly*/}
            </div>}
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