"use client";

import {PieceData} from "@/app/types";
import {useEditorMetaDataStore, useEditorStore} from "@/app/component/editor/state/zustand";
import {useEffect, useState} from "react";
import PageContents from "@/app/component/editor/editor-components/page-contents";
import EditorTopBar from "@/app/component/editor/editor-components/editor-topbar";

type EditorProps = {
    initialPieceData: PieceData;
    username: string;
}

export default function Editor(props: EditorProps) {
    const {initialPieceData, username} = props;
    const [currentPage, setCurrentPage] = useState<string|null>(null);
    const [lastSaved, setLastSaved] = useState(initialPieceData.last_updated);
    const [saving, setSaving] = useState(false);

    const editor_store = useEditorStore()
    const editorMetaDataStore = useEditorMetaDataStore()
    useEffect(() => {
        editor_store.setContent(initialPieceData.content)
        editorMetaDataStore.setData({
            author_name: username,
            author_id: initialPieceData.author_id,
            piece_id: initialPieceData.id,
            title: initialPieceData.title,
            slug: initialPieceData.slug,
            summary: initialPieceData.summary,
            published: initialPieceData.published,
        })
        setCurrentPage(1)
    }, [])

    return (
        <div>
            <div className={"flex"}>
                <EditorTopBar currentPage={currentPage} setCurrentPage={setCurrentPage} lastSaved={lastSaved}
                              saveThisWrld={() => {
                                  console.log("saving...")
                                  setSaving(true);
                                  editor_store.saveContent(username, initialPieceData.id).then((result) => {
                                      if (result.success) {
                                          console.log("saved successfully!")
                                          setLastSaved(result.data);
                                          setSaving(false);
                                      }
                                  });
                              }} totalPages={editor_store.content.pages.length}
                              saving={saving}/>
            </div>
            {
                Object.keys(editor_store.content.pages).length === 0 ?
                    <div className={"text-center justify-center m-4 text-xl"}>
                        looks like you don't have any pages so far... let's change that!<br/>
                        <button onClick={() => {editor_store.addPage(); setCurrentPage(1)}}>add a blank page
                        </button>
                    </div>
                    :
                    <PageContents page_number={currentPage}/>
            }
            {/**/}
        </div>
    )
}